import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (client-side only)
api.interceptors.request.use(
  async (config) => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      try {
        // Call our token API route to get Clerk token
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const { token } = await response.json();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        // Silently fail - some routes don't need auth
        console.log('Auth token not available');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Movies API - No authentication needed (public routes)
export const moviesApi = {
  getTrending: () => api.get('/movies/trending'),
  getPopular: (page = 1) => api.get(`/movies/popular?page=${page}`),
  getNowPlaying: (page = 1) => api.get(`/movies/now-playing?page=${page}`),
  search: (query, page = 1) => api.get(`/movies/search?query=${query}&page=${page}`),
  getDetails: (id) => api.get(`/movies/${id}`),
};

// Theatres API
export const theatresApi = {
  getAll: () => api.get('/theatres'),
  getById: (id) => api.get(`/theatres/${id}`),
  create: (data) => api.post('/theatres', data),
  update: (id, data) => api.put(`/theatres/${id}`, data),
  delete: (id) => api.delete(`/theatres/${id}`),
};

// Showtimes API
export const showtimesApi = {
  getAll: (params) => api.get('/showtimes', { params }),
  getByMovie: (movieId, params) => 
    api.get(`/showtimes/movie/${movieId}`, { params }),
  getById: (id) => api.get(`/showtimes/${id}`),
  create: (data) => api.post('/showtimes', data),
  update: (id, data) => api.put(`/showtimes/${id}`, data),
  delete: (id) => api.delete(`/showtimes/${id}`),
};

// Bookings API - Requires auth token
export const bookingsApi = {
  lockSeats: (data) => api.post('/bookings/lock-seats', data),
  createPaymentIntent: (data) => api.post('/bookings/create-payment-intent', data),
  confirm: (data) => api.post('/bookings/confirm', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: (params) => api.get('/bookings', { params }),
};

export default api;