// Authentication service for user management and favorite movies

class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('movieApp_users') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('movieApp_currentUser') || 'null');
  }

  // Register a new user
  register(username, email, password) {
    // Check if user already exists
    const existingUser = this.users.find(user => 
      user.email === email || user.username === username
    );
    
    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }

    // Validate input
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In a real app, this would be hashed
      favorites: [],
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    
    return { success: true, message: 'User registered successfully' };
  }

  // Login user
  login(email, password) {
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    // Remove password from user object for security
    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    localStorage.setItem('movieApp_currentUser', JSON.stringify(this.currentUser));
    
    return { success: true, user: this.currentUser };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('movieApp_currentUser');
    return { success: true, message: 'Logged out successfully' };
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Add movie to favorites
  addToFavorites(movie) {
    if (!this.isAuthenticated()) {
      throw new Error('Please login to add favorites');
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check if movie is already in favorites
    const isAlreadyFavorite = this.users[userIndex].favorites.some(
      fav => fav.imdbID === movie.imdbID
    );

    if (isAlreadyFavorite) {
      throw new Error('Movie is already in favorites');
    }

    // Add movie to favorites
    this.users[userIndex].favorites.push({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      addedAt: new Date().toISOString()
    });

    // Update current user
    this.currentUser.favorites = this.users[userIndex].favorites;
    localStorage.setItem('movieApp_currentUser', JSON.stringify(this.currentUser));
    
    this.saveUsers();
    return { success: true, message: 'Movie added to favorites' };
  }

  // Remove movie from favorites
  removeFromFavorites(imdbID) {
    if (!this.isAuthenticated()) {
      throw new Error('Please login to manage favorites');
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Remove movie from favorites
    this.users[userIndex].favorites = this.users[userIndex].favorites.filter(
      fav => fav.imdbID !== imdbID
    );

    // Update current user
    this.currentUser.favorites = this.users[userIndex].favorites;
    localStorage.setItem('movieApp_currentUser', JSON.stringify(this.currentUser));
    
    this.saveUsers();
    return { success: true, message: 'Movie removed from favorites' };
  }

  // Get user's favorite movies
  getFavorites() {
    if (!this.isAuthenticated()) {
      return [];
    }
    return this.currentUser.favorites || [];
  }

  // Check if movie is in favorites
  isFavorite(imdbID) {
    if (!this.isAuthenticated()) {
      return false;
    }
    return this.currentUser.favorites?.some(fav => fav.imdbID === imdbID) || false;
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('movieApp_users', JSON.stringify(this.users));
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;