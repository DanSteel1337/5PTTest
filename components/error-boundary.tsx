"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class WalletErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Only catch WalletConnect specific errors - let RainbowKit handle the rest
    if (error.message.includes("apply") && error.message.includes("heartbeat")) {
      return { hasError: true, error }
    }
    // Let other errors propagate normally
    throw error
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WalletConnect Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <div className="font-medium">WalletConnect Connection Issue</div>
                <div className="text-sm">
                  There was an issue with the WalletConnect heartbeat. Please refresh the page and try again.
                </div>
              </div>
              <Button size="sm" onClick={() => window.location.reload()} className="ml-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}
