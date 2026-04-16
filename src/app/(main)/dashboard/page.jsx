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
      <div className="page-shell flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-red-400" />
          <p className="text-zinc-300">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <section className="glass-panel rounded-3xl px-6 py-8 sm:px-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-200">
            <Sparkles className="h-4 w-4" />
            Now Showing
          </div>

          <h1 className="theme-heading text-5xl font-bold sm:text-6xl">Choose a Movie, Book a Seat</h1>
          <p className="theme-subtext mt-4 max-w-2xl text-base sm:text-lg">
            Browse available movies with active showtimes and move straight to booking in one flow.
          </p>
        </section>

        <section className="glass-panel mt-8 rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold theme-gradient-text">Available Movies</h2>
            <p className="text-sm text-zinc-400">
              {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
            </p>
          </div>

          {movies.length === 0 ? (
            <div className="glass-card rounded-2xl py-14 text-center">
              <Film className="mx-auto mb-4 h-14 w-14 text-red-300" />
              <p className="text-xl font-semibold text-zinc-200">No movies available right now</p>
              <p className="mt-2 text-zinc-400">Add showtimes from admin to make movies visible here.</p>
            </div>
          ) : (
            <MovieGrid movies={movies} />
          )}
        </section>
      </div>
    </div>
  );
}
