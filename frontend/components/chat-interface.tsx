"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Zap } from "lucide-react"
import { StepCard } from "@/components/step-card"
import { generateAgentSteps, type AgentStep } from "@/lib/mock-api"
import { extractAgentNameClient } from "@/lib/agent-name-extractor"
import { useAgent } from "@/contexts/agent-context"

interface ChatInterfaceProps {
  initialMessage: string
  onFirstResponse: () => void
  onBuildComplete: (agentName: string, agentType: string, agentDescription: string) => void
  skipSteps?: boolean
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

// Counter for generating unique IDs - kept outside component to ensure uniqueness
let messageIdCounter = 0
const generateMessageId = (prefix: string): string => {
  messageIdCounter += 1
  return `${prefix}-${messageIdCounter}-${Math.random().toString(36).substr(2, 9)}`
}

export function ChatInterface({ initialMessage, onFirstResponse, onBuildComplete, skipSteps = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { setAgentInfo, agentInfo } = useAgent()

  // Use ref to prevent double execution in React Strict Mode
  const hasInitialized = useRef(false)
  const isProcessingRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentSteps, scrollToBottom])

  // Process initial message only once
  useEffect(() => {
    // Prevent double execution
    if (hasInitialized.current || !initialMessage || isProcessingRef.current) {
      return
    }

    hasInitialized.current = true
    isProcessingRef.current = true
    processUserMessage(initialMessage)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage])

  const processUserMessage = async (message: string) => {
    setIsProcessing(true)

    // If skipSteps is true (loading from history), just complete immediately
    if (skipSteps) {
      // Show a brief loading message
      const loadingMessage: ChatMessage = {
        id: generateMessageId("assistant"),
        type: "assistant",
        content: `Loading ${agentInfo.name}...`,
        timestamp: new Date(),
      }
      setMessages([loadingMessage])
      
      // Trigger preview visibility
      onFirstResponse()
      
      // Short delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Trigger build complete with current agent info
      onBuildComplete(agentInfo.name, agentInfo.type, agentInfo.description)
      
      // Show success message
      await new Promise(resolve => setTimeout(resolve, 400))
      setSuccessMessage(`✨ ${agentInfo.name} loaded successfully! You can test it in the chat tab or view its configuration.`)
      
      setIsProcessing(false)
      isProcessingRef.current = false
      return
    }

    // Normal flow: Extract agent name dynamically from user input
    console.log("🚀 Starting agent name extraction for:", message)
    const extractedInfo = await extractAgentNameClient(message)
    console.log("📝 Extracted agent info:", extractedInfo)
    
    setAgentInfo({
      name: extractedInfo.agentName,
      type: extractedInfo.agentType,
      description: extractedInfo.shortDescription,
    })

    // Add user message with unique ID
    const userMessage: ChatMessage = {
      id: generateMessageId("user"),
      type: "user",
      content: message,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Add AI response with unique ID (personalized with agent name)
    await new Promise(resolve => setTimeout(resolve, 800))
    const aiMessage: ChatMessage = {
      id: generateMessageId("assistant"),
      type: "assistant",
      content: `Perfect! I'll build the ${extractedInfo.agentName} for you. Let me analyze your requirements and create a comprehensive solution.`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMessage])

    // Generate and animate steps
    const steps = generateAgentSteps(message)
    setCurrentSteps([])

    // Trigger preview visibility
    onFirstResponse()

    // Animate through each step
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))

      // Add step in "running" state
      const runningStep = { ...steps[i], status: "running" as const }
      setCurrentSteps(prev => [...prev, runningStep])

      scrollToBottom()

      // Wait and complete the step
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

      // Update to completed
      setCurrentSteps(prev =>
        prev.map(s => s.id === steps[i].id ? { ...s, status: "completed" as const } : s)
      )

      scrollToBottom()
    }

    // All steps complete - wait a moment then trigger build animation on right panel
    await new Promise(resolve => setTimeout(resolve, 800))
    onBuildComplete(extractedInfo.agentName, extractedInfo.agentType, extractedInfo.shortDescription)

    // Show success message shortly after build starts (while building animation is running)
    await new Promise(resolve => setTimeout(resolve, 1200))

    setSuccessMessage("🎉 Your agent has been successfully built! You can now test it in the chat tab or view its configuration in the config tab. The agent is ready for deployment with all the tools and capabilities you requested.")

    setIsProcessing(false)
    isProcessingRef.current = false
    scrollToBottom()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const message = input.trim()
    setInput("")
    isProcessingRef.current = true
    await processUserMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Artifex</h3>
          <p className="text-xs text-slate-400">AI Agent Builder</p>
        </div>
      </div>

      {/* Messages and Steps */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="animate-slide-in">
            {message.type === "user" && (
              <div className="flex justify-end mb-2 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
                  <div className="bg-blue-600 text-white p-2 sm:p-3 rounded-2xl rounded-br-sm text-xs sm:text-sm">
                    {message.content}
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] sm:text-xs font-bold text-white">U</span>
                  </div>
                </div>
              </div>
            )}

            {message.type === "assistant" && (
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="bg-slate-800/60 text-slate-200 p-2 sm:p-4 rounded-2xl rounded-bl-sm text-xs sm:text-sm max-w-[90%] sm:max-w-[85%] border border-slate-700/50">
                  {message.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Current Steps - displayed after messages */}
        {currentSteps.length > 0 && (
          <div className="space-y-6 mt-4">
            {currentSteps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        )}

        {/* Success Message - displayed AFTER all steps complete */}
        {successMessage && (
          <div className="flex items-start gap-3 mb-4 mt-6 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="bg-teal-900/40 text-slate-200 p-4 rounded-2xl rounded-bl-sm text-sm max-w-[85%] border border-teal-700/50 backdrop-blur-sm">
              {successMessage}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 sm:p-4 border-t border-slate-800 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-1 sm:gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isProcessing ? "Agent is being built..." : "Continue the conversation..."}
            disabled={isProcessing}
            className="flex-1 min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none text-xs sm:text-sm disabled:opacity-50"
            rows={1}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white self-end h-10 sm:h-11 px-3 sm:px-4"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
