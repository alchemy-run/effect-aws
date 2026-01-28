/**
 * DM (Direct Message) utilities for 1:1 conversations between agents.
 *
 * Unlike Channels and Groups, DMs are not defined in code - they are
 * created dynamically when two agents need to communicate directly.
 * The DM utilities help manage these implicit relationships.
 */

/**
 * DM utilities for managing direct message conversations.
 */
export const DM = {
  /**
   * Create a canonical DM key from two agent IDs.
   * The key is sorted alphabetically for consistency, so DM.key("a", "b")
   * and DM.key("b", "a") return the same value.
   *
   * @param agent1 - First agent ID
   * @param agent2 - Second agent ID
   * @returns Canonical DM key in format "agentA:agentB"
   *
   * @example
   * ```typescript
   * const key = DM.key("alice", "bob"); // "alice:bob"
   * const sameKey = DM.key("bob", "alice"); // "alice:bob"
   * ```
   */
  key: (agent1: string, agent2: string): string =>
    [agent1, agent2].sort().join(":"),

  /**
   * Parse a DM key back into agent IDs.
   *
   * @param key - DM key in format "agentA:agentB"
   * @returns Tuple of [agent1, agent2] in sorted order
   *
   * @example
   * ```typescript
   * const [a, b] = DM.parse("alice:bob"); // ["alice", "bob"]
   * ```
   */
  parse: (key: string): [string, string] => {
    const parts = key.split(":");
    if (parts.length !== 2) {
      throw new Error(`Invalid DM key: ${key}`);
    }
    return [parts[0], parts[1]];
  },

  /**
   * Check if a key is a valid DM key format.
   *
   * @param key - Key to validate
   * @returns True if key is in valid DM format
   */
  isValidKey: (key: string): boolean => {
    const parts = key.split(":");
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  },
};
