/**
 * Mermaid ASCII - Drawing Canvas
 *
 * 2D character canvas operations for rendering diagrams.
 * Ported from the Go implementation (cmd/draw.go).
 */

import { type BoxChars, isJunctionChar, mergeJunctions } from "./chars.ts";
import {
  type Coord,
  Direction,
  type DirectionType,
  type Drawing,
  type DrawingCoord,
} from "./types.ts";

/**
 * Create a new drawing canvas filled with spaces
 */
export function mkDrawing(width: number, height: number): Drawing {
  const drawing: Drawing = [];
  for (let x = 0; x <= width; x++) {
    drawing[x] = [];
    for (let y = 0; y <= height; y++) {
      drawing[x][y] = " ";
    }
  }
  return drawing;
}

/**
 * Get the dimensions of a drawing
 */
export function getDrawingSize(d: Drawing): { width: number; height: number } {
  if (d.length === 0) return { width: 0, height: 0 };
  return { width: d.length - 1, height: d[0].length - 1 };
}

/**
 * Copy a drawing canvas (for creating overlays)
 */
export function copyCanvas(d: Drawing): Drawing {
  const { width, height } = getDrawingSize(d);
  return mkDrawing(width, height);
}

/**
 * Increase the size of a drawing to fit new content
 */
export function increaseSize(d: Drawing, x: number, y: number): Drawing {
  const { width: currWidth, height: currHeight } = getDrawingSize(d);
  const newWidth = Math.max(x, currWidth);
  const newHeight = Math.max(y, currHeight);
  const newDrawing = mkDrawing(newWidth, newHeight);

  // Copy existing content
  for (let xi = 0; xi < d.length; xi++) {
    for (let yi = 0; yi < d[xi].length; yi++) {
      newDrawing[xi][yi] = d[xi][yi];
    }
  }

  return newDrawing;
}

/**
 * Merge multiple drawings onto a base drawing
 */
export function mergeDrawings(
  baseDrawing: Drawing,
  mergeCoord: DrawingCoord,
  drawings: Drawing[],
  useAscii: boolean,
): Drawing {
  // Find maximum dimensions
  let { width: maxX, height: maxY } = getDrawingSize(baseDrawing);
  for (const d of drawings) {
    const { width, height } = getDrawingSize(d);
    maxX = Math.max(maxX, width + mergeCoord.x);
    maxY = Math.max(maxY, height + mergeCoord.y);
  }

  // Create merged drawing
  const merged = mkDrawing(maxX, maxY);

  // Copy base drawing
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      if (x < baseDrawing.length && y < baseDrawing[x].length) {
        merged[x][y] = baseDrawing[x][y];
      }
    }
  }

  // Merge other drawings
  for (const d of drawings) {
    const { width, height } = getDrawingSize(d);
    for (let x = 0; x <= width; x++) {
      for (let y = 0; y <= height; y++) {
        const c = d[x][y];
        if (c !== " ") {
          const targetX = x + mergeCoord.x;
          const targetY = y + mergeCoord.y;
          const currentChar = merged[targetX][targetY];
          if (!useAscii && isJunctionChar(c) && isJunctionChar(currentChar)) {
            merged[targetX][targetY] = mergeJunctions(currentChar, c);
          } else {
            merged[targetX][targetY] = c;
          }
        }
      }
    }
  }

  return merged;
}

/**
 * Convert a drawing to a string
 */
export function drawingToString(d: Drawing): string {
  const { width, height } = getDrawingSize(d);
  const lines: string[] = [];

  for (let y = 0; y <= height; y++) {
    let line = "";
    for (let x = 0; x <= width; x++) {
      line += d[x][y];
    }
    lines.push(line);
  }

  return lines.join("\n");
}

/**
 * Determine direction from one coordinate to another
 */
export function determineDirection(from: Coord, to: Coord): DirectionType {
  if (from.x === to.x) {
    return from.y < to.y ? Direction.Down : Direction.Up;
  }
  if (from.y === to.y) {
    return from.x < to.x ? Direction.Right : Direction.Left;
  }
  if (from.x < to.x) {
    return from.y < to.y ? Direction.LowerRight : Direction.UpperRight;
  }
  return from.y < to.y ? Direction.LowerLeft : Direction.UpperLeft;
}

/**
 * Draw a line between two points on the canvas
 */
export function drawLine(
  d: Drawing,
  from: DrawingCoord,
  to: DrawingCoord,
  offsetFrom: number,
  offsetTo: number,
  chars: BoxChars,
): DrawingCoord[] {
  const drawnCoords: DrawingCoord[] = [];
  const direction = determineDirection(from, to);

  if (direction === Direction.Up) {
    for (let y = from.y - offsetFrom; y >= to.y - offsetTo; y--) {
      drawnCoords.push({ x: from.x, y });
      d[from.x][y] = chars.vertical;
    }
  } else if (direction === Direction.Down) {
    for (let y = from.y + offsetFrom; y <= to.y + offsetTo; y++) {
      drawnCoords.push({ x: from.x, y });
      d[from.x][y] = chars.vertical;
    }
  } else if (direction === Direction.Left) {
    for (let x = from.x - offsetFrom; x >= to.x - offsetTo; x--) {
      drawnCoords.push({ x, y: from.y });
      d[x][from.y] = chars.horizontal;
    }
  } else if (direction === Direction.Right) {
    for (let x = from.x + offsetFrom; x <= to.x + offsetTo; x++) {
      drawnCoords.push({ x, y: from.y });
      d[x][from.y] = chars.horizontal;
    }
  } else if (direction === Direction.UpperLeft) {
    for (
      let x = from.x, y = from.y - offsetFrom;
      x >= to.x - offsetTo && y >= to.y - offsetTo;
      x--, y--
    ) {
      drawnCoords.push({ x, y });
      d[x][y] = chars.diagonalDown;
    }
  } else if (direction === Direction.UpperRight) {
    for (
      let x = from.x, y = from.y - offsetFrom;
      x <= to.x + offsetTo && y >= to.y - offsetTo;
      x++, y--
    ) {
      drawnCoords.push({ x, y });
      d[x][y] = chars.diagonalUp;
    }
  } else if (direction === Direction.LowerLeft) {
    for (
      let x = from.x, y = from.y + offsetFrom;
      x >= to.x - offsetTo && y <= to.y + offsetTo;
      x--, y++
    ) {
      drawnCoords.push({ x, y });
      d[x][y] = chars.diagonalUp;
    }
  } else if (direction === Direction.LowerRight) {
    for (
      let x = from.x, y = from.y + offsetFrom;
      x <= to.x + offsetTo && y <= to.y + offsetTo;
      x++, y++
    ) {
      drawnCoords.push({ x, y });
      d[x][y] = chars.diagonalDown;
    }
  }

  return drawnCoords;
}

/**
 * Draw text on the canvas at a position
 */
export function drawText(d: Drawing, start: DrawingCoord, text: string): void {
  // Ensure drawing is large enough
  const needed = start.x + text.length;
  if (needed >= d.length) {
    // Need to extend - but we modify in place so caller should ensure size
  }

  for (let i = 0; i < text.length; i++) {
    if (start.x + i < d.length && start.y < d[start.x + i].length) {
      d[start.x + i][start.y] = text[i];
    }
  }
}

/**
 * Draw a box with text centered
 */
export function drawBox(
  width: number,
  height: number,
  text: string,
  chars: BoxChars,
): Drawing {
  const boxDrawing = mkDrawing(width, height);
  const from = { x: 0, y: 0 };
  const to = { x: width, y: height };

  // Draw top border
  for (let x = from.x + 1; x < to.x; x++) {
    boxDrawing[x][from.y] = chars.horizontal;
  }

  // Draw bottom border
  for (let x = from.x + 1; x < to.x; x++) {
    boxDrawing[x][to.y] = chars.horizontal;
  }

  // Draw left border
  for (let y = from.y + 1; y < to.y; y++) {
    boxDrawing[from.x][y] = chars.vertical;
  }

  // Draw right border
  for (let y = from.y + 1; y < to.y; y++) {
    boxDrawing[to.x][y] = chars.vertical;
  }

  // Draw corners
  boxDrawing[from.x][from.y] = chars.topLeft;
  boxDrawing[to.x][from.y] = chars.topRight;
  boxDrawing[from.x][to.y] = chars.bottomLeft;
  boxDrawing[to.x][to.y] = chars.bottomRight;

  // Draw text centered - ported from Go draw.go:231-232
  // Go formula: textX = from.x + w/2 - CeilDiv(len(n.name), 2) + 1
  // Go formula: textY = from.y + h/2
  const textY = Math.floor(height / 2);
  const textX = Math.floor(width / 2) - Math.ceil(text.length / 2) + 1;
  for (let i = 0; i < text.length; i++) {
    if (textX + i >= 0 && textX + i <= width) {
      boxDrawing[textX + i][textY] = text[i];
    }
  }

  return boxDrawing;
}

/**
 * Draw a corner character based on previous and next directions
 */
export function getCornerChar(
  prevDir: DirectionType,
  nextDir: DirectionType,
  chars: BoxChars,
): string {
  // Right -> Down or Up -> Left
  if (
    (prevDir === Direction.Right && nextDir === Direction.Down) ||
    (prevDir === Direction.Up && nextDir === Direction.Left)
  ) {
    return chars.topRight;
  }
  // Right -> Up or Down -> Left
  if (
    (prevDir === Direction.Right && nextDir === Direction.Up) ||
    (prevDir === Direction.Down && nextDir === Direction.Left)
  ) {
    return chars.bottomRight;
  }
  // Left -> Down or Up -> Right
  if (
    (prevDir === Direction.Left && nextDir === Direction.Down) ||
    (prevDir === Direction.Up && nextDir === Direction.Right)
  ) {
    return chars.topLeft;
  }
  // Left -> Up or Down -> Right
  if (
    (prevDir === Direction.Left && nextDir === Direction.Up) ||
    (prevDir === Direction.Down && nextDir === Direction.Right)
  ) {
    return chars.bottomLeft;
  }

  return "+";
}

/**
 * Get arrow head character for a direction
 */
export function getArrowHead(
  dir: DirectionType,
  fallback: DirectionType,
  chars: BoxChars,
): string {
  const d = dir === Direction.Middle ? fallback : dir;

  if (d === Direction.Up) return chars.arrowUp;
  if (d === Direction.Down) return chars.arrowDown;
  if (d === Direction.Left) return chars.arrowLeft;
  if (d === Direction.Right) return chars.arrowRight;
  if (d === Direction.UpperRight) return chars.arrowUpperRight;
  if (d === Direction.UpperLeft) return chars.arrowUpperLeft;
  if (d === Direction.LowerRight) return chars.arrowLowerRight;
  if (d === Direction.LowerLeft) return chars.arrowLowerLeft;

  return "●";
}

/**
 * Get box start junction character
 */
export function getBoxStartChar(dir: DirectionType, chars: BoxChars): string {
  if (dir === Direction.Up) return chars.teeUp;
  if (dir === Direction.Down) return chars.teeDown;
  if (dir === Direction.Left) return chars.teeLeft;
  if (dir === Direction.Right) return chars.teeRight;
  return chars.cross;
}
