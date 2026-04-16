"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bookingsApi } from "@/lib/api";
import { Calendar, Clock, MapPin, Ticket, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function MyBookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchBookings();

    if (searchParams?.get("success") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingsApi.cancel(bookingId);
      alert("Booking cancelled successfully");
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="glass-panel mb-8 rounded-3xl px-6 py-8 sm:px-8">
        <h1 className="text-4xl font-bold theme-gradient-text">My Bookings</h1>
        <p className="mt-2 text-zinc-300">Track upcoming shows and manage your reservations.</p>
      </div>

      {/* ✅ Success Message */}
      {showSuccess && (
        <div className="mb-6 rounded-xl border border-red-300/30 bg-red-500/12 px-4 py-3 text-red-100">
          <p className="font-bold">Booking Confirmed!</p>
          <p>Your tickets have been booked successfully.</p>
        </div>
      )}

      {/* ✅ No Bookings */}
      {bookings.length === 0 ? (
        <div className="glass-panel rounded-2xl py-12 text-center">
          <Ticket className="mx-auto mb-4 h-24 w-24 text-red-300" />
          <p className="text-xl text-zinc-200">No bookings yet</p>
          <p className="mt-2 text-zinc-400">
            Start booking your favorite movies!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const movieTitle = booking.movieTitle || booking.showtimeId?.movieTitle || "Unknown Movie";
            const theatreName = booking.theatreId?.name || "Unknown Theatre";
            const showDate = booking.showDate
              ? new Date(booking.showDate)
              : null;
            const hasValidShowDate =
              showDate instanceof Date && !Number.isNaN(showDate.getTime());
            const showTime = booking.showTime || "N/A";
            const seatNumbers = booking.seats?.map((seat) => seat.seatNumber) || [];

            return (
              <div
                key={booking._id}
                className="glass-card rounded-2xl p-6 transition hover:bg-white/10"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Booking Details */}
                  <div className="grow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-100">{movieTitle}</h3>
                        <p className="text-sm text-zinc-400">
                          Booking Ref: {booking.bookingReference || "N/A"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.bookingStatus === "confirmed"
                            ? "bg-red-500/20 text-red-100"
                            : "bg-zinc-600/30 text-zinc-200"
                        }`}
                      >
                        {booking.bookingStatus?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm text-zinc-300 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-300" />
                        <span>{theatreName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-red-300" />
                        <span>
                          {hasValidShowDate
                            ? format(showDate, "MMM d, yyyy")
                            : "Date not available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-300" />
                        <span>{showTime}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-zinc-300">
                        Seats:{" "}
                        <span className="font-semibold">
                          {seatNumbers.join(", ") || "N/A"}
                        </span>
                      </p>
                      <p className="mt-2 text-lg font-bold text-red-300">
                        Total: ₹{booking.totalAmount || 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="cta-secondary px-4 py-2 text-sm">
                      View Ticket
                    </button>

                    {booking.bookingStatus === "confirmed" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="cta-primary flex items-center gap-2 px-4 py-2 text-sm"
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
    </div>
  );
}
