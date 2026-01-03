"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  History, 
  X, 
  Trash2, 
  Clock, 
  Bot,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { getAgentHistory, deleteAgentFromHistory, clearAgentHistory, type AgentHistoryItem } from "@/lib/agent-history"
import { formatDistanceToNow } from "date-fns"

interface AgentHistorySidebarProps {
  onSelectAgent: (agent: AgentHistoryItem & { isFromHistory?: boolean }) => void
  currentAgentId?: string
  isInBuildView?: boolean
}

export function AgentHistorySidebar({ onSelectAgent, currentAgentId, isInBuildView = false }: AgentHistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<AgentHistoryItem[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setHistory(getAgentHistory())
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Delete this agent from history?")) {
      deleteAgentFromHistory(id)
      loadHistory()
    }
  }

  const handleClearAll = () => {
    if (confirm("Clear all agent history?")) {
      clearAgentHistory()
      loadHistory()
    }
  }

  const handleSelectAgent = (agent: AgentHistoryItem) => {
    onSelectAgent({ ...agent, isFromHistory: true })
    setIsOpen(false)
  }

  return (
    <>
      {/* Toggle Button - Only visible when sidebar is closed */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className={`fixed ${isInBuildView ? 'top-4 left-[240px]' : 'top-4 left-4'} z-50 shadow-xl transition-all duration-300 border bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500/50 text-white hover:from-blue-700 hover:to-purple-700 shadow-blue-500/20`}
        >
          <History className="w-4 h-4 mr-2" />
          <span className="font-medium">History</span>
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-800 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium"></span>
              </Button>
              <div className="h-5 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">History</h2>
              </div>
            </div>
            <p className="text-xs text-slate-400 ml-1">
              {history.length} agent{history.length !== 1 ? "s" : ""} created
            </p>
          </div>

          {/* History List */}
          <ScrollArea className="flex-1 p-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="text-sm text-slate-400">No agents created yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Create your first agent to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      currentAgentId === agent.id
                        ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50"
                        : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {agent.type}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => handleDelete(agent.id, e)}
                        size="sm"
                        variant="ghost"
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                      {agent.description}
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-800">
              <Button
                onClick={handleClearAll}
                size="sm"
                variant="outline"
                className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Clear All History
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
