"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { ChatInterface } from "@/components/chat-interface"
import { AppPreview } from "@/components/app-preview"
import { AgentHistorySidebar } from "@/components/agent-history-sidebar"
import { addAgentToHistory, type AgentHistoryItem } from "@/lib/agent-history"
import { useAgent } from "@/contexts/agent-context"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "chat">("landing")
  const [initialMessage, setInitialMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)
  const [currentAgentId, setCurrentAgentId] = useState<string | undefined>()
  const [skipSteps, setSkipSteps] = useState(false)
  const { agentInfo, setAgentInfo } = useAgent()

  const handleLandingSubmit = (message: string) => {
    setInitialMessage(message)
    setCurrentView("chat")
    setSkipSteps(false) // New agent creation, show steps
  }

  const handleFirstResponse = () => {
    setShowPreview(true)
  }

  const handleBuildComplete = () => {
    setBuildComplete(true)
    
    // Save to history when build completes
    if (agentInfo.name && initialMessage) {
      const savedAgent = addAgentToHistory({
        name: agentInfo.name,
        type: agentInfo.type,
        description: agentInfo.description,
        userPrompt: initialMessage,
      })
      setCurrentAgentId(savedAgent.id)
    }
  }

  const handleCreateNewAgent = () => {
    // Reset all states to start fresh
    setCurrentView("landing")
    setInitialMessage("")
    setShowPreview(false)
    setBuildComplete(false)
    setCurrentAgentId(undefined)
    setSkipSteps(false)
  }

  const handleSelectHistoryAgent = (agent: AgentHistoryItem & { isFromHistory?: boolean }) => {
    // Load the selected agent from history
    setAgentInfo({
      name: agent.name,
      type: agent.type,
      description: agent.description,
    })
    setInitialMessage(agent.userPrompt)
    setCurrentView("chat")
    setShowPreview(true)
    setBuildComplete(true)
    setCurrentAgentId(agent.id)
    setSkipSteps(agent.isFromHistory || false) // Skip steps for history agents
  }

  if (currentView === "landing") {
    return (
      <>
        <AgentHistorySidebar 
          onSelectAgent={handleSelectHistoryAgent} 
          currentAgentId={currentAgentId}
          isInBuildView={false}
        />
        <LandingPage onSubmit={handleLandingSubmit} />
      </>
    )
  }

  return (
    <>
      <AgentHistorySidebar 
        onSelectAgent={handleSelectHistoryAgent} 
        currentAgentId={currentAgentId}
        isInBuildView={true}
      />
      <div className="h-screen flex bg-slate-900">
        {/* Chat Panel - 28% width */}
        <div className="w-[28%] border-r border-slate-800 animate-slide-in">
          <ChatInterface initialMessage={initialMessage} onFirstResponse={handleFirstResponse} onBuildComplete={handleBuildComplete} skipSteps={skipSteps} />
        </div>

        {/* Preview Panel - 72% width */}
        <div className="w-[72%] animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <AppPreview isVisible={showPreview} buildComplete={buildComplete} onCreateNew={handleCreateNewAgent} />
        </div>
      </div>
    </>
  )
}
