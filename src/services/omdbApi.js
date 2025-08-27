const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '7764f155'
const BASE_URL = 'https://www.omdbapi.com/'

// Check if API key is properly configured
if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('OMDB API key not configured. Please set VITE_OMDB_API_KEY in your .env file.')
}

export const omdbApi = {
  // Search for movies by title
  searchMovies: async (query, page = 1) => {
    try {
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.Error) {
        throw new Error(data.Error)
      }
      
      return data
    } catch (error) {
      console.error('Error searching movies:', error)
      throw error
    }
  },

  // Get movie details by ID
  getMovieById: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.Error) {
        throw new Error(data.Error)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching movie details:', error)
      throw error
    }
  },

  // Get popular movies (using a predefined search)
  getPopularMovies: async () => {
    try {
      const popularSearches = ['avengers', 'batman', 'star wars', 'marvel', 'disney']
      const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)]
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${randomSearch}&type=movie`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.Error) {
        throw new Error(data.Error)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      throw error
    }
  },

  // Search movies by year
  searchMoviesByYear: async (year, query = 'movie') => {
    try {
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${query}&y=${year}&type=movie`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.Error) {
        throw new Error(data.Error)
      }
      
      return data
    } catch (error) {
      console.error('Error searching movies by year:', error)
      throw error
    }
  }
}