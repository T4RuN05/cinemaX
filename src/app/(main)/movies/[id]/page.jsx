'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { moviesApi, showtimesApi } from '@/lib/api';
import { Star, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchMovieDetails();
      fetchShowtimes();
    }
  }, [params.id, selectedDate]);

  const fetchMovieDetails = async () => {
    try {
      const response = await moviesApi.getDetails(params.id);
      setMovie(response.data.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await showtimesApi.getByMovie(params.id, {
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
      setShowtimes(response.data.data);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowtimeSelect = (showtimeId) => {
    router.push(`/booking/${showtimeId}`);
  };

  if (loading || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.png';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const showtimesByTheatre = showtimes.reduce((acc, showtime) => {
    const theatreName = showtime.theatreId?.name || 'Unknown Theatre';
    if (!acc[theatreName]) acc[theatreName] = [];
    acc[theatreName].push(showtime);
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative bg-black overflow-hidden text-white">
      {/* Background cinematic red glow */}
      <div className="absolute inset-0 bg-linear-to-br from-red-900/30 via-black to-black"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-700/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      {/* Movie Backdrop */}
      {backdropUrl && (
        <div className="relative h-112 w-full">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />
        </div>
      )}

      {/* Movie Details Section */}
      <div className="container mx-auto px-6 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Poster */}
          <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl bg-white/5">
            <Image src={imageUrl} alt={movie.title} fill className="object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold bg-linear-to-r from-red-500 to-red-300 bg-clip-text text-transparent mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{movie.vote_average?.toFixed(1)}/10</span>
              </div>
              <span>•</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full text-sm bg-white/10 border border-white/10 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Showtime Section */}
        <div className="mt-16 backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/10 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-red-400">Book Tickets</h2>

          {/* Date Selector */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-3">
            {[...Array(7)].map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const isSelected =
                format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center px-5 py-3 rounded-xl min-w-20 transition border ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-900/40'
                      : 'bg-white/10 text-gray-300 border-white/10 hover:bg-red-500/20'
                  }`}
                >
                  <span className="text-xs font-semibold">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-lg font-bold">{format(date, 'd')}</span>
                  <span className="text-xs">{format(date, 'MMM')}</span>
                </button>
              );
            })}
          </div>

          {/* Showtimes by Theatre */}
          {showtimes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No showtimes available for this date</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(showtimesByTheatre).map(([theatreName, theatreShowtimes]) => (
                <div
                  key={theatreName}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md"
                >
                  <h3 className="font-bold text-xl text-red-400 mb-2">
                    {theatreName}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {theatreShowtimes[0]?.theatreId?.location?.address}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {theatreShowtimes.map((showtime) => (
                      <button
                        key={showtime._id}
                        onClick={() => handleShowtimeSelect(showtime._id)}
                        className="px-6 py-3 rounded-xl border border-green-500 text-green-400 hover:bg-green-600/30 hover:text-white transition font-semibold flex flex-col items-center shadow-sm hover:shadow-green-900/40"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{showtime.showTime}</span>
                        </div>
                        <div className="text-xs mt-1 text-gray-300">
                          {showtime.format}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
