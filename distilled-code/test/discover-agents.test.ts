import { describe, expect, it } from "@effect/vitest";
import * as S from "effect/Schema";
import { Agent } from "../src/agent.ts";
import { Channel } from "../src/chat/channel.ts";
import { GroupChat } from "../src/chat/group-chat.ts";
import { Group } from "../src/org/group.ts";
import { Role } from "../src/org/role.ts";
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

  it("discovers agents through group chats", () => {
    class Alice extends Agent("alice")`Alice` {}
    class Bob extends Agent("bob")`Bob` {}
    class TeamChat extends GroupChat("team")`
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
    expect(agents.map((a) => a.id).sort()).toEqual([
      "a",
      "b",
      "root",
      "shared",
    ]);
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

  // ============================================================
  // Tests for Role and Group (org) traversal
  // ============================================================

  it("discovers agents through org groups", () => {
    class Alice extends Agent("alice")`Alice` {}
    class Bob extends Agent("bob")`Bob` {}
    class Engineering extends Group("engineering")`
      The engineering team: ${Alice}, ${Bob}
    ` {}
    class Manager extends Agent("manager")`Manages ${Engineering}` {}

    const agents = discoverAgents([Manager]);

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.id).sort()).toEqual(["alice", "bob", "manager"]);
  });

  it("discovers agents through nested org groups", () => {
    class Alice extends Agent("alice")`Alice` {}
    class Bob extends Agent("bob")`Bob` {}
    class Carol extends Agent("carol")`Carol` {}

    class SubTeam extends Group("sub")`${Alice}` {}
    class ParentTeam extends Group("parent")`${SubTeam}, ${Bob}` {}
    class Manager extends Agent(
      "manager",
    )`Manages ${ParentTeam} and ${Carol}` {}

    const agents = discoverAgents([Manager]);

    expect(agents).toHaveLength(4);
    expect(agents.map((a) => a.id).sort()).toEqual([
      "alice",
      "bob",
      "carol",
      "manager",
    ]);
  });

  it("discovers agents through roles", () => {
    class Helper extends Agent("helper")`Helper agent` {}
    class Admin extends Role("admin")`Admin role with ${Helper}` {}
    class Root extends Agent("root")`Has ${Admin}` {}

    const agents = discoverAgents([Root]);

    expect(agents).toHaveLength(2);
    expect(agents.map((a) => a.id).sort()).toEqual(["helper", "root"]);
  });

  it("discovers agents through inherited roles", () => {
    class Alice extends Agent("alice")`Alice` {}
    class Bob extends Agent("bob")`Bob` {}

    class BaseRole extends Role("base")`Base with ${Alice}` {}
    class ExtendedRole extends Role(
      "extended",
    )`Extended with ${BaseRole} and ${Bob}` {}
    class Root extends Agent("root")`Has ${ExtendedRole}` {}

    const agents = discoverAgents([Root]);

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.id).sort()).toEqual(["alice", "bob", "root"]);
  });

  it("discovers agents through group with role", () => {
    class Alice extends Agent("alice")`Alice` {}
    class Bob extends Agent("bob")`Bob` {}
    class Admin extends Role("admin")`Admin with ${Bob}` {}
    class AdminGroup extends Group("admins")`
      ${Alice} with ${Admin}
    ` {}
    class Root extends Agent("root")`Manages ${AdminGroup}` {}

    const agents = discoverAgents([Root]);

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.id).sort()).toEqual(["alice", "bob", "root"]);
  });

  // ============================================================
  // Regression test for class constructors in references
  // ============================================================

  it("ignores Effect Schema classes in references without throwing", () => {
    // This test ensures that class constructors (like Effect Schema classes)
    // in agent references don't cause discoverAgents to throw.
    // Previously, any function was treated as a thunk and invoked, which would
    // throw "Cannot call a class constructor without 'new'" for class constructors.
    const UserSchema = S.Struct({
      name: S.String,
      age: S.Number,
    });

    class DataAgent extends Agent(
      "data-agent",
    )`Handles data with schema: ${UserSchema}` {}

    // This should NOT throw
    const agents = discoverAgents([DataAgent]);

    expect(agents).toHaveLength(1);
    expect(agents[0].id).toBe("data-agent");
  });

  it("ignores multiple Schema classes and still discovers nested agents", () => {
    const InputSchema = S.Struct({ query: S.String });
    const OutputSchema = S.Struct({ result: S.Array(S.String) });

    class Worker extends Agent("worker")`Worker agent` {}
    class Orchestrator extends Agent("orchestrator")`
      Uses schemas ${InputSchema} and ${OutputSchema}
      Delegates to ${() => Worker}
    ` {}

    const agents = discoverAgents([Orchestrator]);

    expect(agents).toHaveLength(2);
    expect(agents.map((a) => a.id).sort()).toEqual(["orchestrator", "worker"]);
  });
});
