import { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import AuthModal from './AuthModal'
import './AuthGuard.css'

function AuthGuard({ children, fallback, showPrompt = true }) {
  const { isAuthenticated } = useUser()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const handleLoginClick = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleRegisterClick = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  // If authenticated, render children
  if (isAuthenticated()) {
    return children
  }

  // If custom fallback provided, use it
  if (fallback) {
    return fallback
  }

  // Default authentication prompt
  if (showPrompt) {
    return (
      <>
        <div className="auth-guard-container">
          <div className="auth-guard-content">
            <div className="auth-guard-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="currentColor"/>
              </svg>
            </div>
            <h2>Authentication Required</h2>
            <p>Please log in to access this feature and manage your favorite movies.</p>
            <div className="auth-guard-buttons">
              <button onClick={handleLoginClick} className="auth-guard-btn primary">
                Log In
              </button>
              <button onClick={handleRegisterClick} className="auth-guard-btn secondary">
                Sign Up
              </button>
            </div>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    )
  }

  // Return null if no prompt should be shown
  return null
}

export default AuthGuard