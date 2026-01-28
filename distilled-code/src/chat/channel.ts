import { createFragment, type Fragment } from "../fragment.ts";

/**
 * Channel type - a named channel with multiple participants defined via template.
 * Extends Fragment for template support.
 */
export interface Channel<
  ID extends string = string,
  References extends any[] = any[],
> extends Fragment<"channel", ID, References> {
  new (_: never): this;
}

/**
 * Create a Channel - a named communication channel where agents collaborate.
 *
 * Channels are defined in code using template literals with references,
 * similar to Agents. They represent persistent communication spaces
 * where multiple agents can participate in threaded conversations.
 *
 * @example
 * ```typescript
 * // Define agents
 * class CodeReviewer extends Agent("code-reviewer")`Reviews pull requests` {}
 * class Architect extends Agent("architect")`Designs system architecture` {}
 *
 * // Create an engineering channel with these agents
 * class Engineering extends Channel("engineering")`
 * The engineering channel for technical discussions.
 *
 * Members:
 * - ${CodeReviewer}
 * - ${Architect}
 * ` {}
 * ```
 *
 * @example
 * ```typescript
 * // Channel with file references for context
 * class DesignDocs extends File.Markdown("docs/design.md")`Design docs` {}
 *
 * class DesignReview extends Channel("design-review")`
 * Channel for reviewing ${DesignDocs}.
 *
 * Participants:
 * - ${Architect}
 * - ${ProductManager}
 * ` {}
 * ```
 */
export const Channel = createFragment("channel")();

/**
 * Type guard for Channel entities
 */
export const isChannel = Channel.is<Channel>;
