'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { showtimesApi, theatresApi } from '@/lib/api';
import { Calendar, Clock, DollarSign, Film, Loader2 } from 'lucide-react';

export default function CreateShowtimePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [popularMovies] = useState([
    { id: 278, title: 'The Shawshank Redemption', poster: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg' },
    { id: 238, title: 'The Godfather', poster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: 240, title: 'The Godfather Part II', poster: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg' },
    { id: 424, title: "Schindler's List", poster: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
    { id: 19404, title: 'Dilwale Dulhania Le Jayenge', poster: '/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg' },
    { id: 129, title: 'Spirited Away', poster: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
    { id: 155, title: 'The Dark Knight', poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: 497, title: 'The Green Mile', poster: '/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg' },
  ]);

  const [formData, setFormData] = useState({
    movieId: '',
    movieTitle: '',
    moviePoster: '',
    theatreId: '',
    screenId: '',
    showDate: '',
    showTime: '',
    language: 'English',
    format: '2D',
    regularPrice: 200,
    premiumPrice: 300,
    vipPrice: 500,
  });

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    } else if (isLoaded) {
      fetchTheatres();
    }
  }, [user, isLoaded, router]);

  const fetchTheatres = async () => {
    try {
      const response = await theatresApi.getAll();
      setTheatres(response.data.data || []);
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };

  const handleTheatreChange = async (theatreId) => {
    setFormData({ ...formData, theatreId, screenId: '' });
    const theatre = theatres.find((t) => t._id === theatreId);
    if (theatre && theatre.screens) {
      setScreens(theatre.screens);
    } else {
      setScreens([]);
    }
  };

  const handleMovieChange = (movieId) => {
    const movie = popularMovies.find((m) => m.id === parseInt(movieId));
    setFormData({
      ...formData,
      movieId: parseInt(movieId),
      movieTitle: movie?.title || '',
      moviePoster: movie?.poster || '',
    });
  };

  const handleScreenChange = (screenId) => {
    const selectedScreen = screens.find((screen) => screen._id === screenId);

    setFormData({
      ...formData,
      screenId,
      format: selectedScreen?.screenType || formData.format,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movieId || !formData.theatreId || !formData.screenId) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        movieId: Number(formData.movieId),
        movieTitle: formData.movieTitle,
        moviePoster: formData.moviePoster,
        theatreId: formData.theatreId,
        screenId: formData.screenId,
        showDate: new Date(formData.showDate),
        showTime: formData.showTime,
        language: formData.language,
        format: formData.format,
        pricing: {
          regular: Number(formData.regularPrice),
          premium: Number(formData.premiumPrice),
          vip: Number(formData.vipPrice),
        },
      };

      await showtimesApi.create({
        ...payload,
      });

      alert('Showtime created successfully!');
      router.push('/admin/showtimes');
    } catch (error) {
      console.error('Error creating showtime:', error);
      alert('Failed to create showtime: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-300" />
      </div>
    );
  }

  return (
    <div className="page-shell relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-10 text-zinc-200">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight theme-gradient-text">
              Create Showtime
            </h1>
            <p className="mt-2 text-zinc-300">Add a new movie showtime to your theatre</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Movie Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
                <Film className="inline h-4 w-4 mr-2 text-red-400" />
                Select Movie *
              </label>
              <select
                value={formData.movieId}
                onChange={(e) => handleMovieChange(e.target.value)}
                required
                className="input-glass"
              >
                <option value="">Choose a movie...</option>
                {popularMovies.map((movie) => (
                  <option key={movie.id} value={movie.id} className="bg-gray-800 text-white">
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Theatre Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
                Select Theatre *
              </label>
              <select
                value={formData.theatreId}
                onChange={(e) => handleTheatreChange(e.target.value)}
                required
                className="input-glass"
              >
                <option value="">Choose a theatre...</option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id} className="bg-gray-800 text-white">
                    {theatre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Screen Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
                Select Screen *
              </label>
              <select
                value={formData.screenId}
                onChange={(e) => handleScreenChange(e.target.value)}
                required
                disabled={!formData.theatreId}
                className="input-glass disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Choose a screen...</option>
                {screens.map((screen) => (
                  <option key={screen._id} value={screen._id} className="bg-gray-800 text-white">
                    {screen.name} - {screen.screenType}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-100 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2 text-red-400" />
                  Show Date *
                </label>
                <input
                  type="date"
                  value={formData.showDate}
                  onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-glass"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-100 mb-2">
                  <Clock className="inline h-4 w-4 mr-2 text-red-400" />
                  Show Time *
                </label>
                <input
                  type="time"
                  value={formData.showTime}
                  onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
                  required
                  className="input-glass"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-semibold text-gray-100 mb-2">
                <DollarSign className="inline h-4 w-4 mr-2 text-red-400" />
                Ticket Pricing (₹)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Regular', 'Premium', 'VIP'].map((tier, index) => {
                  const keys = ['regularPrice', 'premiumPrice', 'vipPrice'];
                  return (
                    <div key={tier}>
                      <label className="block text-xs text-gray-300 mb-1">{tier}</label>
                      <input
                        type="number"
                        value={(formData)[keys[index]]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [keys[index]]: parseInt(e.target.value),
                          })
                        }
                        required
                        min="0"
                        className="input-glass"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-8 border-t border-white/20">
              <button
                type="button"
                onClick={() => router.back()}
                className="cta-secondary flex-1 px-6 py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="cta-primary flex-1 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Showtime'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
