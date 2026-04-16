'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { moviesApi, showtimesApi } from '@/lib/api';
import { Star, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const getDateKey = (dateValue) => format(new Date(dateValue), 'yyyy-MM-dd');

const getNearestAvailableDate = (dateKeys) => {
  if (dateKeys.length === 0) {
    return null;
  }

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const nextAvailable = dateKeys.find((dateKey) => dateKey >= todayKey);

  return nextAvailable || dateKeys[dateKeys.length - 1];
};

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const loadMovieAndShowtimes = async () => {
      try {
        setLoading(true);

        const [movieResponse, showtimesResponse] = await Promise.all([
          moviesApi.getDetails(params.id),
          showtimesApi.getByMovie(params.id),
        ]);

        setMovie(movieResponse.data.data);

        const showtimes = showtimesResponse.data.data || [];
        const dateKeys = [...new Set(showtimes.map((showtime) => getDateKey(showtime.showDate)))].sort();

        setAllShowtimes(showtimes);
        setSelectedDate((currentDate) => {
          if (currentDate && dateKeys.includes(currentDate)) {
            return currentDate;
          }

          return getNearestAvailableDate(dateKeys);
        });
      } catch (error) {
        console.error('Error loading movie details page:', error);
        setAllShowtimes([]);
        setSelectedDate(null);
      } finally {
        setLoading(false);
      }
    };

    loadMovieAndShowtimes();
  }, [params.id]);

  const handleShowtimeSelect = (showtimeId) => {
    router.push(`/booking/${showtimeId}`);
  };

  if (loading || !movie) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
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

  const availableDateKeys = [...new Set(allShowtimes.map((showtime) => getDateKey(showtime.showDate)))].sort();

  const showtimes = selectedDate
    ? allShowtimes.filter((showtime) => getDateKey(showtime.showDate) === selectedDate)
    : allShowtimes;

  const showtimesByTheatre = showtimes.reduce((acc, showtime) => {
    const theatreName = showtime.theatreId?.name || 'Unknown Theatre';
    if (!acc[theatreName]) acc[theatreName] = [];
    acc[theatreName].push(showtime);
    return acc;
  }, {});

  return (
    <div className="page-shell min-h-screen overflow-hidden text-white">

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
      <div className="relative z-10 mx-auto -mt-48 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Poster */}
          <div className="glass-card relative h-96 w-64 overflow-hidden rounded-2xl">
            <Image src={imageUrl} alt={movie.title} fill className="object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold bg-linear-to-r from-red-500 to-red-300 bg-clip-text text-transparent mb-4">
              {movie.title}
            </h1>

            <div className="mb-4 flex items-center gap-4 text-sm text-zinc-300">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-red-300 mr-1" />
                <span>{movie.vote_average?.toFixed(1)}/10</span>
              </div>
              <span>•</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="glass-card rounded-xl p-4 text-lg leading-relaxed text-zinc-300">
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Showtime Section */}
        <div className="glass-panel mt-16 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-red-400">Book Tickets</h2>

          {/* Date Selector */}
          {availableDateKeys.length > 0 && (
            <div className="flex gap-3 mb-8 overflow-x-auto pb-3">
              {availableDateKeys.map((dateKey) => {
                const date = new Date(`${dateKey}T00:00:00`);
                const isSelected = dateKey === selectedDate;

                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`flex flex-col items-center px-5 py-3 rounded-xl min-w-20 transition border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-900/40'
                        : 'bg-white/10 text-zinc-300 border-white/15 hover:bg-red-500/20'
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
          )}

          {/* Showtimes by Theatre */}
          {allShowtimes.length === 0 ? (
            <div className="py-16 text-center text-zinc-400">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No showtimes available for this movie</p>
            </div>
          ) : showtimes.length === 0 ? (
            <div className="py-16 text-center text-zinc-400">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No showtimes available for the selected date</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(showtimesByTheatre).map(([theatreName, theatreShowtimes]) => (
                <div
                  key={theatreName}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-bold text-xl text-red-400 mb-2">
                    {theatreName}
                  </h3>
                  <p className="mb-4 text-sm text-zinc-400">
                    {theatreShowtimes[0]?.theatreId?.location?.address}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {theatreShowtimes.map((showtime) => (
                      <button
                        key={showtime._id}
                        onClick={() => handleShowtimeSelect(showtime._id)}
                        className="flex flex-col items-center rounded-xl border border-red-300/30 bg-red-500/10 px-6 py-3 font-semibold text-red-200 transition hover:bg-red-500/20"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{showtime.showTime}</span>
                        </div>
                        <div className="mt-1 text-xs text-zinc-300">
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
