import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { omdbApi } from '../services/omdbApi'
import { useUser } from '../contexts/UserContext'
import './MovieDetail.css'

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } = useUser()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadMovieDetails()
  }, [id])

  const loadMovieDetails = async () => {
    setLoading(true)
    setError('')
    
    try {
      const data = await omdbApi.getMovieById(id)
      
      if (data.Response === 'True') {
        setMovie(data)
      } else {
        setError(data.Error || 'Movie not found')
      }
    } catch (err) {
      setError('Failed to load movie details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='
  }

  const handleImdbClick = () => {
    if (movie.imdbID) {
      window.open(`https://www.imdb.com/title/${movie.imdbID}/`, '_blank')
    }
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated || !movie) return
    
    setIsProcessing(true)
    try {
      const movieData = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster
      }
      
      if (isFavorite(movie.imdbID)) {
        await removeFromFavorites(movie.imdbID)
      } else {
        await addToFavorites(movieData)
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="movie-detail-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="movie-detail-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    )
  }

  if (!movie) {
    return null
  }

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="movie-detail-content">
        <div className="movie-poster-section">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
            alt={movie.Title}
            onError={handleImageError}
            className="movie-detail-poster"
          />
        </div>
        
        <div className="movie-info-section">
          <h1 className="movie-title">{movie.Title}</h1>
          
          <div className="movie-meta">
            {movie.Year && movie.Year !== 'N/A' && (
              <span className="movie-year">{movie.Year}</span>
            )}
            {movie.Rated && movie.Rated !== 'N/A' && (
              <span className="movie-rating">{movie.Rated}</span>
            )}
            {movie.Runtime && movie.Runtime !== 'N/A' && (
              <span className="movie-runtime">{movie.Runtime}</span>
            )}
          </div>
          
          <div className="movie-genres">
            {movie.Genre && movie.Genre.split(', ').map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
          
          <div className="movie-plot">
            <h3>Synopsis</h3>
            <p className="plot-text">{movie.Plot !== 'N/A' ? movie.Plot : 'No plot summary available for this movie.'}</p>
          </div>
          
          <div className="movie-details-grid">
            {movie.Director && movie.Director !== 'N/A' && (
              <div className="detail-item">
                <strong>Director:</strong>
                <span>{movie.Director}</span>
              </div>
            )}
            {movie.Writer && movie.Writer !== 'N/A' && (
              <div className="detail-item">
                <strong>Writer:</strong>
                <span>{movie.Writer}</span>
              </div>
            )}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="detail-item">
                <strong>Cast:</strong>
                <span>{movie.Actors}</span>
              </div>
            )}
            {movie.Language && movie.Language !== 'N/A' && (
              <div className="detail-item">
                <strong>Language:</strong>
                <span>{movie.Language}</span>
              </div>
            )}
            {movie.Country && movie.Country !== 'N/A' && (
              <div className="detail-item">
                <strong>Country:</strong>
                <span>{movie.Country}</span>
              </div>
            )}
            {movie.Awards && movie.Awards !== 'N/A' && (
               <div className="detail-item">
                 <strong>Awards:</strong>
                 <span>{movie.Awards}</span>
               </div>
             )}
          </div>
          
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="movie-ratings">
              <h3>Ratings</h3>
              <div className="ratings-grid">
                {movie.Ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <span className="rating-source">{rating.Source}</span>
                    <span className="rating-value">{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="movie-actions">
            <button onClick={handleImdbClick} className="imdb-button">
              View on IMDb
            </button>
            {isAuthenticated && (
              <button 
                onClick={handleFavoriteClick}
                disabled={isProcessing}
                className={`favorite-button ${isFavorite(movie.imdbID) ? 'favorited' : ''}`}
              >
                {isProcessing ? (
                  'Processing...'
                ) : isFavorite(movie.imdbID) ? (
                  '❤️ Remove from Favorites'
                ) : (
                  '🤍 Add to Favorites'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail