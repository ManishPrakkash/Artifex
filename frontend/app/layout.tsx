import type { Metadata } from 'next'
import './globals.css'
import { AgentProvider } from '@/contexts/agent-context'

export const metadata: Metadata = {
  title: 'ARTIFEX - Agent Builder',
  description: 'AI-Powered Agent Creation Platform',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AgentProvider>{children}</AgentProvider>
      </body>
    </html>
  )
}
