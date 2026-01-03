import type { Metadata } from 'next'
import './globals.css'
import { AgentProvider } from '@/contexts/agent-context'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'ARTIFEX - Agent Builder',
  description: 'AI-Powered Agent Creation Platform',
  generator: 'v0.dev',
  icons: {
    icon: '/ArtifexIcon.png',
    shortcut: '/ArtifexIcon.png',
    apple: '/ArtifexIcon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AgentProvider>{children}</AgentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
