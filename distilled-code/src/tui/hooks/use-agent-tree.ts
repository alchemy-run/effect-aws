/**
 * Fuzzy search utilities for agent paths
 */

import { Fzf, byLengthAsc, byStartAsc, extendedMatch } from "fzf";

/**
 * Filter agent paths using fuzzy search (FZF algorithm like Telescope)
 *
 * Features:
 * - Smart case: case-insensitive by default, case-sensitive when uppercase used
 * - Extended match: space-separated terms are AND conditions
 * - Scoring: prefers matches at word boundaries and shorter paths
 */
export function filterAgentPaths(paths: string[], needle: string): string[] {
  if (!needle) return paths;

  const fzf = new Fzf(paths, {
    match: extendedMatch, // Allows space-separated terms as AND conditions
    tiebreakers: [byStartAsc, byLengthAsc], // Prefer earlier matches, then shorter
  });

  const results = fzf.find(needle.trim());
  return results.map((r) => r.item);
}
