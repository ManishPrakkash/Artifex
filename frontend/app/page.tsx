"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { ChatInterface } from "@/components/chat-interface"
import { AppPreview } from "@/components/app-preview"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "chat">("landing")
  const [initialMessage, setInitialMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleLandingSubmit = (message: string) => {
    setInitialMessage(message)
    setCurrentView("chat")
  }

  const handleFirstResponse = () => {
    setShowPreview(true)
  }

  if (currentView === "landing") {
    return <LandingPage onSubmit={handleLandingSubmit} />
  }

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Chat Panel - 1/2 width for better step visibility */}
      <div className="w-1/2 border-r border-slate-800 animate-slide-in">
        <ChatInterface initialMessage={initialMessage} onFirstResponse={handleFirstResponse} />
      </div>

      {/* Preview Panel - 1/2 width */}
      <div className="w-1/2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <AppPreview isVisible={showPreview} />
      </div>
    </div>
  )
}
