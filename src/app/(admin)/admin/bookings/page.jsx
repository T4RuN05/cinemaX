'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Ticket, Calendar, Clock, MapPin, Loader2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminBookingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
      // TODO: Replace with bookingsApi.getAll()
      setBookings([]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 to-black">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-950 text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold bg-linear-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
            All Bookings
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Monitor and manage all customer bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Bookings', value: bookings.length, color: 'from-blue-600/30 to-blue-900/40', text: 'text-blue-300' },
            { title: 'Confirmed', value: confirmedBookings, color: 'from-green-600/30 to-green-900/40', text: 'text-green-300' },
            { title: 'Cancelled', value: cancelledBookings, color: 'from-red-600/30 to-red-900/40', text: 'text-red-300' },
            { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'from-purple-600/30 to-purple-900/40', text: 'text-purple-300' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl backdrop-blur-xl bg-linear-to-br ${stat.color} border border-white/10 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-500`}
            >
              <p className="text-gray-300 text-sm mb-1">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 p-6 rounded-2xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by booking ref, movie, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none appearance-none"
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
        {filteredBookings.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-12 text-center shadow-lg">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-300 mb-2">
              {bookings.length === 0 ? 'No bookings yet' : 'No bookings found'}
            </p>
            <p className="text-gray-500">
              {bookings.length === 0
                ? 'Bookings will appear here once customers start booking tickets'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-lg overflow-hidden">
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
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-400">
                        {booking.bookingReference}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-white">
                          {booking.userId?.firstName} {booking.userId?.lastName}
                        </p>
                        <p className="text-gray-400 text-xs">{booking.userId?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{booking.movieTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{booking.theatreId?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{format(new Date(booking.showDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{booking.showTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-semibold text-white">{booking.totalSeats}</span>{' '}
                        <span className="text-gray-400">seats</span>
                        <p className="text-xs text-gray-500">
                          {booking.seats?.map((s) => s.seatNumber).join(', ')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-300">
                        ₹{booking.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.bookingStatus === 'confirmed'
                              ? 'bg-green-500/20 text-green-300'
                              : booking.bookingStatus === 'cancelled'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{booking.paymentStatus}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
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
