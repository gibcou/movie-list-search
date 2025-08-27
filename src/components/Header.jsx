import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import AuthModal from './AuthModal'
import './Header.css'

function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useUser()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleLogoClick = () => {
    navigate('/')
    setSearchTerm('')
  }

  const handleLoginClick = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleRegisterClick = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const handleFavoritesClick = () => {
    navigate('/favorites')
    setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={handleLogoClick}>
            <h1>🎬 MovieSearch</h1>
          </div>
          <div className="header-right">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>

            <div className="auth-section">
              {isAuthenticated() ? (
                <div className="user-menu-container">
                  <button className="user-menu-button" onClick={toggleUserMenu}>
                    <div className="user-avatar">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user?.username}</span>
                    <svg className={`chevron ${showUserMenu ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <button onClick={handleFavoritesClick} className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        My Favorites
                      </button>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <button onClick={handleLoginClick} className="login-btn">
                    Login
                  </button>
                  <button onClick={handleRegisterClick} className="register-btn">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}

export default Header