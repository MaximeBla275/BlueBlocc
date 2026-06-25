import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'Blue Blocc Manager',
  description: 'Outil de gestion interne',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-blocc-bg text-blocc-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
