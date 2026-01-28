import { describe, expect, it } from "@effect/vitest";
import { Agent } from "../src/agent.ts";
import { Channel } from "../src/chat/channel.ts";
import { Group } from "../src/chat/group.ts";
import { discoverAgents } from "../src/tui/util/discover-agents.ts";

describe("discoverAgents", () => {
  it("discovers single agent", () => {
    class Solo extends Agent("solo")`A solo agent` {}

    const agents = discoverAgents([Solo]);

    expect(agents).toHaveLength(1);
    expect(agents[0].id).toBe("solo");
  });

  it("discovers agents referenced via thunks", () => {
    class A extends Agent("a")`Agent A reports to ${() => B}` {}
    class B extends Agent("b")`Agent B` {}

    const agents = discoverAgents([A]);

    expect(agents).toHaveLength(2);
    expect(agents.map((a) => a.id).sort()).toEqual(["a", "b"]);
  });

  it("discovers deeply nested agents", () => {
    class C extends Agent("c")`Leaf agent` {}
    class B extends Agent("b")`Reports to ${() => C}` {}
    class A extends Agent("a")`Reports to ${() => B}` {}

    const agents = discoverAgents([A]);

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("discovers agents through channels", () => {
    class Dev extends Agent("dev")`Developer` {}
    class PM extends Agent("pm")`Product Manager` {}
    class Engineering extends Channel("engineering")`
      Members: ${Dev}, ${PM}
    ` {}
    class CEO extends Agent("ceo")`Oversees ${Engineering}` {}

    const agents = discoverAgents([CEO]);

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.id).sort()).toEqual(["ceo", "dev", "pm"]);
  });

  it("discovers agents through groups", () => {
    class Alice extends Agent("alice")`Alice` {}
    class Bob extends Agent("bob")`Bob` {}
    class TeamChat extends Group("team")`
      Team chat: ${Alice}, ${Bob}
    ` {}
    class Manager extends Agent("manager")`Manages ${TeamChat}` {}

    const agents = discoverAgents([Manager]);

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.id).sort()).toEqual(["alice", "bob", "manager"]);
  });

  it("handles circular references", () => {
    class A extends Agent("a")`Works with ${() => B}` {}
    class B extends Agent("b")`Works with ${() => A}` {}

    const agents = discoverAgents([A]);

    expect(agents).toHaveLength(2);
    expect(agents.map((a) => a.id).sort()).toEqual(["a", "b"]);
  });

  it("deduplicates agents referenced multiple times", () => {
    class Shared extends Agent("shared")`Shared agent` {}
    class A extends Agent("a")`Uses ${Shared}` {}
    class B extends Agent("b")`Also uses ${Shared}` {}
    class Root extends Agent("root")`Manages ${A} and ${B}` {}

    const agents = discoverAgents([Root]);

    expect(agents).toHaveLength(4);
    expect(agents.map((a) => a.id).sort()).toEqual(["a", "b", "root", "shared"]);
  });

  it("discovers agents from multiple roots", () => {
    class A extends Agent("a")`Agent A` {}
    class B extends Agent("b")`Agent B` {}

    const agents = discoverAgents([A, B]);

    expect(agents).toHaveLength(2);
    expect(agents.map((a) => a.id).sort()).toEqual(["a", "b"]);
  });

  it("returns sorted by ID", () => {
    class Zebra extends Agent("zebra")`Zebra` {}
    class Alpha extends Agent("alpha")`Alpha` {}
    class Middle extends Agent("middle")`Middle` {}

    const agents = discoverAgents([Zebra, Alpha, Middle]);

    expect(agents.map((a) => a.id)).toEqual(["alpha", "middle", "zebra"]);
  });
});
