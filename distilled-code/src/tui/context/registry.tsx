/**
 * Agent Registry Context
 *
 * Provides available agent definitions to the TUI components.
 * Automatically discovers all agents from the reference graph.
 */

import { createContext, useContext, type JSX } from "solid-js";
import type { Agent } from "../../agent.ts";
import { discoverAgents } from "../util/discover-agents.ts";

/**
 * Registry context value
 */
export interface RegistryContextValue {
  /**
   * Available agent definitions (all discovered agents)
   */
  agents: Agent[];

  /**
   * Get an agent by ID
   */
  getAgent: (id: string) => Agent | undefined;
}

const RegistryContext = createContext<RegistryContextValue>();

/**
 * Props for RegistryProvider
 */
export interface RegistryProviderProps {
  /**
   * Root agent definitions - will discover all referenced agents recursively
   */
  agents: Agent[];

  /**
   * Child components
   */
  children: JSX.Element;
}

/**
 * Provider component for agent registry.
 *
 * Automatically walks the reference graph starting from the provided agents
 * to discover ALL agents in the system.
 */
export function RegistryProvider(props: RegistryProviderProps) {
  // Discover all agents from the reference graph
  const allAgents = discoverAgents(props.agents);

  const agentMap = new Map<string, Agent>();
  for (const agent of allAgents) {
    agentMap.set(agent.id, agent);
  }

  const value: RegistryContextValue = {
    agents: allAgents,
    getAgent: (id: string) => agentMap.get(id),
  };

  return (
    <RegistryContext.Provider value={value}>
      {props.children}
    </RegistryContext.Provider>
  );
}

/**
 * Hook to access the agent registry
 */
export function useRegistry(): RegistryContextValue {
  const context = useContext(RegistryContext);
  if (!context) {
    throw new Error("useRegistry must be used within a RegistryProvider");
  }
  return context;
}
