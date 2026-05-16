"use client"

import { Component } from "react"
import { Button } from "@/components/ui/button"

interface DashboardErrorProps {
  children: React.ReactNode
}

interface DashboardErrorState {
  hasError: boolean
  message: string | null
}

/**
 * ErrorBoundary for the dashboard — catches thrown errors from `use()`.
 * Shows a retry button that resets the boundary and re-triggers Suspense.
 */
class DashboardError extends Component<DashboardErrorProps, DashboardErrorState> {
  constructor(props: DashboardErrorProps) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError(error: unknown): DashboardErrorState {
    const message =
      error instanceof Error ? error.message : "Something went wrong."
    return { hasError: true, message }
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive" aria-atomic="true" className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-sm text-destructive">{this.state.message}</p>
          <Button variant="outline" size="sm" onClick={this.handleRetry}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export { DashboardError }
