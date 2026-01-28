import { createFragment, type Fragment } from "../fragment.ts";

/**
 * Group type - a group chat with multiple participants defined via template.
 * Extends Fragment for template support.
 */
export interface Group<
  ID extends string = string,
  References extends any[] = any[],
> extends Fragment<"group", ID, References> {
  new (_: never): this;
}

/**
 * Create a Group - a group chat where multiple agents collaborate.
 *
 * Groups are defined in code using template literals with references,
 * similar to Agents. They represent ad-hoc communication spaces
 * for specific topics or tasks with threaded conversation support.
 *
 * @example
 * ```typescript
 * // Define agents
 * class Frontend extends Agent("frontend")`Frontend developer` {}
 * class Backend extends Agent("backend")`Backend developer` {}
 * class Designer extends Agent("designer")`UI/UX designer` {}
 *
 * // Create a feature development group
 * class FeatureTeam extends Group("feature-team")`
 * Group for coordinating feature development.
 *
 * Team:
 * - ${Frontend}
 * - ${Backend}
 * - ${Designer}
 * ` {}
 * ```
 *
 * @example
 * ```typescript
 * // Group with context files
 * class FeatureSpec extends File.Markdown("specs/feature.md")`Feature spec` {}
 *
 * class FeatureDiscussion extends Group("feature-discussion")`
 * Discussion group for ${FeatureSpec}.
 *
 * Participants:
 * - ${ProductManager}
 * - ${TechLead}
 * ` {}
 * ```
 */
export const Group = createFragment("group")();

/**
 * Type guard for Group entities
 */
export const isGroup = Group.is<Group>;
