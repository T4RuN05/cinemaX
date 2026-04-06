'use client';

import { useEffect, useState } from 'react';
import { showtimesApi } from '@/lib/api';
import MovieGrid from '@/components/movie/MovieGrid';
import { Loader2, Film, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoviesWithShowtimes();
  }, []);

  const fetchMoviesWithShowtimes = async () => {
    try {
      setLoading(true);

      const movieIds = [278, 238, 240, 424, 19404, 129, 155, 497];
      const moviesMap = new Map();

      for (const movieId of movieIds) {
        try {
          const response = await showtimesApi.getByMovie(movieId);
          if (response.data.data && response.data.data.length > 0) {
            const showtime = response.data.data[0];
            if (!moviesMap.has(showtime.movieId)) {
              moviesMap.set(showtime.movieId, {
                id: showtime.movieId,
                title: showtime.movieTitle || 'Untitled',
                poster_path: showtime.moviePoster || null,
                vote_average: 8.5,
                release_date: null,
              });
            }
          }
        } catch (error) {
          // Ignore missing movies
        }
      }

      setMovies(Array.from(moviesMap.values()));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-black via-gray-950 to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]" />
          <p className="text-gray-400 text-lg">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-black via-gray-950 to-gray-900 text-white">
      {/* Background glow gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.25),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,50,50,0.2),transparent_80%)]"></div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-red-400/30 rounded-full mb-5 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-red-400" />
          <span className="text-sm font-semibold text-red-300 tracking-wide">Now Showing</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-linear-to-r from-red-500 via-pink-600 to-red-800 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,0,0,0.25)]">
          Book Your Favorite Movies
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Explore top-rated films, view live seat availability, and book your next cinema experience in seconds.
        </p>
      </div>

      {/* Movies Section */}
      <div className="relative z-10 container mx-auto px-6 pb-24">
        {movies.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
            <Film className="h-20 w-20 mx-auto mb-6 text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]" />
            <h2 className="text-3xl font-bold text-white mb-3">No Movies Available</h2>
            <p className="text-gray-400 mb-6">
              Check back soon — new releases are coming to your city!
            </p>
            <div className="inline-block px-8 py-3 bg-linear-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600 text-gray-300">
              Coming Soon
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-[0_0_40px_rgba(255,0,0,0.15)] border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-linear-to-r from-red-500 via-pink-600 to-red-700 bg-clip-text text-transparent">
                All Movies
              </h2>
              <div className="text-sm text-gray-400">
                {movies.length} {movies.length === 1 ? 'movie' : 'movies'} available
              </div>
            </div>
            <MovieGrid movies={movies} />
          </div>
        )}
      </div>

      {/* Ambient Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black via-gray-950 to-transparent pointer-events-none"></div>
    </div>
  );
}
