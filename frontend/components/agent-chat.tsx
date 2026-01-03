"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, AlertCircle } from "lucide-react"
import type { Message } from "@/types"
import { useAgent } from "@/contexts/agent-context"
import { geminiChatService, type AgentContext } from "@/lib/gemini-chat"
import { generateTravelResponse } from "@/lib/travel-mock-data"

// Counter for generating unique IDs
let agentMessageCounter = 0
const generateAgentMessageId = (prefix: string): string => {
  agentMessageCounter += 1
  return `agent-${prefix}-${agentMessageCounter}-${Date.now()}`
}

export function AgentChat() {
  const { agentInfo } = useAgent()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Gemini chat when agent info is available
  useEffect(() => {
    if (agentInfo.name && !isInitialized) {
      try {
        // Initialize the Gemini service
        const initialized = geminiChatService.initialize()

        if (initialized) {
          // Create agent context from agent info
          const context: AgentContext = {
            agentName: agentInfo.name,
            purpose: agentInfo.description,
            agentType: agentInfo.type,
          }

          // Start the chat session
          geminiChatService.startChat(context)
          setIsInitialized(true)
          setError(null)

          // Set welcome message
          setMessages([
            {
              id: "welcome-message",
              role: "assistant",
              content: `Hello! I'm ${agentInfo.name}. ${agentInfo.description}. How can I assist you today?`,
              timestamp: new Date(),
            },
          ])
        } else {
          // API key not configured - show error
          setError("Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to .env.local")
          setMessages([
            {
              id: "welcome-message",
              role: "assistant",
              content: `Hello! I'm ${agentInfo.name}. ${agentInfo.description}. (Note: Chat is in demo mode - API key not configured)`,
              timestamp: new Date(),
            },
          ])
        }
      } catch (err) {
        console.error("Failed to initialize Gemini:", err)
        setError("Failed to initialize chat. Please check your API key.")
      }
    }
  }, [agentInfo, isInitialized])

  // Reset initialization when agent changes
  useEffect(() => {
    setIsInitialized(false)
    setError(null)
  }, [agentInfo.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateAgentMessageId("user"),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input.trim()
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Add 2 second thinking time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let response: string
      
      // Check if this is a travel/trip planner agent
      const isTravelAgent = agentInfo.name.toLowerCase().includes('travel') || 
                           agentInfo.name.toLowerCase().includes('trip') ||
                           agentInfo.name.toLowerCase().includes('planner') ||
                           agentInfo.description.toLowerCase().includes('travel') ||
                           agentInfo.description.toLowerCase().includes('trip')
      
      if (isTravelAgent) {
        // Use mock travel data for travel agents
        const travelQuery = userInput.toLowerCase()
        
        // Check if it's a travel-related query
        const isTravelQuery = travelQuery.includes('flight') || 
                             travelQuery.includes('hotel') || 
                             travelQuery.includes('activity') ||
                             travelQuery.includes('activities') ||
                             travelQuery.includes('book') ||
                             travelQuery.includes('destination') ||
                             travelQuery.includes('dubai') ||
                             travelQuery.includes('paris') ||
                             travelQuery.includes('london') ||
                             travelQuery.includes('singapore') ||
                             travelQuery.includes('where') ||
                             travelQuery.includes('how') ||
                             travelQuery.includes('when')
        
        if (isTravelQuery) {
          // Generate response using mock data
          response = generateTravelResponse(userInput)
        } else {
          // For non-travel queries, still use Gemini but with travel context
          response = await geminiChatService.sendMessage(userInput)
        }
      } else {
        // For non-travel agents, use Gemini normally
        response = await geminiChatService.sendMessage(userInput)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: generateAgentMessageId("assistant"),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error("Error getting agent response:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to get response"
      setError(errorMessage)

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: generateAgentMessageId("error"),
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{agentInfo.name}</h3>
            <p className="text-xs text-slate-500">Test your AI agent</p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Messages - scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 animate-slide-in ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${message.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
                }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">U</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 animate-slide-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white text-slate-800 p-3 rounded-lg rounded-bl-sm text-sm border border-slate-200">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - fixed at bottom */}
      <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Test your agent..."
            className="flex-1 min-h-[40px] max-h-[120px] bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 resize-none text-sm"
            rows={1}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
