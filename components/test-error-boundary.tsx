"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { debug } from "@/lib/debug"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class TestErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    debug.error("Test Runner Error:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Test Runner Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-600">{this.state.error?.message || "An unknown error occurred"}</p>
              {this.state.error?.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600">Error Details</summary>
                  <pre className="mt-2 max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
