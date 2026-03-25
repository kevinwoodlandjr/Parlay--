import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg, #111)', color: 'var(--color-fg, #eee)' }}>
          <div className="max-w-md w-full text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(200, 150, 46, 0.1)' }}
            >
              <span className="text-3xl" style={{ color: '#C8962E' }}>!</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-sm mb-1" style={{ color: 'var(--color-fg-muted, #999)' }}>
              Slip<span style={{ color: '#C8962E' }}>Mate</span> encountered an unexpected error.
            </p>
            <p className="text-sm mb-8" style={{ color: 'var(--color-fg-subtle, #666)' }}>
              Please try reloading the page. If the problem persists, contact us.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-xl text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C8962E' }}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
