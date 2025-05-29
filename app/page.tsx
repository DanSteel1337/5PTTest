"use client"

import { Dashboard } from "@/components/dashboard"
import { WalletErrorBoundary } from "@/components/error-boundary" // Corrected import
import { useEffect, useState } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <WalletErrorBoundary>
      {" "}
      {/* Use the correct ErrorBoundary */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Dashboard />
      </main>
    </WalletErrorBoundary>
  )
}
