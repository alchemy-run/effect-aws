/**
 * Mermaid ASCII Rendering Tests
 *
 * Tests ported from the mermaid-ascii Go library.
 * Each fixture file contains mermaid source and expected ASCII output.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "../../../src/tui/mermaid-ascii/index.ts";

const TESTDATA_DIR = path.join(__dirname, "testdata");

/**
 * Read a test case file and parse it into mermaid source and expected output.
 */
function readTestCase(filePath: string): {
  mermaid: string;
  expected: string;
  paddingX: number;
  paddingY: number;
} {
  const content = fs.readFileSync(filePath, "utf-8");

  // Split on "\n---\n" separator
  const parts = content.split("\n---\n");
  if (parts.length !== 2) {
    throw new Error(
      `Test case file must have exactly one '---' separator: ${filePath}`,
    );
  }

  let mermaid = parts[0];
  const expected = parts[1].trimEnd();

  // Parse optional padding directives
  let paddingX = 5;
  let paddingY = 5;
  const lines = mermaid.split("\n");
  const processedLines: string[] = [];
  let mermaidStarted = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!mermaidStarted && trimmed === "") continue;

    const paddingMatch = trimmed.match(/^padding([xy])\s*=\s*(\d+)$/i);
    if (!mermaidStarted && paddingMatch) {
      const value = parseInt(paddingMatch[2], 10);
      if (paddingMatch[1].toLowerCase() === "x") {
        paddingX = value;
      } else {
        paddingY = value;
      }
      continue;
    }

    mermaidStarted = true;
    processedLines.push(line);
  }

  return {
    mermaid: processedLines.join("\n"),
    expected,
    paddingX,
    paddingY,
  };
}

/**
 * Normalize whitespace for comparison.
 * Removes trailing spaces and normalizes line endings.
 */
function normalize(s: string): string {
  return s
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Visualize whitespace for debugging.
 */
function visualizeWhitespace(s: string): string {
  return s.replace(/ /g, "·");
}

/**
 * Get all .txt files in a directory.
 */
function getTestFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".txt"))
    .sort();
}

describe("Mermaid ASCII Rendering", () => {
  describe("Graph/Flowchart - Unicode", () => {
    const dir = path.join(TESTDATA_DIR, "extended-chars");
    const files = getTestFiles(dir);

    for (const file of files) {
      it(file, () => {
        const filePath = path.join(dir, file);
        const { mermaid, expected, paddingX, paddingY } =
          readTestCase(filePath);

        const actual = render(mermaid, {
          ascii: false,
          paddingX,
          paddingY,
        });

        const normalizedExpected = normalize(expected);
        const normalizedActual = normalize(actual);

        if (normalizedExpected !== normalizedActual) {
          console.log("Expected:");
          console.log(visualizeWhitespace(normalizedExpected));
          console.log("\nActual:");
          console.log(visualizeWhitespace(normalizedActual));
        }

        expect(normalizedActual).toBe(normalizedExpected);
      });
    }
  });

  describe("Graph/Flowchart - ASCII", () => {
    const dir = path.join(TESTDATA_DIR, "ascii");
    const files = getTestFiles(dir);

    for (const file of files) {
      it(file, () => {
        const filePath = path.join(dir, file);
        const { mermaid, expected, paddingX, paddingY } =
          readTestCase(filePath);

        const actual = render(mermaid, {
          ascii: true,
          paddingX,
          paddingY,
        });

        const normalizedExpected = normalize(expected);
        const normalizedActual = normalize(actual);

        if (normalizedExpected !== normalizedActual) {
          console.log("Expected:");
          console.log(visualizeWhitespace(normalizedExpected));
          console.log("\nActual:");
          console.log(visualizeWhitespace(normalizedActual));
        }

        expect(normalizedActual).toBe(normalizedExpected);
      });
    }
  });

  describe("Sequence Diagram - Unicode", () => {
    const dir = path.join(TESTDATA_DIR, "sequence");
    const files = getTestFiles(dir);

    for (const file of files) {
      it(file, () => {
        const filePath = path.join(dir, file);
        const { mermaid, expected } = readTestCase(filePath);

        const actual = render(mermaid, { ascii: false });

        const normalizedExpected = normalize(expected);
        const normalizedActual = normalize(actual);

        if (normalizedExpected !== normalizedActual) {
          console.log("Expected:");
          console.log(visualizeWhitespace(normalizedExpected));
          console.log("\nActual:");
          console.log(visualizeWhitespace(normalizedActual));
        }

        expect(normalizedActual).toBe(normalizedExpected);
      });
    }
  });

  describe("Sequence Diagram - ASCII", () => {
    const dir = path.join(TESTDATA_DIR, "sequence-ascii");
    const files = getTestFiles(dir);

    for (const file of files) {
      it(file, () => {
        const filePath = path.join(dir, file);
        const { mermaid, expected } = readTestCase(filePath);

        const actual = render(mermaid, { ascii: true });

        const normalizedExpected = normalize(expected);
        const normalizedActual = normalize(actual);

        if (normalizedExpected !== normalizedActual) {
          console.log("Expected:");
          console.log(visualizeWhitespace(normalizedExpected));
          console.log("\nActual:");
          console.log(visualizeWhitespace(normalizedActual));
        }

        expect(normalizedActual).toBe(normalizedExpected);
      });
    }
  });

  describe("Diagram Type Detection", () => {
    it("detects sequence diagrams", () => {
      const {
        detectDiagramType,
      } = require("../../../src/tui/mermaid-ascii/parser.ts");
      expect(detectDiagramType("sequenceDiagram\nA->>B: Hello")).toBe(
        "sequence",
      );
    });

    it("detects graph diagrams", () => {
      const {
        detectDiagramType,
      } = require("../../../src/tui/mermaid-ascii/parser.ts");
      expect(detectDiagramType("graph LR\nA --> B")).toBe("graph");
    });

    it("detects flowchart diagrams as graph", () => {
      const {
        detectDiagramType,
      } = require("../../../src/tui/mermaid-ascii/parser.ts");
      expect(detectDiagramType("flowchart TD\nA --> B")).toBe("graph");
    });
  });

  describe("Content Splitting", () => {
    it("splits markdown with mermaid blocks", () => {
      const {
        splitMarkdownContent,
      } = require("../../../src/tui/mermaid-ascii/split.ts");
      const content = "Hello\n```mermaid\ngraph LR\nA --> B\n```\nWorld";
      const segments = splitMarkdownContent(content);

      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({
        type: "text",
        content: "Hello\n",
        isComplete: true,
      });
      expect(segments[1]).toEqual({
        type: "mermaid",
        content: "graph LR\nA --> B\n",
        isComplete: true,
      });
      expect(segments[2]).toEqual({
        type: "text",
        content: "\nWorld",
        isComplete: true,
      });
    });

    it("detects mermaid blocks", () => {
      const {
        hasMermaidBlocks,
      } = require("../../../src/tui/mermaid-ascii/split.ts");
      expect(hasMermaidBlocks("Hello ```mermaid\ngraph")).toBe(true);
      expect(hasMermaidBlocks("Hello world")).toBe(false);
    });
  });
});
