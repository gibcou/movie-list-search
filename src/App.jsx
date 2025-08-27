import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import MovieDetail from './pages/MovieDetail'
import Favorites from './pages/Favorites'
import './App.css'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<LandingPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
