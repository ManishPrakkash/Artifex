"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot } from "lucide-react"
import type { Message } from "@/types"
import { useAgent } from "@/contexts/agent-context"

// Define response function locally to avoid module import issues
const getAgentResponse = async (message: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
    return "I'd be happy to help you! Could you please describe your issue in more detail? I can assist with product inquiries, order tracking, returns, and general questions about our services."
  }

  if (lowerMessage.includes("order") || lowerMessage.includes("track")) {
    return "I can help you track your order. Please provide your order number, and I'll look up the current status for you. You can find your order number in the confirmation email we sent you."
  }

  if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
    return "I understand you'd like to process a return or refund. Our return policy allows returns within 30 days of purchase. Would you like me to start the return process for you?"
  }

  if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    return "I can help you with pricing information. Which product or service are you interested in learning more about?"
  }

  return "Thank you for your message! I'm here to assist you with any questions or concerns. How can I help you today?"
}

// Counter for generating unique IDs
let agentMessageCounter = 0
const generateAgentMessageId = (prefix: string): string => {
  agentMessageCounter += 1
  return `agent-${prefix}-${agentMessageCounter}-${Date.now()}`
}

export function AgentChat() {
  const { agentInfo } = useAgent()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        `Hello! I'm your newly created ${agentInfo.name}. ${agentInfo.description}. How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update welcome message when agent info changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: `Hello! I'm your newly created ${agentInfo.name}. ${agentInfo.description}. How can I assist you today?`,
        timestamp: new Date(),
      },
    ])
  }, [agentInfo])

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
    setInput("")
    setIsLoading(true)

    try {
      const response = await getAgentResponse(input)
      setMessages((prev) => [
        ...prev,
        {
          id: generateAgentMessageId("assistant"),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error getting agent response:", error)
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
