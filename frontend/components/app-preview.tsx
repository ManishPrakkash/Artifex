"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Settings, Bot, Download, Github, PlusCircle } from "lucide-react"
import type { AppState } from "@/types"
import { AgentChat } from "./agent-chat"
import { AgentConfig } from "./agent-config"
import { Button } from "@/components/ui/button"

// Local simulation function to avoid module import issues
const simulateBuildProgress = (onProgress: (progress: number) => void): void => {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
    }
    onProgress(Math.min(Math.round(progress), 100))
  }, 500)
}

interface AppPreviewProps {
  isVisible: boolean
  buildComplete: boolean
  onCreateNew: () => void
}

export function AppPreview({ isVisible, buildComplete, onCreateNew }: AppPreviewProps) {
  const [appState, setAppState] = useState<AppState>({
    isBuilding: true,
    isComplete: false,
    progress: 0,
  })
  const [activeTab, setActiveTab] = useState<"chat" | "config">("config")
  const [downloading, setDownloading] = useState(false)

  // Update building state based on buildComplete prop
  useEffect(() => {
    if (buildComplete) {
      // Start building animation
      setAppState({
        isBuilding: true,
        isComplete: false,
        progress: 0,
      })

      // Simulate build progress
      simulateBuildProgress((progress) => {
        setAppState((prev) => ({ ...prev, progress }))
        if (progress === 100) {
          setTimeout(() => {
            setAppState({
              isBuilding: false,
              isComplete: true,
              progress: 100,
            })
            // Auto-switch to chat tab after build completes
            setTimeout(() => {
              setActiveTab("chat")
            }, 500)
          }, 500)
        }
      })
    }
  }, [buildComplete])

  const handleDownloadCode = async () => {
    setDownloading(true)
    try {
      // Dynamic import to avoid initial load issues
      const { codeGenerator } = await import("@/lib/code-generator")
      const { fetchAgentConfig } = await import("@/lib/agent-api")
      const config = await fetchAgentConfig()
      await codeGenerator.generateAndDownload(config)
    } catch (error) {
      console.error("Failed to generate code:", error)
    } finally {
      setDownloading(false)
    }
  }

  // Show empty state until build is complete
  if (!buildComplete) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-slate-500">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-lg bg-slate-800 flex items-center justify-center">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-xs sm:text-sm px-4">Your AI agent will appear here</p>
        </div>
      </div>
    )
  }

  // Show building animation after success message
  if (appState.isBuilding) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-slow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 px-4">Building your AI agent...</h3>
            <p className="text-xs sm:text-sm text-slate-400 px-4">Training the model and setting up capabilities</p>
          </div>

          <div className="space-y-2 sm:space-y-3 px-4">
            <Progress value={appState.progress} className="h-2" />
            <p className="text-xs text-slate-500">{appState.progress}% complete</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Header with Tabs */}
      <div className="p-2 sm:p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full sm:w-auto">
          <h3 className="text-xs sm:text-sm font-medium text-white">AI Agent Preview</h3>
          <div className="flex bg-slate-800 rounded-lg p-0.5 sm:p-1 ml-auto sm:ml-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-colors ${activeTab === "chat" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 inline" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-colors ${activeTab === "config" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 inline" />
              Config
            </button>
          </div>
        </div>

        {/* Download and GitHub buttons - moved to right corner */}
        {appState.isComplete && (
          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={onCreateNew}
              className="bg-gradient-to-r from-green-600 to-emerald-600 border-green-500 text-white hover:from-green-700 hover:to-emerald-700 hover:border-green-600 transition-all duration-200 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 font-medium shadow-lg shadow-green-500/20 whitespace-nowrap flex-1 sm:flex-initial"
            >
              <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">Create New Agent</span>
              <span className="sm:hidden">New</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadCode}
              disabled={downloading}
              className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all duration-200 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 font-medium whitespace-nowrap flex-1 sm:flex-initial"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">{downloading ? "Generating..." : "Download Code"}</span>
              <span className="sm:hidden">Code</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('https://github.com/ManishPrakkash/Artifex', '_blank')}
              className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all duration-200 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 font-medium whitespace-nowrap flex-1 sm:flex-initial"
            >
              <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">GitHub</span>
              <span className="sm:hidden">Git</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tab Content - constrained height */}
      <div className="flex-1 min-h-0 animate-fade-in">{activeTab === "chat" ? <AgentChat /> : <AgentConfig />}</div>
    </div>
  )
}
