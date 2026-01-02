"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { ChatInterface } from "@/components/chat-interface"
import { AppPreview } from "@/components/app-preview"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "chat">("landing")
  const [initialMessage, setInitialMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)

  const handleLandingSubmit = (message: string) => {
    setInitialMessage(message)
    setCurrentView("chat")
  }

  const handleFirstResponse = () => {
    setShowPreview(true)
  }

  const handleBuildComplete = () => {
    setBuildComplete(true)
  }

  if (currentView === "landing") {
    return <LandingPage onSubmit={handleLandingSubmit} />
  }

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Chat Panel - 28% width */}
      <div className="w-[28%] border-r border-slate-800 animate-slide-in">
        <ChatInterface initialMessage={initialMessage} onFirstResponse={handleFirstResponse} onBuildComplete={handleBuildComplete} />
      </div>

      {/* Preview Panel - 72% width */}
      <div className="w-[72%] animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <AppPreview isVisible={showPreview} buildComplete={buildComplete} />
      </div>
    </div>
  )
}
