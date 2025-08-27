import { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import './MovieCard.css'

function MovieCard({ movie, onClick }) {
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    
    if (!isAuthenticated()) {
      return
    }

    setIsProcessing(true)
    try {
      if (isFavorite(movie.imdbID)) {
        await removeFromFavorites(movie.imdbID)
      } else {
        await addToFavorites(movie)
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-poster">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
          alt={movie.Title}
          onError={handleImageError}
        />
        <div className="poster-frame"></div>
        <div className="movie-overlay">
          <div className="movie-info">
            <h3>{movie.Title}</h3>
            <div className="movie-meta">
              <span className="movie-year">{movie.Year}</span>
              <span className="movie-type">{movie.Type}</span>
            </div>
          </div>
          
          {isAuthenticated() && (
            <button 
              className={`favorite-btn ${isFavorite(movie.imdbID) ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              disabled={isProcessing}
              title={isFavorite(movie.imdbID) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(movie.imdbID) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard