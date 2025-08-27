import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Initialize user state on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFavorites(authService.getFavorites());
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const result = authService.login(email, password);
      setUser(result.user);
      setFavorites(authService.getFavorites());
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const result = authService.register(username, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setFavorites([]);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // Add to favorites
  const addToFavorites = (movie) => {
    try {
      const result = authService.addToFavorites(movie);
      setFavorites(authService.getFavorites());
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Remove from favorites
  const removeFromFavorites = (imdbID) => {
    try {
      const result = authService.removeFromFavorites(imdbID);
      setFavorites(authService.getFavorites());
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Check if movie is favorite
  const isFavorite = (imdbID) => {
    return authService.isFavorite(imdbID);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Get favorites function
  const getFavorites = () => {
    return authService.getFavorites();
  };

  const value = {
    user,
    loading,
    favorites,
    login,
    register,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    isAuthenticated,
    getFavorites
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;