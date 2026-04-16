'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '@/lib/api';
import { Ticket, Calendar, Clock, MapPin, Loader2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const formatDateSafe = (value, pattern = 'MMM d, yyyy') => {
  if (!value) {
    return 'N/A';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'N/A';
  }

  return format(parsedDate, pattern);
};

export default function AdminBookingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    } else if (isLoaded) {
      fetchBookings();
    }
  }, [user, isLoaded, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await bookingsApi.getAll();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-300" />
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || booking.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'cancelled').length;

  return (
    <div className="page-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="glass-panel mb-10 rounded-3xl px-6 py-8 text-center sm:px-8">
          <h1 className="text-5xl font-bold theme-gradient-text">
            All Bookings
          </h1>
          <p className="mt-2 text-lg text-zinc-300">
            Monitor and manage all customer bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Bookings', value: bookings.length, color: 'from-red-500/20 to-red-900/25', text: 'text-red-100' },
            { title: 'Confirmed', value: confirmedBookings, color: 'from-red-500/15 to-red-900/20', text: 'text-red-100' },
            { title: 'Cancelled', value: cancelledBookings, color: 'from-red-500/25 to-red-900/25', text: 'text-red-200' },
            { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'from-red-500/15 to-red-900/20', text: 'text-red-100' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`glass-panel rounded-2xl bg-linear-to-br p-6 transition-all duration-300 hover:-translate-y-0.5 ${stat.color}`}
            >
              <p className="mb-1 text-sm text-zinc-300">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-panel mb-8 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by booking ref, movie, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-glass appearance-none pl-10"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {errorMessage}
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-2 text-xl text-zinc-200">
              {bookings.length === 0 ? 'No bookings yet' : 'No bookings found'}
            </p>
            <p className="text-zinc-400">
              {bookings.length === 0
                ? 'Bookings will appear here once customers start booking tickets'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="bg-white/5">
                  <tr>
                    {[
                      'Booking Ref',
                      'Customer',
                      'Movie',
                      'Theatre',
                      'Date & Time',
                      'Seats',
                      'Amount',
                      'Status',
                      'Booked On',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-red-200">
                        {booking.bookingReference}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-white">
                          {booking.userId?.firstName} {booking.userId?.lastName}
                        </p>
                        <p className="text-xs text-zinc-400">{booking.userId?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{booking.movieTitle}</td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-red-200" />
                          <span>{booking.theatreId?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-red-200" />
                          <span>{formatDateSafe(booking.showDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-red-200" />
                          <span>{booking.showTime || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-semibold text-white">{booking.totalSeats}</span>{' '}
                        <span className="text-zinc-400">seats</span>
                        <p className="text-xs text-zinc-500">
                          {booking.seats?.map((s) => s.seatNumber).join(', ')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-200">
                        ₹{booking.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.bookingStatus === 'confirmed'
                              ? 'bg-red-500/20 text-red-100'
                              : booking.bookingStatus === 'cancelled'
                              ? 'bg-zinc-600/25 text-zinc-200'
                              : 'bg-white/10 text-zinc-200'
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                        <p className="mt-1 text-xs text-zinc-500">{booking.paymentStatus}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {formatDateSafe(booking.bookingDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
