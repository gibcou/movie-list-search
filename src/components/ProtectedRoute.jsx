import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import './ProtectedRoute.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useUser()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  // Render the protected component if authenticated
  return children
}

export default ProtectedRoute