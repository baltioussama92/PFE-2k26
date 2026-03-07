import React from 'react'

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error): void {
    console.error('Unhandled UI error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-slate-50 px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-600">Please refresh the page. If the issue persists, try again later.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
