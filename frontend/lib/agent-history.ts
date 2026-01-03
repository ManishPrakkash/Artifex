/**
 * Agent History Management with Local Storage
 */

export interface AgentHistoryItem {
  id: string
  name: string
  type: string
  description: string
  userPrompt: string
  createdAt: string
  config?: any
}

const HISTORY_KEY = "artifex_agent_history"
const MAX_HISTORY_ITEMS = 50

/**
 * Get all agent history from local storage
 */
export function getAgentHistory(): AgentHistoryItem[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error("Failed to load agent history:", error)
    return []
  }
}

/**
 * Add new agent to history
 */
export function addAgentToHistory(agent: Omit<AgentHistoryItem, "id" | "createdAt">): AgentHistoryItem {
  const newAgent: AgentHistoryItem = {
    ...agent,
    id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }

  const history = getAgentHistory()
  const updatedHistory = [newAgent, ...history].slice(0, MAX_HISTORY_ITEMS)

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Failed to save agent to history:", error)
  }

  return newAgent
}

/**
 * Get agent by ID from history
 */
export function getAgentById(id: string): AgentHistoryItem | null {
  const history = getAgentHistory()
  return history.find(agent => agent.id === id) || null
}

/**
 * Delete agent from history
 */
export function deleteAgentFromHistory(id: string): void {
  const history = getAgentHistory()
  const updatedHistory = history.filter(agent => agent.id !== id)
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Failed to delete agent from history:", error)
  }
}

/**
 * Clear all history
 */
export function clearAgentHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error("Failed to clear agent history:", error)
  }
}

/**
 * Update agent in history
 */
export function updateAgentInHistory(id: string, updates: Partial<AgentHistoryItem>): void {
  const history = getAgentHistory()
  const updatedHistory = history.map(agent => 
    agent.id === id ? { ...agent, ...updates } : agent
  )
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Failed to update agent in history:", error)
  }
}
