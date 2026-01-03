"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface AgentInfo {
  name: string
  type: string
  description: string
}

interface AgentContextType {
  agentInfo: AgentInfo
  setAgentInfo: (info: AgentInfo) => void
  updateAgentName: (name: string) => void
  updateAgentType: (type: string) => void
  updateAgentDescription: (description: string) => void
  resetAgentInfo: () => void
}

const defaultAgentInfo: AgentInfo = {
  name: "AI Assistant Agent",
  type: "assistant",
  description: "General-purpose AI assistant",
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agentInfo, setAgentInfoState] = useState<AgentInfo>(defaultAgentInfo)

  const setAgentInfo = (info: AgentInfo) => {
    setAgentInfoState(info)
    // Store in session storage for persistence
    if (typeof window !== "undefined") {
      sessionStorage.setItem("agentInfo", JSON.stringify(info))
    }
  }

  const updateAgentName = (name: string) => {
    setAgentInfo({ ...agentInfo, name })
  }

  const updateAgentType = (type: string) => {
    setAgentInfo({ ...agentInfo, type })
  }

  const updateAgentDescription = (description: string) => {
    setAgentInfo({ ...agentInfo, description })
  }

  const resetAgentInfo = () => {
    setAgentInfoState(defaultAgentInfo)
    // Clear from session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("agentInfo")
    }
  }

  // Load from session storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("agentInfo")
      if (stored) {
        try {
          setAgentInfoState(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse stored agent info:", e)
        }
      }
    }
  }, [])

  return (
    <AgentContext.Provider
      value={{
        agentInfo,
        setAgentInfo,
        updateAgentName,
        updateAgentType,
        updateAgentDescription,
        resetAgentInfo,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

export function useAgent() {
  const context = useContext(AgentContext)
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider")
  }
  return context
}
