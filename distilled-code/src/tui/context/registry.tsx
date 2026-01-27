/**
 * Agent Registry Context
 *
 * Provides available agent definitions to the TUI components.
 */

import { createContext, useContext, type JSX } from "solid-js";
import type { Agent } from "../../agent.ts";

/**
 * Registry context value
 */
export interface RegistryContextValue {
  /**
   * Available agent definitions
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
   * Available agent definitions
   */
  agents: Agent[];

  /**
   * Child components
   */
  children: JSX.Element;
}

/**
 * Provider component for agent registry
 */
export function RegistryProvider(props: RegistryProviderProps) {
  const agentMap = new Map<string, Agent>();
  for (const agent of props.agents) {
    agentMap.set(agent.id, agent);
  }

  const value: RegistryContextValue = {
    agents: props.agents,
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
