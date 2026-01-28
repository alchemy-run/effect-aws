/**
 * Mermaid ASCII - Graph Renderer
 *
 * Graph/flowchart layout and rendering engine.
 * Ported from the Go implementation (cmd/graph.go, cmd/arrow.go, cmd/mapping_*.go).
 */

import { type BoxChars, getBoxChars } from "./chars.ts";
import {
  copyCanvas,
  determineDirection,
  drawBox,
  drawingToString,
  drawLine,
  getArrowHead,
  getBoxStartChar,
  getCornerChar,
  getDrawingSize,
  mergeDrawings,
  mkDrawing,
} from "./drawing.ts";
import { parseGraph } from "./parser.ts";
import {
  applyDirection,
  coordEquals,
  Direction,
  type DirectionType,
  type Drawing,
  type DrawingCoord,
  type Edge,
  getOppositeDirection,
  type GraphProperties,
  type GridCoord,
  type Node,
  type RenderConfig,
  type Subgraph,
  type TextSubgraph,
} from "./types.ts";

const BOX_BORDER_PADDING = 1;

/**
 * Graph structure for layout and rendering
 */
interface Graph {
  nodes: Node[];
  edges: Edge[];
  drawing: Drawing;
  grid: Map<string, Node>;
  columnWidth: Map<number, number>;
  rowHeight: Map<number, number>;
  subgraphs: Subgraph[];
  paddingX: number;
  paddingY: number;
  offsetX: number;
  offsetY: number;
  useAscii: boolean;
  graphDirection: "LR" | "TD";
}

function coordKey(c: GridCoord): string {
  return `${c.x},${c.y}`;
}

/**
 * Create a graph from properties
 */
function createGraph(props: GraphProperties): Graph {
  const graph: Graph = {
    nodes: [],
    edges: [],
    drawing: mkDrawing(0, 0),
    grid: new Map(),
    columnWidth: new Map(),
    rowHeight: new Map(),
    subgraphs: [],
    paddingX: props.paddingX,
    paddingY: props.paddingY,
    offsetX: 0,
    offsetY: 0,
    useAscii: props.useAscii,
    graphDirection: props.graphDirection,
  };

  let index = 0;

  // Create nodes and edges from data
  for (const [nodeName, textEdges] of props.data) {
    let parentNode = graph.nodes.find((n) => n.name === nodeName);
    if (!parentNode) {
      parentNode = {
        name: nodeName,
        index: index++,
        gridCoord: null,
        drawingCoord: null,
        drawing: null,
        drawn: false,
        styleClassName: "",
        styleClass: null,
      };
      graph.nodes.push(parentNode);
    }

    for (const textEdge of textEdges) {
      let childNode = graph.nodes.find((n) => n.name === textEdge.child.name);
      if (!childNode) {
        childNode = {
          name: textEdge.child.name,
          index: index++,
          gridCoord: null,
          drawingCoord: null,
          drawing: null,
          drawn: false,
          styleClassName: textEdge.child.styleClass,
          styleClass: null,
        };
        graph.nodes.push(childNode);
      }

      // Update style class
      if (textEdge.parent.styleClass) {
        parentNode.styleClassName = textEdge.parent.styleClass;
      }

      graph.edges.push({
        from: parentNode,
        to: childNode,
        text: textEdge.label,
        path: [],
        labelLine: [],
        startDir: Direction.Right,
        endDir: Direction.Left,
      });
    }
  }

  // Convert text subgraphs
  graph.subgraphs = convertSubgraphs(props.subgraphs, graph.nodes);

  return graph;
}

/**
 * Convert text subgraphs to subgraphs with node references
 */
function convertSubgraphs(
  textSubgraphs: TextSubgraph[],
  nodes: Node[],
): Subgraph[] {
  const subgraphs: Subgraph[] = [];

  for (const tsg of textSubgraphs) {
    const sg: Subgraph = {
      name: tsg.name,
      nodes: [],
      parent: null,
      children: [],
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };

    for (const nodeName of tsg.nodes) {
      const node = nodes.find((n) => n.name === nodeName);
      if (node) {
        sg.nodes.push(node);
      }
    }

    subgraphs.push(sg);
  }

  // Set up parent-child relationships
  for (let i = 0; i < textSubgraphs.length; i++) {
    const tsg = textSubgraphs[i];
    const sg = subgraphs[i];

    if (tsg.parent) {
      const parentIdx = textSubgraphs.indexOf(tsg.parent);
      if (parentIdx >= 0) {
        sg.parent = subgraphs[parentIdx];
      }
    }

    for (const childTsg of tsg.children) {
      const childIdx = textSubgraphs.indexOf(childTsg);
      if (childIdx >= 0) {
        sg.children.push(subgraphs[childIdx]);
      }
    }
  }

  return subgraphs;
}

/**
 * Get children of a node
 */
function getChildren(graph: Graph, node: Node): Node[] {
  return graph.edges.filter((e) => e.from.name === node.name).map((e) => e.to);
}

/**
 * Check if a grid position is free
 */
function isFreeInGrid(graph: Graph, coord: GridCoord): boolean {
  if (coord.x < 0 || coord.y < 0) return false;
  return !graph.grid.has(coordKey(coord));
}

/**
 * Reserve a spot in the grid for a node
 */
function reserveSpotInGrid(
  graph: Graph,
  node: Node,
  requested: GridCoord,
): GridCoord {
  if (graph.grid.has(coordKey(requested))) {
    // Try next position
    if (graph.graphDirection === "LR") {
      return reserveSpotInGrid(graph, node, {
        x: requested.x,
        y: requested.y + 4,
      });
    }
    return reserveSpotInGrid(graph, node, {
      x: requested.x + 4,
      y: requested.y,
    });
  }

  // Reserve 3x3 grid for the node
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      graph.grid.set(
        coordKey({ x: requested.x + x, y: requested.y + y }),
        node,
      );
    }
  }

  node.gridCoord = requested;
  return requested;
}

/**
 * Get the subgraph that a node belongs to
 * Ported from Go graph.go:321-330
 */
function getNodeSubgraph(graph: Graph, node: Node): Subgraph | null {
  for (const sg of graph.subgraphs) {
    for (const sgNode of sg.nodes) {
      if (sgNode === node) {
        return sg;
      }
    }
  }
  return null;
}

/**
 * Check if a node has incoming edges from outside its subgraph
 * Ported from Go graph.go:332-379
 */
function hasIncomingEdgeFromOutsideSubgraph(graph: Graph, node: Node): boolean {
  const nodeSubgraph = getNodeSubgraph(graph, node);
  if (nodeSubgraph === null) {
    return false; // Node not in any subgraph
  }

  // Check if any edge targets this node from outside its subgraph
  let hasExternalEdge = false;
  for (const edge of graph.edges) {
    if (edge.to === node) {
      const sourceSubgraph = getNodeSubgraph(graph, edge.from);
      // If source is not in the same subgraph (or any subgraph), it's from outside
      if (sourceSubgraph !== nodeSubgraph) {
        hasExternalEdge = true;
        break;
      }
    }
  }

  if (!hasExternalEdge) {
    return false;
  }

  // Only apply overhead if this is the topmost node in the subgraph with external edges
  // (has the lowest Y coordinate among nodes with external edges)
  for (const otherNode of nodeSubgraph.nodes) {
    if (otherNode === node || !otherNode.gridCoord || !node.gridCoord) {
      continue;
    }
    // Check if otherNode also has external edges and is at a lower Y
    let otherHasExternal = false;
    for (const edge of graph.edges) {
      if (edge.to === otherNode) {
        const sourceSubgraph = getNodeSubgraph(graph, edge.from);
        if (sourceSubgraph !== nodeSubgraph) {
          otherHasExternal = true;
          break;
        }
      }
    }
    if (otherHasExternal && otherNode.gridCoord.y < node.gridCoord.y) {
      // There's another node higher up that has external edges
      return false;
    }
  }

  return true;
}

/**
 * Set column width based on node
 * Ported from Go mapping_node.go:32-76
 */
function setColumnWidth(graph: Graph, node: Node): void {
  if (!node.gridCoord) return;

  const col1 = 1;
  const col2 = 2 * BOX_BORDER_PADDING + node.name.length;
  const col3 = 1;
  const colsToBePlaced = [col1, col2, col3];
  const rowsToBePlaced = [1, 1 + 2 * BOX_BORDER_PADDING, 1];

  for (let idx = 0; idx < colsToBePlaced.length; idx++) {
    const xCoord = node.gridCoord.x + idx;
    const current = graph.columnWidth.get(xCoord) ?? 0;
    graph.columnWidth.set(xCoord, Math.max(current, colsToBePlaced[idx]));
  }

  for (let idx = 0; idx < rowsToBePlaced.length; idx++) {
    const yCoord = node.gridCoord.y + idx;
    const current = graph.rowHeight.get(yCoord) ?? 0;
    graph.rowHeight.set(yCoord, Math.max(current, rowsToBePlaced[idx]));
  }

  // Set padding
  if (node.gridCoord.x > 0) {
    graph.columnWidth.set(node.gridCoord.x - 1, graph.paddingX);
  }
  if (node.gridCoord.y > 0) {
    let basePadding = graph.paddingY;

    // Add extra padding if node is in a subgraph AND has incoming edges from outside
    // This accounts for subgraph visual overhead (border, label, padding)
    if (hasIncomingEdgeFromOutsideSubgraph(graph, node)) {
      const subgraphOverhead = 4;
      basePadding += subgraphOverhead;
    }

    // Use max to preserve the largest padding requirement for this row
    const current = graph.rowHeight.get(node.gridCoord.y - 1) ?? 0;
    graph.rowHeight.set(node.gridCoord.y - 1, Math.max(current, basePadding));
  }
}

/**
 * A* pathfinding between grid coordinates
 */
function getPath(
  graph: Graph,
  from: GridCoord,
  to: GridCoord,
): GridCoord[] | null {
  const openSet: { coord: GridCoord; priority: number }[] = [
    { coord: from, priority: 0 },
  ];
  const costSoFar = new Map<string, number>();
  const cameFrom = new Map<string, GridCoord | null>();

  costSoFar.set(coordKey(from), 0);
  cameFrom.set(coordKey(from), null);

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  while (openSet.length > 0) {
    // Pop lowest priority
    openSet.sort((a, b) => a.priority - b.priority);
    const current = openSet.shift()!.coord;

    if (coordEquals(current, to)) {
      // Reconstruct path
      const path: GridCoord[] = [];
      let c: GridCoord | null = current;
      while (c !== null) {
        path.unshift(c);
        c = cameFrom.get(coordKey(c)) ?? null;
      }
      return path;
    }

    for (const dir of directions) {
      const next: GridCoord = { x: current.x + dir.x, y: current.y + dir.y };

      if (!isFreeInGrid(graph, next) && !coordEquals(next, to)) {
        continue;
      }

      const newCost = (costSoFar.get(coordKey(current)) ?? 0) + 1;
      const existingCost = costSoFar.get(coordKey(next));

      if (existingCost === undefined || newCost < existingCost) {
        costSoFar.set(coordKey(next), newCost);
        // Heuristic with corner penalty: straight lines are preferred
        const absX = Math.abs(next.x - to.x);
        const absY = Math.abs(next.y - to.y);
        const heuristic =
          absX === 0 || absY === 0 ? absX + absY : absX + absY + 1;
        openSet.push({ coord: next, priority: newCost + heuristic });
        cameFrom.set(coordKey(next), current);
      }
    }
  }

  return null;
}

/**
 * Merge path to remove intermediate points in same direction
 */
function mergePath(path: GridCoord[]): GridCoord[] {
  if (path.length <= 2) return path;

  const indexToRemove: number[] = [];
  let step0 = path[0];
  let step1 = path[1];

  for (let idx = 2; idx < path.length; idx++) {
    const step2 = path[idx];
    const prevDir = determineDirection(step0, step1);
    const dir = determineDirection(step1, step2);
    if (prevDir === dir) {
      indexToRemove.push(idx - 1);
    }
    step0 = step1;
    step1 = step2;
  }

  return path.filter((_, idx) => !indexToRemove.includes(idx));
}

/**
 * Determine start and end directions for an edge
 * Ported from Go direction.go:55-158
 */
function determineStartAndEndDir(
  graph: Graph,
  edge: Edge,
): [DirectionType, DirectionType, DirectionType, DirectionType] {
  if (edge.from === edge.to) {
    // Self-reference
    if (graph.graphDirection === "LR") {
      return [Direction.Right, Direction.Down, Direction.Down, Direction.Right];
    }
    return [Direction.Down, Direction.Right, Direction.Right, Direction.Down];
  }

  const fromCoord = edge.from.gridCoord!;
  const toCoord = edge.to.gridCoord!;
  const d = determineDirection(fromCoord, toCoord);

  let preferredDir: DirectionType;
  let preferredOppositeDir: DirectionType;
  let alternativeDir: DirectionType;
  let alternativeOppositeDir: DirectionType;

  // Check if this is a backwards flowing edge
  let isBackwards = false;
  if (graph.graphDirection === "LR") {
    // In LR mode, backwards flow is when edge goes from right to left
    isBackwards =
      d === Direction.Left ||
      d === Direction.UpperLeft ||
      d === Direction.LowerLeft;
  } else {
    // In TD mode, backwards flow is when edge goes from bottom to top
    isBackwards =
      d === Direction.Up ||
      d === Direction.UpperLeft ||
      d === Direction.UpperRight;
  }

  // LR: prefer vertical over horizontal
  // TD: prefer horizontal over vertical
  if (d === Direction.LowerRight) {
    if (graph.graphDirection === "LR") {
      preferredDir = Direction.Down;
      preferredOppositeDir = Direction.Left;
      alternativeDir = Direction.Right;
      alternativeOppositeDir = Direction.Up;
    } else {
      preferredDir = Direction.Right;
      preferredOppositeDir = Direction.Up;
      alternativeDir = Direction.Down;
      alternativeOppositeDir = Direction.Left;
    }
  } else if (d === Direction.UpperRight) {
    if (graph.graphDirection === "LR") {
      preferredDir = Direction.Up;
      preferredOppositeDir = Direction.Left;
      alternativeDir = Direction.Right;
      alternativeOppositeDir = Direction.Down;
    } else {
      preferredDir = Direction.Right;
      preferredOppositeDir = Direction.Down;
      alternativeDir = Direction.Up;
      alternativeOppositeDir = Direction.Left;
    }
  } else if (d === Direction.LowerLeft) {
    if (graph.graphDirection === "LR") {
      // Backwards flow in LR mode - start from Down, arrive at Down
      preferredDir = Direction.Down;
      preferredOppositeDir = Direction.Down;
      alternativeDir = Direction.Left;
      alternativeOppositeDir = Direction.Up;
    } else {
      preferredDir = Direction.Left;
      preferredOppositeDir = Direction.Up;
      alternativeDir = Direction.Down;
      alternativeOppositeDir = Direction.Right;
    }
  } else if (d === Direction.UpperLeft) {
    if (graph.graphDirection === "LR") {
      // Backwards flow in LR mode - start from Down, arrive at Down
      preferredDir = Direction.Down;
      preferredOppositeDir = Direction.Down;
      alternativeDir = Direction.Left;
      alternativeOppositeDir = Direction.Down;
    } else {
      // Backwards flow in TD mode - start from Right, arrive at Right
      preferredDir = Direction.Right;
      preferredOppositeDir = Direction.Right;
      alternativeDir = Direction.Up;
      alternativeOppositeDir = Direction.Right;
    }
  } else if (isBackwards) {
    // Handle direct backwards flow cases
    if (graph.graphDirection === "LR" && d === Direction.Left) {
      // Direct left flow in LR mode - start from Down, arrive at Down
      preferredDir = Direction.Down;
      preferredOppositeDir = Direction.Down;
      alternativeDir = Direction.Left;
      alternativeOppositeDir = Direction.Right;
    } else if (graph.graphDirection === "TD" && d === Direction.Up) {
      // Direct up flow in TD mode - start from Right, arrive at Right
      preferredDir = Direction.Right;
      preferredOppositeDir = Direction.Right;
      alternativeDir = Direction.Up;
      alternativeOppositeDir = Direction.Down;
    } else {
      preferredDir = d;
      preferredOppositeDir = getOppositeDirection(d);
      alternativeDir = d;
      alternativeOppositeDir = preferredOppositeDir;
    }
  } else {
    preferredDir = d;
    preferredOppositeDir = getOppositeDirection(d);
    alternativeDir = d;
    alternativeOppositeDir = preferredOppositeDir;
  }

  return [
    preferredDir,
    preferredOppositeDir,
    alternativeDir,
    alternativeOppositeDir,
  ];
}

/**
 * Determine the path for an edge
 * Ported from Go mapping_edge.go:19-68 - tries both paths and picks shorter
 */
function determinePath(graph: Graph, edge: Edge): void {
  const [prefDir, prefOppDir, altDir, altOppDir] = determineStartAndEndDir(
    graph,
    edge,
  );

  // Get preferred path
  const prefFrom = applyDirection(edge.from.gridCoord!, prefDir);
  const prefTo = applyDirection(edge.to.gridCoord!, prefOppDir);
  const preferredPathRaw = getPath(graph, prefFrom, prefTo);

  if (!preferredPathRaw) {
    // If we can't get the preferred path, use alternative directions
    edge.startDir = altDir;
    edge.endDir = altOppDir;
    edge.path = [];
    return;
  }

  const preferredPath = mergePath(preferredPathRaw);

  // Get alternative path
  const altFrom = applyDirection(edge.from.gridCoord!, altDir);
  const altTo = applyDirection(edge.to.gridCoord!, altOppDir);
  const alternativePathRaw = getPath(graph, altFrom, altTo);

  if (!alternativePathRaw) {
    // No alternative path, use preferred
    edge.startDir = prefDir;
    edge.endDir = prefOppDir;
    edge.path = preferredPath;
    return;
  }

  const alternativePath = mergePath(alternativePathRaw);

  // Compare lengths and use shorter one
  if (preferredPath.length <= alternativePath.length) {
    edge.startDir = prefDir;
    edge.endDir = prefOppDir;
    edge.path = preferredPath;
  } else {
    edge.startDir = altDir;
    edge.endDir = altOppDir;
    edge.path = alternativePath;
  }
}

/**
 * Increase grid size for edge paths
 */
function increaseGridSizeForPath(graph: Graph, path: GridCoord[]): void {
  for (const c of path) {
    if (!graph.columnWidth.has(c.x)) {
      graph.columnWidth.set(c.x, Math.floor(graph.paddingX / 2));
    }
    if (!graph.rowHeight.has(c.y)) {
      graph.rowHeight.set(c.y, Math.floor(graph.paddingY / 2));
    }
  }
}

/**
 * Calculate the width of a line segment in drawing coordinates
 */
function calculateLineWidth(
  graph: Graph,
  line: [GridCoord, GridCoord],
): number {
  let totalSize = 0;
  const [start, end] = line;

  // Calculate based on column widths between start and end
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  for (let x = minX; x <= maxX; x++) {
    totalSize += graph.columnWidth.get(x) ?? 0;
  }

  return totalSize;
}

/**
 * Determine which line segment on the path should contain the label
 * Ported from Go mapping_edge.go:71-108
 */
function determineLabelLine(graph: Graph, edge: Edge): void {
  const labelLen = edge.text.length;
  if (labelLen === 0 || edge.path.length < 2) {
    return;
  }

  let prevStep = edge.path[0];
  let largestLine: [GridCoord, GridCoord] = [prevStep, edge.path[1]];
  let largestLineSize = 0;

  for (let i = 1; i < edge.path.length; i++) {
    const step = edge.path[i];
    const line: [GridCoord, GridCoord] = [prevStep, step];
    const lineWidth = calculateLineWidth(graph, line);

    if (lineWidth >= labelLen) {
      largestLine = line;
      break;
    } else if (lineWidth > largestLineSize) {
      largestLineSize = lineWidth;
      largestLine = line;
    }
    prevStep = step;
  }

  // Increase column width to fit label
  const minX = Math.min(largestLine[0].x, largestLine[1].x);
  const maxX = Math.max(largestLine[0].x, largestLine[1].x);
  const middleX = minX + Math.floor((maxX - minX) / 2);

  const currentWidth = graph.columnWidth.get(middleX) ?? 0;
  graph.columnWidth.set(middleX, Math.max(currentWidth, labelLen + 2));

  edge.labelLine = [largestLine[0], largestLine[1]];
}

/**
 * Draw edge label on the path
 */
function drawArrowLabel(graph: Graph, edge: Edge): Drawing {
  const d = copyCanvas(graph.drawing);
  const labelLen = edge.text.length;

  if (labelLen === 0 || edge.labelLine.length < 2) {
    return d;
  }

  // Convert label line to drawing coordinates
  const line = [
    gridToDrawingCoord(graph, edge.labelLine[0]),
    gridToDrawingCoord(graph, edge.labelLine[1]),
  ];

  // Calculate middle of the line
  const minX = Math.min(line[0].x, line[1].x);
  const maxX = Math.max(line[0].x, line[1].x);
  const minY = Math.min(line[0].y, line[1].y);
  const maxY = Math.max(line[0].y, line[1].y);

  const middleX = minX + Math.floor((maxX - minX) / 2);
  const middleY = minY + Math.floor((maxY - minY) / 2);

  // Draw text centered on the line
  const startX = middleX - Math.floor(labelLen / 2);
  for (let i = 0; i < labelLen; i++) {
    if (startX + i >= 0 && startX + i < d.length && middleY < d[0].length) {
      d[startX + i][middleY] = edge.text[i];
    }
  }

  return d;
}

/**
 * Convert grid coordinate to drawing coordinate
 */
function gridToDrawingCoord(graph: Graph, c: GridCoord): DrawingCoord {
  let x = 0;
  let y = 0;

  for (let col = 0; col < c.x; col++) {
    x += graph.columnWidth.get(col) ?? 0;
  }
  for (let row = 0; row < c.y; row++) {
    y += graph.rowHeight.get(row) ?? 0;
  }

  const colWidth = graph.columnWidth.get(c.x) ?? 0;
  const rowHeight = graph.rowHeight.get(c.y) ?? 0;

  return {
    x: x + Math.floor(colWidth / 2) + graph.offsetX,
    y: y + Math.floor(rowHeight / 2) + graph.offsetY,
  };
}

/**
 * Calculate bounding boxes for all subgraphs
 * Ported from Go graph.go:299-308
 */
function calculateSubgraphBoundingBoxes(graph: Graph): void {
  // Process each subgraph (innermost first due to recursive call)
  for (const sg of graph.subgraphs) {
    calculateSubgraphBoundingBox(graph, sg);
  }

  // Ensure minimum spacing between subgraphs
  ensureSubgraphSpacing(graph);
}

/**
 * Calculate bounding box for a single subgraph
 * Ported from Go graph.go:434-483
 */
function calculateSubgraphBoundingBox(graph: Graph, sg: Subgraph): void {
  if (sg.nodes.length === 0) {
    return;
  }

  // Start with impossible bounds
  let minX = 1000000;
  let minY = 1000000;
  let maxX = -1000000;
  let maxY = -1000000;

  // First, calculate bounding box for all child subgraphs
  for (const child of sg.children) {
    calculateSubgraphBoundingBox(graph, child);
    if (child.nodes.length > 0) {
      minX = Math.min(minX, child.minX);
      minY = Math.min(minY, child.minY);
      maxX = Math.max(maxX, child.maxX);
      maxY = Math.max(maxY, child.maxY);
    }
  }

  // Then include all direct nodes using drawing coordinates
  for (const node of sg.nodes) {
    if (!node.drawingCoord || !node.drawing) {
      continue;
    }

    // Get the actual bounds of the node's drawing
    const nodeMinX = node.drawingCoord.x;
    const nodeMinY = node.drawingCoord.y;
    const { width, height } = getDrawingSize(node.drawing);
    const nodeMaxX = nodeMinX + width;
    const nodeMaxY = nodeMinY + height;

    minX = Math.min(minX, nodeMinX);
    minY = Math.min(minY, nodeMinY);
    maxX = Math.max(maxX, nodeMaxX);
    maxY = Math.max(maxY, nodeMaxY);
  }

  // Add padding (allow negative coordinates, we'll offset later)
  const subgraphPadding = 2;
  const subgraphLabelSpace = 2; // Extra space for label at top
  sg.minX = minX - subgraphPadding;
  sg.minY = minY - subgraphPadding - subgraphLabelSpace;
  sg.maxX = maxX + subgraphPadding;
  sg.maxY = maxY + subgraphPadding;
}

/**
 * Ensure minimum spacing between subgraphs
 * Ported from Go graph.go:381-432
 */
function ensureSubgraphSpacing(graph: Graph): void {
  const minSpacing = 1; // Minimum lines between subgraphs

  // Only check root-level subgraphs (those without parents)
  const rootSubgraphs = graph.subgraphs.filter(
    (sg) => sg.parent === null && sg.nodes.length > 0,
  );

  // Check each pair of root subgraphs for overlaps
  for (let i = 0; i < rootSubgraphs.length; i++) {
    for (let j = i + 1; j < rootSubgraphs.length; j++) {
      const sg1 = rootSubgraphs[i];
      const sg2 = rootSubgraphs[j];

      // Vertical overlap check (for TD layout)
      if (sg1.minX < sg2.maxX && sg1.maxX > sg2.minX) {
        // They share the same X space, check Y spacing
        if (sg1.maxY >= sg2.minY - minSpacing && sg1.minY < sg2.minY) {
          // sg1 is above sg2 and too close
          sg2.minY = sg1.maxY + minSpacing + 1;
        } else if (sg2.maxY >= sg1.minY - minSpacing && sg2.minY < sg1.minY) {
          // sg2 is above sg1 and too close
          sg1.minY = sg2.maxY + minSpacing + 1;
        }
      }

      // Horizontal overlap check (for LR layout)
      if (sg1.minY < sg2.maxY && sg1.maxY > sg2.minY) {
        // They share the same Y space, check X spacing
        if (sg1.maxX >= sg2.minX - minSpacing && sg1.minX < sg2.minX) {
          // sg1 is left of sg2 and too close
          sg2.minX = sg1.maxX + minSpacing + 1;
        } else if (sg2.maxX >= sg1.minX - minSpacing && sg2.minX < sg1.minX) {
          // sg2 is left of sg1 and too close
          sg1.minX = sg2.maxX + minSpacing + 1;
        }
      }
    }
  }
}

/**
 * Offset drawing for subgraphs with negative coordinates
 * Ported from Go graph.go:485-527
 */
function offsetDrawingForSubgraphs(graph: Graph): void {
  if (graph.subgraphs.length === 0) {
    return;
  }

  // Find the minimum coordinates across all subgraphs
  let minX = 0;
  let minY = 0;
  for (const sg of graph.subgraphs) {
    minX = Math.min(minX, sg.minX);
    minY = Math.min(minY, sg.minY);
  }

  // If we have negative coordinates, we need to offset everything
  const offsetX = -minX;
  const offsetY = -minY;

  if (offsetX === 0 && offsetY === 0) {
    return;
  }

  // Store the offset in the graph
  graph.offsetX += offsetX;
  graph.offsetY += offsetY;

  // Offset all subgraph coordinates
  for (const sg of graph.subgraphs) {
    sg.minX += offsetX;
    sg.minY += offsetY;
    sg.maxX += offsetX;
    sg.maxY += offsetY;
  }

  // Offset all node coordinates (they were set before offset was calculated)
  for (const node of graph.nodes) {
    if (node.drawingCoord) {
      node.drawingCoord.x += offsetX;
      node.drawingCoord.y += offsetY;
    }
  }
}

/**
 * Draw subgraph boxes
 * Ported from Go draw.go:240-304 and graph.go:566-577
 */
function drawSubgraphs(graph: Graph, chars: BoxChars): Drawing {
  const d = copyCanvas(graph.drawing);

  // Sort subgraphs by depth (outermost first)
  const sorted = sortSubgraphsByDepth(graph);

  for (const sg of sorted) {
    if (sg.nodes.length === 0) continue;

    // Use the pre-calculated bounding box (now in drawing coordinates)
    const width = sg.maxX - sg.minX;
    const height = sg.maxY - sg.minY;

    if (width <= 0 || height <= 0) continue;

    // Create subgraph drawing
    const sgDrawing = mkDrawing(width, height);

    // Draw box borders
    // Top border
    for (let x = 1; x < width; x++) {
      sgDrawing[x][0] = chars.horizontal;
    }
    // Bottom border
    for (let x = 1; x < width; x++) {
      sgDrawing[x][height] = chars.horizontal;
    }
    // Left border
    for (let y = 1; y < height; y++) {
      sgDrawing[0][y] = chars.vertical;
    }
    // Right border
    for (let y = 1; y < height; y++) {
      sgDrawing[width][y] = chars.vertical;
    }

    // Draw corners
    sgDrawing[0][0] = chars.topLeft;
    sgDrawing[width][0] = chars.topRight;
    sgDrawing[0][height] = chars.bottomLeft;
    sgDrawing[width][height] = chars.bottomRight;

    // Merge at the subgraph's position
    for (let x = 0; x <= width; x++) {
      for (let y = 0; y <= height; y++) {
        const destX = sg.minX + x;
        const destY = sg.minY + y;
        if (
          destX >= 0 &&
          destX < d.length &&
          destY >= 0 &&
          destY < d[0].length
        ) {
          const c = sgDrawing[x][y];
          if (c !== " ") {
            d[destX][destY] = c;
          }
        }
      }
    }
  }

  return d;
}

/**
 * Sort subgraphs by depth (outermost first)
 * Ported from Go graph.go:591-612
 */
function sortSubgraphsByDepth(graph: Graph): Subgraph[] {
  const depths = new Map<Subgraph, number>();

  const getDepth = (sg: Subgraph): number => {
    if (sg.parent === null) {
      return 0;
    }
    return 1 + getDepth(sg.parent);
  };

  for (const sg of graph.subgraphs) {
    depths.set(sg, getDepth(sg));
  }

  return [...graph.subgraphs].sort(
    (a, b) => (depths.get(a) ?? 0) - (depths.get(b) ?? 0),
  );
}

/**
 * Draw subgraph labels - drawn separately so arrows don't overwrite them
 * Ported from Go draw.go:306-334 and graph.go:579-589
 */
function drawSubgraphLabels(graph: Graph): Drawing {
  const d = copyCanvas(graph.drawing);

  for (const sg of graph.subgraphs) {
    if (sg.nodes.length === 0 || sg.name.length === 0) continue;

    // Calculate dimensions
    const width = sg.maxX - sg.minX;
    const height = sg.maxY - sg.minY;

    if (width <= 0 || height <= 0) continue;

    // Draw label centered at top (Go: labelY = from.y + 1)
    const labelY = sg.minY + 1;
    // Go: labelX = from.x + width/2 - len(sg.name)/2
    const labelX =
      sg.minX + Math.floor(width / 2) - Math.floor(sg.name.length / 2);

    // Ensure label is at least 1 char from left border
    const adjustedLabelX = Math.max(sg.minX + 1, labelX);

    for (let i = 0; i < sg.name.length; i++) {
      const destX = adjustedLabelX + i;
      if (
        destX >= 0 &&
        destX < d.length &&
        destX < sg.maxX && // Don't go past right border
        labelY >= 0 &&
        labelY < d[0].length
      ) {
        d[destX][labelY] = sg.name[i];
      }
    }
  }

  return d;
}

/**
 * Check if a node is in any subgraph
 * Ported from Go graph.go:310-319
 */
function isNodeInAnySubgraph(graph: Graph, node: Node): boolean {
  for (const sg of graph.subgraphs) {
    for (const sgNode of sg.nodes) {
      if (sgNode === node) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Create node layout mapping
 * Ported from Go graph.go:157-297
 */
function createMapping(graph: Graph): void {
  const highestPositionPerLevel: number[] = new Array(100).fill(0);

  // Find root nodes (nodes with no incoming edges)
  const nodesFound = new Set<string>();
  const rootNodes: Node[] = [];

  for (const node of graph.nodes) {
    if (!nodesFound.has(node.name)) {
      rootNodes.push(node);
    }
    nodesFound.add(node.name);
    for (const child of getChildren(graph, node)) {
      nodesFound.add(child.name);
    }
  }

  // Check if we have a mix of external and subgraph root nodes with edges in subgraphs
  // This indicates we should separate them visually in LR layout
  let hasExternalRoots = false;
  let hasSubgraphRootsWithEdges = false;
  for (const node of rootNodes) {
    if (isNodeInAnySubgraph(graph, node)) {
      // Check if this node or any node in its subgraph has children
      if (getChildren(graph, node).length > 0) {
        hasSubgraphRootsWithEdges = true;
      }
    } else {
      hasExternalRoots = true;
    }
  }

  // Separate root nodes by whether they're in subgraphs, but only if we have both types
  // AND there are edges in subgraphs (indicating intentional layout structure)
  const shouldSeparate =
    graph.graphDirection === "LR" &&
    hasExternalRoots &&
    hasSubgraphRootsWithEdges;

  const externalRootNodes: Node[] = [];
  const subgraphRootNodes: Node[] = [];
  if (shouldSeparate) {
    for (const node of rootNodes) {
      if (isNodeInAnySubgraph(graph, node)) {
        subgraphRootNodes.push(node);
      } else {
        externalRootNodes.push(node);
      }
    }
  } else {
    // Treat all root nodes the same
    externalRootNodes.push(...rootNodes);
  }

  // Place external root nodes first at level 0
  for (const node of externalRootNodes) {
    let mappingCoord: GridCoord;
    if (graph.graphDirection === "LR") {
      mappingCoord = reserveSpotInGrid(graph, node, {
        x: 0,
        y: highestPositionPerLevel[0],
      });
    } else {
      mappingCoord = reserveSpotInGrid(graph, node, {
        x: highestPositionPerLevel[0],
        y: 0,
      });
    }
    highestPositionPerLevel[0] += 4;
  }

  // Place subgraph root nodes at level 4 (one level to the right/down of external nodes)
  // This creates visual separation between external nodes and subgraphs
  if (shouldSeparate && subgraphRootNodes.length > 0) {
    const subgraphLevel = 4;
    for (const node of subgraphRootNodes) {
      let mappingCoord: GridCoord;
      if (graph.graphDirection === "LR") {
        mappingCoord = reserveSpotInGrid(graph, node, {
          x: subgraphLevel,
          y: highestPositionPerLevel[subgraphLevel] ?? 0,
        });
      } else {
        mappingCoord = reserveSpotInGrid(graph, node, {
          x: highestPositionPerLevel[subgraphLevel] ?? 0,
          y: subgraphLevel,
        });
      }
      highestPositionPerLevel[subgraphLevel] =
        (highestPositionPerLevel[subgraphLevel] ?? 0) + 4;
    }
  }

  // Place children
  for (const node of graph.nodes) {
    if (!node.gridCoord) continue;

    const childLevel =
      graph.graphDirection === "LR"
        ? node.gridCoord.x + 4
        : node.gridCoord.y + 4;
    const highestPosition = highestPositionPerLevel[childLevel] ?? 0;

    for (const child of getChildren(graph, node)) {
      if (child.gridCoord) continue;

      let mappingCoord: GridCoord;
      if (graph.graphDirection === "LR") {
        mappingCoord = reserveSpotInGrid(graph, child, {
          x: childLevel,
          y: highestPosition,
        });
      } else {
        mappingCoord = reserveSpotInGrid(graph, child, {
          x: highestPosition,
          y: childLevel,
        });
      }
      highestPositionPerLevel[childLevel] = highestPosition + 4;
    }
  }

  // Set column widths
  for (const node of graph.nodes) {
    setColumnWidth(graph, node);
  }

  // Determine edge paths
  for (const edge of graph.edges) {
    determinePath(graph, edge);
    increaseGridSizeForPath(graph, edge.path);
  }

  // Determine label lines and increase column widths for labels
  for (const edge of graph.edges) {
    determineLabelLine(graph, edge);
  }

  // Set drawing coordinates for nodes FIRST (Go: graph.go:285-289)
  for (const node of graph.nodes) {
    if (node.gridCoord) {
      node.drawingCoord = gridToDrawingCoord(graph, node.gridCoord);
    }
  }

  // Set node drawings for dimension info (Go: node.setDrawing)
  const chars = getBoxChars(graph.useAscii);
  for (const node of graph.nodes) {
    if (node.gridCoord) {
      // Calculate box dimensions
      let w = 0;
      for (let i = 0; i < 2; i++) {
        w += graph.columnWidth.get(node.gridCoord.x + i) ?? 0;
      }
      let h = 0;
      for (let i = 0; i < 2; i++) {
        h += graph.rowHeight.get(node.gridCoord.y + i) ?? 0;
      }
      node.drawing = drawBox(w, h, node.name, chars);
    }
  }

  // Set initial drawing size (Go: setDrawingSizeToGridConstraints)
  let baseMaxX = 0;
  let baseMaxY = 0;
  for (const [_, w] of graph.columnWidth) {
    baseMaxX += w;
  }
  for (const [_, h] of graph.rowHeight) {
    baseMaxY += h;
  }
  graph.drawing = mkDrawing(baseMaxX, baseMaxY);

  // Calculate subgraph bounding boxes AFTER nodes are positioned (Go: graph.go:293)
  calculateSubgraphBoundingBoxes(graph);

  // Offset everything if subgraphs have negative coordinates (Go: graph.go:296)
  offsetDrawingForSubgraphs(graph);

  // Resize drawing to account for offsets AND subgraph bounds
  let finalMaxX = baseMaxX + graph.offsetX;
  let finalMaxY = baseMaxY + graph.offsetY;

  // Ensure drawing is big enough to contain all subgraphs
  for (const sg of graph.subgraphs) {
    if (sg.nodes.length > 0) {
      finalMaxX = Math.max(finalMaxX, sg.maxX + 1);
      finalMaxY = Math.max(finalMaxY, sg.maxY + 1);
    }
  }

  graph.drawing = mkDrawing(finalMaxX, finalMaxY);
}

/**
 * Draw a node on the graph
 */
function drawNode(graph: Graph, node: Node, chars: BoxChars): void {
  if (!node.gridCoord || !node.drawingCoord) return;

  // Calculate box dimensions
  let w = 0;
  for (let i = 0; i < 2; i++) {
    w += graph.columnWidth.get(node.gridCoord.x + i) ?? 0;
  }
  let h = 0;
  for (let i = 0; i < 2; i++) {
    h += graph.rowHeight.get(node.gridCoord.y + i) ?? 0;
  }

  const nodeDrawing = drawBox(w, h, node.name, chars);
  graph.drawing = mergeDrawings(
    graph.drawing,
    node.drawingCoord,
    [nodeDrawing],
    graph.useAscii,
  );
  node.drawn = true;
}

/**
 * Draw an edge path
 */
function drawEdgePath(
  graph: Graph,
  edge: Edge,
  chars: BoxChars,
): {
  lines: Drawing;
  corners: Drawing;
  arrowHead: Drawing;
  boxStart: Drawing;
} {
  if (edge.path.length === 0) {
    return {
      lines: mkDrawing(0, 0),
      corners: mkDrawing(0, 0),
      arrowHead: mkDrawing(0, 0),
      boxStart: mkDrawing(0, 0),
    };
  }

  const lines = copyCanvas(graph.drawing);
  const corners = copyCanvas(graph.drawing);
  const arrowHead = copyCanvas(graph.drawing);
  const boxStart = copyCanvas(graph.drawing);

  // Draw path segments
  let linesDrawn: DrawingCoord[][] = [];
  let lineDirs: DirectionType[] = [];
  let prevCoord = edge.path[0];

  for (let i = 1; i < edge.path.length; i++) {
    const nextCoord = edge.path[i];
    const prevDrawing = gridToDrawingCoord(graph, prevCoord);
    const nextDrawing = gridToDrawingCoord(graph, nextCoord);

    if (coordEquals(prevDrawing, nextDrawing)) continue;

    const dir = determineDirection(prevCoord, nextCoord);
    const drawnCoords = drawLine(lines, prevDrawing, nextDrawing, 1, -1, chars);

    if (drawnCoords.length === 0) {
      drawnCoords.push(prevDrawing);
    }

    linesDrawn.push(drawnCoords);
    lineDirs.push(dir);
    prevCoord = nextCoord;
  }

  // Draw box start - only for Unicode mode (Go code skips this for ASCII)
  if (!graph.useAscii && linesDrawn.length > 0 && linesDrawn[0].length > 0) {
    const from = linesDrawn[0][0];
    const startDir = determineDirection(edge.path[0], edge.path[1]);
    const startChar = getBoxStartChar(startDir, chars);

    if (startDir === Direction.Up) {
      boxStart[from.x][from.y + 1] = startChar;
    } else if (startDir === Direction.Down) {
      boxStart[from.x][from.y - 1] = startChar;
    } else if (startDir === Direction.Left) {
      boxStart[from.x + 1][from.y] = startChar;
    } else if (startDir === Direction.Right) {
      boxStart[from.x - 1][from.y] = startChar;
    }
  }

  // Draw arrow head
  if (linesDrawn.length > 0) {
    const lastLine = linesDrawn[linesDrawn.length - 1];
    if (lastLine.length > 0) {
      const lastPos = lastLine[lastLine.length - 1];
      const dir = lineDirs[lineDirs.length - 1];
      arrowHead[lastPos.x][lastPos.y] = getArrowHead(dir, edge.endDir, chars);
    }
  }

  // Draw corners
  for (let idx = 1; idx < edge.path.length - 1; idx++) {
    const coord = edge.path[idx];
    const drawingCoord = gridToDrawingCoord(graph, coord);
    const prevDir = determineDirection(edge.path[idx - 1], coord);
    const nextDir = determineDirection(coord, edge.path[idx + 1]);
    corners[drawingCoord.x][drawingCoord.y] = getCornerChar(
      prevDir,
      nextDir,
      chars,
    );
  }

  return { lines, corners, arrowHead, boxStart };
}

/**
 * Draw the graph
 * Order matches Go: subgraph boxes -> nodes -> edges -> subgraph labels (last)
 */
function drawGraph(graph: Graph): void {
  const chars = getBoxChars(graph.useAscii);

  // Draw subgraph BOXES first (so they appear behind nodes)
  if (graph.subgraphs.length > 0) {
    const subgraphBoxes = drawSubgraphs(graph, chars);
    graph.drawing = mergeDrawings(
      graph.drawing,
      { x: 0, y: 0 },
      [subgraphBoxes],
      graph.useAscii,
    );
  }

  // Draw nodes
  for (const node of graph.nodes) {
    if (!node.drawn) {
      drawNode(graph, node, chars);
    }
  }

  // Draw edges
  const allLines: Drawing[] = [];
  const allCorners: Drawing[] = [];
  const allArrowHeads: Drawing[] = [];
  const allBoxStarts: Drawing[] = [];
  const allLabels: Drawing[] = [];

  for (const edge of graph.edges) {
    const { lines, corners, arrowHead, boxStart } = drawEdgePath(
      graph,
      edge,
      chars,
    );
    allLines.push(lines);
    allCorners.push(corners);
    allArrowHeads.push(arrowHead);
    allBoxStarts.push(boxStart);

    // Draw edge label
    if (edge.text.length > 0) {
      allLabels.push(drawArrowLabel(graph, edge));
    }
  }

  // Merge in order: lines, corners, arrow heads, box starts, labels
  graph.drawing = mergeDrawings(
    graph.drawing,
    { x: 0, y: 0 },
    allLines,
    graph.useAscii,
  );
  graph.drawing = mergeDrawings(
    graph.drawing,
    { x: 0, y: 0 },
    allCorners,
    graph.useAscii,
  );
  graph.drawing = mergeDrawings(
    graph.drawing,
    { x: 0, y: 0 },
    allArrowHeads,
    graph.useAscii,
  );
  graph.drawing = mergeDrawings(
    graph.drawing,
    { x: 0, y: 0 },
    allBoxStarts,
    graph.useAscii,
  );
  graph.drawing = mergeDrawings(
    graph.drawing,
    { x: 0, y: 0 },
    allLabels,
    graph.useAscii,
  );

  // Draw subgraph LABELS last so arrows don't overwrite them (Go: graph.go:561)
  if (graph.subgraphs.length > 0) {
    const subgraphLabels = drawSubgraphLabels(graph);
    graph.drawing = mergeDrawings(
      graph.drawing,
      { x: 0, y: 0 },
      [subgraphLabels],
      graph.useAscii,
    );
  }
}

/**
 * Render a graph/flowchart mermaid diagram to ASCII
 */
export function renderGraph(input: string, config: RenderConfig = {}): string {
  const props = parseGraph(input);
  props.useAscii = config.ascii ?? false;
  if (config.paddingX !== undefined) props.paddingX = config.paddingX;
  if (config.paddingY !== undefined) props.paddingY = config.paddingY;

  const graph = createGraph(props);
  createMapping(graph);
  drawGraph(graph);

  return drawingToString(graph.drawing);
}
