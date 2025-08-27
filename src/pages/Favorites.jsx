import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import MovieCard from '../components/MovieCard'
import './Favorites.css'

function Favorites() {
  const navigate = useNavigate()
  const { getFavorites } = useUser()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoriteMovies = await getFavorites()
        setFavorites(favoriteMovies)
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [getFavorites])

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.imdbID}`)
  }

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorite Movies</h1>
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>No favorites yet</h2>
            <p>Start adding movies to your favorites by clicking the heart icon on any movie card.</p>
            <button 
              className="browse-btn"
              onClick={() => navigate('/')}
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites