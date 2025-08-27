import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { omdbApi } from '../services/omdbApi'
import MovieCard from '../components/MovieCard'
import FilterSection from '../components/FilterSection'
import './LandingPage.css'

function LandingPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('title-asc')
  const [filterYear, setFilterYear] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMoreResults, setHasMoreResults] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const searchQuery = searchParams.get('search')

  useEffect(() => {
    setCurrentPage(1)
    setMovies([])
    loadMovies(1, true)
  }, [searchQuery])

  useEffect(() => {
    if (movies.length > 0) {
      sortMovies()
    }
  }, [sortBy, filterYear])

  const loadMovies = async (page = 1, resetMovies = false) => {
    if (resetMovies) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError('')
    
    try {
      let data
      if (searchQuery) {
        data = await omdbApi.searchMovies(searchQuery, page)
      } else {
        data = await omdbApi.getPopularMovies()
      }
      
      if (data.Response === 'True') {
        const newMovies = data.Search || []
        if (resetMovies) {
          setMovies(newMovies)
        } else {
          setMovies(prevMovies => [...prevMovies, ...newMovies])
        }
        setTotalResults(parseInt(data.totalResults) || 0)
        setHasMoreResults(page * 10 < (parseInt(data.totalResults) || 0))
        setCurrentPage(page)
      } else {
        setError(data.Error || 'No movies found')
        if (resetMovies) {
          setMovies([])
        }
        setTotalResults(0)
        setHasMoreResults(false)
      }
    } catch (err) {
      setError('Failed to load movies. Please try again.')
      if (resetMovies) {
        setMovies([])
      }
      setTotalResults(0)
      setHasMoreResults(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const sortMovies = () => {
    let sortedMovies = [...movies]
    
    // Filter by year if specified
    if (filterYear) {
      sortedMovies = sortedMovies.filter(movie => movie.Year === filterYear)
    }
    
    // Sort movies
    switch (sortBy) {
      case 'title-asc':
        sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title))
        break
      case 'title-desc':
        sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title))
        break
      case 'year-desc':
        sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
        break
      case 'year-asc':
        sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
        break
      default:
        break
    }
    
    setMovies(sortedMovies)
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
  }

  const handleLoadMore = () => {
    if (hasMoreResults && !loadingMore) {
      loadMovies(currentPage + 1, false)
    }
  }

  const handleRetry = () => {
    setCurrentPage(1)
    setMovies([])
    loadMovies(1, true)
  }

  const getAvailableYears = () => {
    const years = [...new Set(movies.map(movie => movie.Year))]
    return years.sort((a, b) => parseInt(b) - parseInt(a))
  }

  return (
    <div className="landing-page">
      {!searchQuery && (
        <section className="hero-section">
          <div className="hero-content">
            <h1>Discover Amazing Movies</h1>
            <p>
              Explore thousands of movies from every genre and era. Find detailed information,
              ratings, and everything you need to discover your next favorite film.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">10K+</span>
                <span className="hero-stat-label">Movies</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Genres</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">100+</span>
                <span className="hero-stat-label">Years</span>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <div className="content-container">
        <FilterSection
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          availableYears={getAvailableYears()}
          searchQuery={searchQuery}
          totalResults={totalResults}
        />
        
        {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Discovering amazing movies...</p>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      )}
        
        {error && (
          <div className="error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movies-grid">
              {movies.map((movie, index) => (
                <div key={`${movie.imdbID}-${index}`} className="movie-grid-item">
                  <MovieCard
                    movie={movie}
                    onClick={() => handleMovieClick(movie.imdbID)}
                  />
                </div>
              ))}
            </div>
            
            {hasMoreResults && (
              <div className="load-more-section">
                <button 
                  onClick={handleLoadMore} 
                  className="load-more-button"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Loading more movies...
                    </>
                  ) : (
                    `Load More Movies (${movies.length} of ${totalResults})`
                  )}
                </button>
              </div>
            )}
          </>
        )}
        
        {!loading && !error && movies.length === 0 && !searchQuery && (
          <div className="no-movies">
            <p>No movies to display. Try searching for something!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage