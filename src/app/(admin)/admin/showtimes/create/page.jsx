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
    { id: 278, title: 'The Shawshank Redemption' },
    { id: 238, title: 'The Godfather' },
    { id: 240, title: 'The Godfather Part II' },
    { id: 424, title: "Schindler's List" },
    { id: 19404, title: 'Dilwale Dulhania Le Jayenge' },
    { id: 129, title: 'Spirited Away' },
    { id: 155, title: 'The Dark Knight' },
    { id: 497, title: 'The Green Mile' },
  ]);

  const [formData, setFormData] = useState({
    movieId: '',
    movieTitle: '',
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
    }
  };

  const handleMovieChange = (movieId) => {
    const movie = popularMovies.find((m) => m.id === parseInt(movieId));
    setFormData({
      ...formData,
      movieId: parseInt(movieId),
      movieTitle: movie?.title || '',
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
      await showtimesApi.create({
        ...formData,
        showDate: new Date(formData.showDate),
        pricing: {
          regular: formData.regularPrice,
          premium: formData.premiumPrice,
          vip: formData.vipPrice,
        },
      });

      alert('Showtime created successfully!');
      router.push('/admin/showtimes');
    } catch (error) {
      console.error('Error creating showtime:', error);
      alert('Failed to create showtime: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/cinema-bg.jpg')] bg-cover bg-center opacity-10 blur-sm"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 text-gray-200">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              🎬 Create Showtime
            </h1>
            <p className="text-gray-300 mt-2">Add a new movie showtime to your theatre</p>
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
                className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-md"
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
                className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-md"
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
                onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                required
                disabled={!formData.theatreId}
                className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-white/5 disabled:opacity-50"
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
                  className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="flex-1 px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
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
