/**
 * Border utilities for visual styling
 * Based on OpenCode's border patterns
 */

/**
 * Empty border - no visible borders
 */
export const EmptyBorder = {
  topLeft: "",
  bottomLeft: "",
  vertical: "",
  topRight: "",
  bottomRight: "",
  horizontal: " ",
  bottomT: "",
  topT: "",
  cross: "",
  leftT: "",
  rightT: "",
};

/**
 * Split border - vertical line on left side
 * Used for message containers and panels
 */
export const SplitBorder = {
  border: ["left" as const],
  customBorderChars: {
    ...EmptyBorder,
    vertical: "┃",
  },
};

/**
 * Panel border - subtle left border for panels
 */
export const PanelBorder = {
  border: ["left" as const],
  customBorderChars: {
    ...EmptyBorder,
    vertical: "│",
    topLeft: "╭",
    bottomLeft: "╰",
  },
};

/**
 * Input border - used for text inputs
 */
export const InputBorder = {
  customBorderChars: {
    ...EmptyBorder,
    vertical: "┃",
    bottomLeft: "╹",
  },
};
