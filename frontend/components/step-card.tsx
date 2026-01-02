"use client"

import { Settings, CheckCircle2, Loader2, Code2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AgentStep } from "@/lib/mock-api"

interface StepCardProps {
    step: AgentStep
    isExpanded?: boolean
}

export function StepCard({ step, isExpanded = true }: StepCardProps) {
    const getStatusIcon = () => {
        switch (step.status) {
            case "running":
                return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            case "completed":
                return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            case "error":
                return <div className="w-4 h-4 rounded-full bg-red-500" />
            default:
                return <div className="w-4 h-4 rounded-full bg-slate-600" />
        }
    }

    const getStatusBadge = () => {
        switch (step.status) {
            case "running":
                return (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
                        Running
                    </Badge>
                )
            case "completed":
                return (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
                        Completed
                    </Badge>
                )
            case "error":
                return (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-0.5">
                        Error
                    </Badge>
                )
            default:
                return null
        }
    }

    const formatJson = (obj: Record<string, any>): string => {
        return JSON.stringify(obj, null, 2)
    }

    return (
        <div className="animate-slide-in">
            {/* Step Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {step.stepNumber}
                </div>
                <div className="flex-1 bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium text-sm">{step.title}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
            </div>

            {/* Tool Execution Card */}
            {step.toolName && (step.status === "running" || step.status === "completed") && (
                <div className="ml-11 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            {getStatusIcon()}
                        </div>
                        <div className="flex-1 bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden">
                            {/* Tool Header */}
                            <div className="p-4 border-b border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Code2 className="w-4 h-4 text-purple-400" />
                                        <span className="text-white font-medium text-sm font-mono">
                                            {step.toolName}
                                        </span>
                                    </div>
                                    {getStatusBadge()}
                                </div>
                                <p className="text-slate-400 text-sm">{step.toolDescription}</p>
                            </div>

                            {/* Result */}
                            {step.status === "completed" && step.result && isExpanded && (
                                <div className="p-4 bg-slate-900/50">
                                    <div className="text-xs text-slate-500 mb-2">Result:</div>
                                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                                        {formatJson(step.result)}
                                    </pre>
                                </div>
                            )}

                            {/* Running animation */}
                            {step.status === "running" && (
                                <div className="p-4 bg-slate-900/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                                        </div>
                                        <span className="text-xs text-slate-400">Processing...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
