"use client"

import { CheckCircle2, Download, Github, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessCardProps {
    agentName?: string
    onDownload?: () => void
    isDownloading?: boolean
}

export function SuccessCard({
    agentName = "AI Agent",
    onDownload,
    isDownloading = false
}: SuccessCardProps) {
    return (
        <div className="animate-scale-in">
            <div className="bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mx-2">
                {/* Success Icon */}
                <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Rocket className="w-5 h-5 text-emerald-400" />
                        Agent Created Successfully!
                    </h3>
                    <p className="text-slate-300 text-sm">
                        Your <span className="text-emerald-400 font-medium">{agentName}</span> has been configured and is ready for deployment.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">5</div>
                        <div className="text-xs text-slate-400">Steps Completed</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">4</div>
                        <div className="text-xs text-slate-400">Tools Generated</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-400">3</div>
                        <div className="text-xs text-slate-400">Sub-Agents</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={onDownload}
                        disabled={isDownloading}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? "Generating..." : "Download Agent"}
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
                    >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                    </Button>
                </div>

                {/* Additional Info */}
                <p className="text-xs text-slate-500 text-center mt-4">
                    You can preview and test your agent in the panel on the right →
                </p>
            </div>
        </div>
    )
}
