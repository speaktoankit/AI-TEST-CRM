import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { firebase } from './lib/firebase'

console.log('Starting application initialization...')

// Wait for Firebase Auth to be ready
firebase.auth.authStateReady()
  .then(() => {
    console.log('Firebase Auth is ready')
    
    // Initialize the root element
    const rootElement = document.getElementById('root')
    if (!rootElement) {
      throw new Error('Failed to find the root element')
    }

    console.log('Found root element, creating React root')
    
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
    
    console.log('Application rendered successfully')
  })
  .catch((error) => {
    console.error('Failed to initialize app:', error)
    // Show error to user
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="color: red; padding: 20px; text-align: center;">
          <h1>Failed to initialize application</h1>
          <p>${error.message}</p>
        </div>
      `
    }
  })

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p style={{ color: 'red' }}>{this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}
