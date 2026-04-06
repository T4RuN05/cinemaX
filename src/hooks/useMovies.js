'use client';

import { useState, useEffect } from 'react';
import { moviesApi } from '@/lib/api';

export function useMovies() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const [trendingRes, popularRes, nowPlayingRes] = await Promise.all([
        moviesApi.getTrending(),
        moviesApi.getPopular(),
        moviesApi.getNowPlaying(),
      ]);

      setTrending(trendingRes.data.data || []);
      setPopular(popularRes.data.data.results || []);
      setNowPlaying(nowPlayingRes.data.data.results || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    trending,
    popular,
    nowPlaying,
    loading,
    error,
    refetch: fetchMovies,
  };
}

export function useMovieDetails(movieId) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await moviesApi.getDetails(movieId);
      setMovie(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    movie,
    loading,
    error,
    refetch: fetchMovieDetails,
  };
}

export function useMovieSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query && query.length > 2) {
      searchMovies();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesApi.search(query);
      setResults(response.data.data.results || []);
      setError(null);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
  };
}