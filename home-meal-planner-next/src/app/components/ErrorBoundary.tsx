'use client'
import React from 'react'
import { useAppState } from '../AppStateContext'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private showToast?: (message: string, type: 'error' | 'success' | 'info' | 'warning') => void

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Try to show toast if available
    if (this.showToast) {
      const message = error.message || 'Odottamaton virhe tapahtui'
      this.showToast(message, 'error')
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
          onSetToastRef={(showToast) => {
            this.showToast = showToast
          }}
        />
      )
    }

    return (
      <ErrorBoundaryWrapper
        onSetToastRef={(showToast) => {
          this.showToast = showToast
        }}
      >
        {this.props.children}
      </ErrorBoundaryWrapper>
    )
  }
}

function ErrorBoundaryWrapper({
  children,
  onSetToastRef,
}: {
  children: React.ReactNode
  onSetToastRef: (showToast: (message: string, type: 'error' | 'success' | 'info' | 'warning') => void) => void
}) {
  const { showToast } = useAppState()

  React.useEffect(() => {
    onSetToastRef(showToast)
  }, [showToast, onSetToastRef])

  return <>{children}</>
}

function ErrorBoundaryFallback({
  error,
  onReset,
  onSetToastRef,
}: {
  error: Error | null
  onReset: () => void
  onSetToastRef: (showToast: (message: string, type: 'error' | 'success' | 'info' | 'warning') => void) => void
}) {
  const { showToast } = useAppState()

  React.useEffect(() => {
    onSetToastRef(showToast)
  }, [showToast, onSetToastRef])

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Jotain meni pieleen</h1>
          <p className='text-gray-600 mb-4'>Sovelluksessa tapahtui odottamaton virhe.</p>
          {error && (
            <details className='mb-4 text-left'>
              <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>Virheen tiedot</summary>
              <pre className='mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto'>
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <button
            onClick={onReset}
            className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Yritä uudelleen
          </button>
        </div>
      </div>
    </div>
  )
}
