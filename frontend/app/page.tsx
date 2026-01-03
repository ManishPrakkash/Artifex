"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { ChatInterface } from "@/components/chat-interface"
import { AppPreview } from "@/components/app-preview"
import { AgentHistorySidebar } from "@/components/agent-history-sidebar"
import { addAgentToHistory, type AgentHistoryItem } from "@/lib/agent-history"
import { useAgent } from "@/contexts/agent-context"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, MessageSquare, Bot, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/user-profile"
import { AuthModal } from "@/components/auth-modal"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "chat">("landing")
  const [initialMessage, setInitialMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)
  const [currentAgentId, setCurrentAgentId] = useState<string | undefined>()
  const [skipSteps, setSkipSteps] = useState(false)
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat") // Mobile view toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Mobile menu state
  const [historyOpen, setHistoryOpen] = useState(false) // History sidebar state
  const [showAuthModal, setShowAuthModal] = useState(false) // Auth modal state
  const { agentInfo, setAgentInfo, resetAgentInfo } = useAgent()
  const { user, loading } = useAuth()

  const handleLandingSubmit = (message: string) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    resetAgentInfo() // Clear any previous agent data when starting new
    setInitialMessage(message)
    setCurrentView("chat")
    setSkipSteps(false) // New agent creation, show steps
  }

  const handleFirstResponse = () => {
    setShowPreview(true)
  }

  const handleBuildComplete = (agentName: string, agentType: string, agentDescription: string) => {
    setBuildComplete(true)
    
    // Update agentInfo context with the extracted values
    setAgentInfo({
      name: agentName,
      type: agentType,
      description: agentDescription,
    })
    
    // Save to history ONLY if this is a NEW agent (not loaded from history)
    // If currentAgentId is already set, it means we loaded from history - don't duplicate
    if (agentName && initialMessage && !currentAgentId) {
      console.log("💾 Saving NEW agent to history:", {
        name: agentName,
        type: agentType,
        description: agentDescription,
        userPrompt: initialMessage
      })
      
      const savedAgent = addAgentToHistory({
        name: agentName,
        type: agentType,
        description: agentDescription,
        userPrompt: initialMessage,
      })
      setCurrentAgentId(savedAgent.id)
      console.log("✅ Agent saved with ID:", savedAgent.id)
    } else if (currentAgentId) {
      console.log("ℹ️ Agent already in history with ID:", currentAgentId, "- skipping duplicate save")
    } else {
      console.warn("⚠️ Cannot save agent - missing name or prompt:", {
        name: agentName,
        hasPrompt: !!initialMessage
      })
    }
    
    // Auto-switch to preview on mobile when build completes
    setMobileView("preview")
  }

  const handleCreateNewAgent = () => {
    // Reset all states to start fresh
    resetAgentInfo() // Clear previous agent info
    setCurrentView("landing")
    setInitialMessage("")
    setShowPreview(false)
    setBuildComplete(false)
    setCurrentAgentId(undefined)
    setSkipSteps(false)
    setMobileView("chat") // Reset to chat view on mobile
  }

  const handleSelectHistoryAgent = (agent: AgentHistoryItem & { isFromHistory?: boolean }) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true)
      setHistoryOpen(false)
      return
    }
    
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
    setMobileView("preview") // Show preview directly on mobile for history agents
  }

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentView === "landing") {
    return (
      <>
        <AgentHistorySidebar 
          onSelectAgent={handleSelectHistoryAgent} 
          currentAgentId={currentAgentId}
          isInBuildView={false}
          isOpen={historyOpen}
          onOpenChange={setHistoryOpen}
        />
        <LandingPage 
          onSubmit={handleLandingSubmit}
          onOpenHistory={() => {
            // Check if user is authenticated before opening history
            if (!user) {
              setShowAuthModal(true)
              return
            }
            setHistoryOpen(true)
          }}
        />
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    )
  }

  return (
    <>
      <AgentHistorySidebar 
        onSelectAgent={handleSelectHistoryAgent} 
        currentAgentId={currentAgentId}
        isInBuildView={true}
        isOpen={historyOpen}
        onOpenChange={setHistoryOpen}
      />
      <div className="h-screen flex flex-col bg-slate-900">
        {/* Mobile Header with Hamburger Menu - Only visible on mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {mobileView === "chat" ? (
                <MessageSquare className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                {mobileView === "chat" ? "Build Chat" : agentInfo.name || "Agent Preview"}
              </h1>
              <p className="text-xs text-slate-400">
                {mobileView === "chat" ? "Create your agent" : "Test & configure"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <UserProfile />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white hover:bg-slate-800 p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[15]"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-[57px] left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-y border-slate-700 z-20 shadow-2xl animate-slide-in">
            <div className="p-3 space-y-2 max-h-[calc(100vh-57px)] overflow-y-auto">
              <button
                onClick={() => {
                  setMobileView("chat")
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border ${
                  mobileView === "chat"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 border-blue-400"
                    : "bg-slate-900/50 text-slate-200 hover:bg-slate-900 hover:text-white border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  mobileView === "chat" ? "bg-white/20" : "bg-blue-500/10"
                }`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Build Chat</div>
                  <div className="text-xs opacity-75">Create and design your agent</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setMobileView("preview")
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border ${
                  mobileView === "preview"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 border-blue-400"
                    : "bg-slate-900/50 text-slate-200 hover:bg-slate-900 hover:text-white border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  mobileView === "preview" ? "bg-white/20" : "bg-purple-500/10"
                }`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Agent Preview</div>
                  <div className="text-xs opacity-75">Test and configure your agent</div>
                </div>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-800 px-2 text-slate-500">Actions</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  // Check if user is authenticated before opening history
                  if (!user) {
                    setShowAuthModal(true)
                    setMobileMenuOpen(false)
                    return
                  }
                  setHistoryOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border bg-slate-900/50 text-slate-200 hover:bg-slate-900 hover:text-white border-slate-700 hover:border-slate-600"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Agent History</div>
                  <div className="text-xs opacity-75">View previously created agents</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Chat Panel - Conditional on mobile, always visible on desktop */}
          <div className={`w-full lg:w-[28%] h-full lg:border-r border-slate-800 animate-slide-in overflow-hidden ${
            mobileView === "chat" ? "block" : "hidden lg:block"
          }`}>
            <ChatInterface initialMessage={initialMessage} onFirstResponse={handleFirstResponse} onBuildComplete={handleBuildComplete} skipSteps={skipSteps} />
          </div>

          {/* Preview Panel - Conditional on mobile, always visible on desktop */}
          <div className={`w-full lg:w-[72%] h-full animate-fade-in overflow-hidden ${
            mobileView === "preview" ? "block" : "hidden lg:block"
          }`} style={{ animationDelay: "0.2s" }}>
            <AppPreview isVisible={showPreview} buildComplete={buildComplete} onCreateNew={handleCreateNewAgent} />
          </div>
        </div>
      </div>
      
      {/* Auth Modal for build view */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
