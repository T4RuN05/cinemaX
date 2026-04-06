'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { bookingsApi } from '@/lib/api';
import { Calendar, Clock, MapPin, Ticket, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function MyBookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchBookings();

    // Show success message if redirected from booking
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsApi.cancel(bookingId);
      alert('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* ✅ Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Booking Confirmed!</p>
          <p>Your tickets have been booked successfully.</p>
        </div>
      )}

      {/* ✅ No Bookings */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No bookings yet</p>
          <p className="text-gray-500 mt-2">Start booking your favorite movies!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const showtime = booking.showtime; // populated object
            const movieTitle = showtime?.movieTitle || 'Unknown Movie';
            const theatreName = showtime?.theatreId?.name || 'Unknown Theatre';
            const showDate = showtime?.showDate ? new Date(showtime.showDate) : null;
            const showTime = showtime?.showTime || 'N/A';

            return (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Booking Details */}
                  <div className="grow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{movieTitle}</h3>
                        <p className="text-sm text-gray-500">
                          Booking Ref: {booking.bookingReference || 'N/A'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.bookingStatus === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.bookingStatus?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{theatreName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {showDate
                            ? format(showDate, 'MMM d, yyyy')
                            : 'Date not available'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{showTime}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Seats:{' '}
                        <span className="font-semibold">
                          {booking.seatNumbers?.join(', ') || 'N/A'}
                        </span>
                      </p>
                      <p className="text-lg font-bold text-red-500 mt-2">
                        Total: ₹{booking.totalPrice || 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      View Ticket
                    </button>

                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
