'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { showtimesApi, theatresApi } from '@/lib/api';
import { Calendar, Clock, Edit, Trash2, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminShowtimesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showtimes, setShowtimes] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    } else if (isLoaded) {
      fetchData();
    }
  }, [user, isLoaded, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const theatresResponse = await theatresApi.getAll();
      setTheatres(theatresResponse.data.data || []);

      const movieIds = [278, 238, 240, 424, 19404, 129, 155, 497];
      const allShowtimes = [];

      for (const movieId of movieIds) {
        try {
          const response = await showtimesApi.getByMovie(movieId);
          if (response.data.data) {
            allShowtimes.push(...response.data.data);
          }
        } catch (error) {
          console.log(`No showtimes for movie ${movieId}`);
        }
      }

      allShowtimes.sort((a, b) => {
        const dateA = new Date(a.showDate);
        const dateB = new Date(b.showDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        return a.showTime.localeCompare(b.showTime);
      });

      setShowtimes(allShowtimes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this showtime?')) return;

    try {
      await showtimesApi.delete(id);
      alert('Showtime deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting showtime:', error);
      alert('Failed to delete showtime');
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-black">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </div>
    );
  }

  const uniqueDates = [...new Set(showtimes.map((s) => format(new Date(s.showDate), 'yyyy-MM-dd')))].sort();

  const filteredShowtimes = showtimes.filter((showtime) => {
    const matchesSearch =
      showtime.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showtime.theatreId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheatre = selectedTheatre === 'all' || showtime.theatreId?._id === selectedTheatre;
    const matchesDate =
      selectedDate === 'all' || format(new Date(showtime.showDate), 'yyyy-MM-dd') === selectedDate;
    return matchesSearch && matchesTheatre && matchesDate;
  });

  const showtimesByDate = filteredShowtimes.reduce((acc, showtime) => {
    const date = format(new Date(showtime.showDate), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 backdrop-blur-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Manage Showtimes</h1>
            <p className="text-gray-400 mt-2">Total: {filteredShowtimes.length} showtimes</p>
          </div>

          <button
            onClick={() => router.push('/admin/showtimes/create')}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/80 hover:bg-red-500 rounded-lg text-white font-semibold shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add Showtime
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by movie or theatre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Theatre Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedTheatre}
                onChange={(e) => setSelectedTheatre(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white appearance-none"
              >
                <option value="all" className="bg-zinc-800 text-white">
                  All Theatres
                </option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id} className="bg-zinc-800 text-white">
                    {theatre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white appearance-none"
              >
                <option value="all" className="bg-zinc-800 text-white">
                  All Dates
                </option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date} className="bg-zinc-800 text-white">
                    {format(new Date(date), 'MMM d, yyyy')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Showtimes Grouped by Date */}
        {Object.keys(showtimesByDate).length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-300 mb-2">No showtimes found</p>
            <p className="text-gray-400 mb-4">Try adjusting filters or create a new showtime</p>
            <button
              onClick={() => router.push('/admin/showtimes/create')}
              className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition"
            >
              Create Showtime
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(showtimesByDate).map(([date, dateShowtimes]) => (
              <div
                key={date}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Date Header */}
                <div className="bg-linear-to-r from-red-500/80 to-red-600/80 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h2>
                  <p className="text-red-100 text-sm">
                    {dateShowtimes.length} showtime{dateShowtimes.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-200">
                    <thead className="bg-white/5">
                      <tr>
                        {[
                          'Time',
                          'Movie',
                          'Theatre',
                          'Screen',
                          'Format',
                          'Language',
                          'Price',
                          'Status',
                          'Actions'
                        ].map((head, i) => (
                          <th key={i} className="px-6 py-3 text-sm font-semibold">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {dateShowtimes.map((showtime) => (
                        <tr key={showtime._id} className="hover:bg-white/10 transition">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-100">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {showtime.showTime}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{showtime.movieTitle}</td>
                          <td className="px-6 py-4 text-sm">{showtime.theatreId?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">{showtime.screenId?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                              {showtime.format}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{showtime.language || 'English'}</td>
                          <td className="px-6 py-4 text-sm">₹{showtime.pricing?.regular || 200}</td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                showtime.isActive
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {showtime.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => router.push(`/admin/showtimes/${showtime._id}/edit`)}
                                className="p-2 text-blue-400 hover:text-blue-200 transition"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(showtime._id)}
                                className="p-2 text-red-400 hover:text-red-200 transition"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
