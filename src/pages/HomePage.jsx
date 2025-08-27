import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { omdbApi } from '../services/omdbApi';
import './HomePage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Popular movie titles for the carousel
  const popularMovies = [
    'Inception', 'Interstellar', 'The Matrix', 'Pulp Fiction', 'The Godfather',
    'Forrest Gump', 'The Shawshank Redemption', 'Titanic', 'Avatar', 'The Avengers',
    'Iron Man', 'Spider-Man', 'Gladiator', 'The Lion King', 'Jurassic Park',
    'Star Wars', 'Lord of the Rings', 'Frozen', 'Finding Nemo', 'Toy Story'
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviePromises = popularMovies.map(title => omdbApi.searchMovies(title, 1));
        const movieResults = await Promise.all(moviePromises);
        
        const allMovies = movieResults
          .filter(result => result.Search && result.Search.length > 0)
          .flatMap(result => result.Search)
          .filter(movie => movie.Poster && movie.Poster !== 'N/A');
        
        setMovies(allMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || movies.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const autoScroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(autoScroll, 50);

    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = () => {
      const newIntervalId = setInterval(autoScroll, 50);
      return newIntervalId;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [movies]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.imdbID}`);
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Movie</h1>
          <p className="hero-subtitle">Explore thousands of movies and find exactly what you're looking for</p>
        </div>
      </div>

      <div className="carousel-section">
        <div className="movie-carousel" ref={scrollRef}>
          {movies.concat(movies).map((movie, index) => (
            <div 
              key={`${movie.imdbID}-${index}`} 
              className="carousel-movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="carousel-poster">
                <img 
                  src={movie.Poster} 
                  alt={movie.Title}
                  loading="lazy"
                />
                <div className="carousel-overlay">
                  <h3 className="carousel-movie-title">{movie.Title}</h3>
                  <p className="carousel-movie-year">{movie.Year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;