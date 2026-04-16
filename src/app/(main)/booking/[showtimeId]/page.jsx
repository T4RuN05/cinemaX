'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { showtimesApi, bookingsApi } from '@/lib/api';
import SeatMap from '@/components/booking/SeatMap';
import PaymentForm from '@/components/booking/PaymentForm';
import { Clock, Calendar, MapPin, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('seats'); // 'seats', 'payment', 'success'
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);

  const fetchShowtime = useCallback(async () => {
    try {
      setLoading(true);
      const response = await showtimesApi.getById(params.showtimeId);
      setShowtime(response.data.data);
    } catch (error) {
      console.error('Error fetching showtime:', error);
      alert('Failed to load showtime');
    } finally {
      setLoading(false);
    }
  }, [params.showtimeId]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (isLoaded && params.showtimeId) {
      fetchShowtime();
    }
  }, [fetchShowtime, isSignedIn, isLoaded, params.showtimeId, router]);

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      return [...prev, seatNumber];
    });
  };

  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach((seatNumber) => {
      const seat = showtime.seats.find((s) => s.seatNumber === seatNumber);
      if (seat) {
        const price = showtime.pricing[seat.type] || showtime.pricing.regular;
        total += price;
      }
    });
    return total;
  };

  const handleProceedToPayment = async () => {
  if (selectedSeats.length === 0) {
    alert('Please select at least one seat');
    return;
  }

  console.log('🎫 Starting booking process...');
  console.log('Selected seats:', selectedSeats);
  setProcessing(true);

  try {
    // Step 1: Lock seats
    console.log('🔒 Locking seats...');
    await bookingsApi.lockSeats({
      showtimeId: params.showtimeId,
      seatNumbers: selectedSeats,
    });
    console.log('✅ Seats locked');

    // Step 2: Create payment intent
    console.log('💳 Creating payment intent...');
    const response = await bookingsApi.createPaymentIntent({
      showtimeId: params.showtimeId,
      seatNumbers: selectedSeats,
    });
    
    console.log('✅ Payment intent created:', response.data);
    console.log('Client secret:', response.data.clientSecret?.substring(0, 20) + '...');

    setClientSecret(response.data.clientSecret);
    setBookingReference(response.data.bookingReference);
    setStep('payment');
  } catch (error) {
    console.error('❌ Booking error:', error);
    console.error('Error response:', error.response?.data);
    alert(error.response?.data?.error || 'Failed to proceed. Please try again.');
    fetchShowtime(); // Refresh seat status
  } finally {
    setProcessing(false);
  }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      setProcessing(true);
      
      // Confirm booking
      const response = await bookingsApi.confirm({
        showtimeId: params.showtimeId,
        seatNumbers: selectedSeats,
        paymentIntentId,
      });

      // Show success and redirect
      setStep('success');
      
      setTimeout(() => {
        router.push(`/my-bookings?success=true&bookingId=${response.data.data._id}`);
      }, 3000);
    } catch (error) {
      console.error('Booking confirmation error:', error);
      alert('Payment successful but booking failed. Please contact support with reference: ' + bookingReference);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  if (!isLoaded || loading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-red-400" />
          <p className="text-zinc-300">Loading showtime...</p>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4 text-xl text-zinc-300">Showtime not found</p>
          <button
            onClick={() => router.back()}
            className="cta-primary px-6 py-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success View
  if (step === 'success') {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="glass-panel rounded-2xl p-8 text-white">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                <CheckCircle className="h-12 w-12 text-red-200" />
              </div>
              <h1 className="mb-2 text-3xl font-bold theme-gradient-text">
                Booking Confirmed!
              </h1>
              <p className="text-zinc-300">
                Your tickets have been booked successfully
              </p>
            </div>

            <div className="glass-card mb-6 rounded-lg p-4">
              <p className="mb-1 text-sm text-zinc-300">Booking Reference</p>
              <p className="text-xl font-mono font-bold text-red-100">
                {bookingReference}
              </p>
            </div>

            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-red-200" />
            <p className="text-sm text-zinc-400">Redirecting to your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => {
            if (step === 'payment') {
              setStep('seats');
              setClientSecret(null);
            } else {
              router.back();
            }
          }}
          className="mb-6 flex items-center gap-2 text-zinc-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 'payment' ? 'Back to Seat Selection' : 'Back to Movie'}
        </button>

        {/* Movie & Theatre Info */}
        <div className="glass-panel mb-8 rounded-2xl p-6">
          <h1 className="text-3xl font-bold mb-4">{showtime.movieTitle}</h1>
          
          <div className="grid grid-cols-1 gap-4 text-zinc-300 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold">{showtime.theatreId?.name}</p>
                <p className="text-sm">{showtime.theatreId?.location?.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold">
                  {format(new Date(showtime.showDate), 'EEEE, MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold">{showtime.showTime}</p>
                <p className="text-sm">{showtime.format}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {step === 'seats' ? (
          <>
            {/* Seat Selection */}
            <div className="glass-panel mb-8 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
              <SeatMap
                seats={showtime.seats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </div>

            {/* Booking Summary */}
            {selectedSeats.length > 0 && (
              <div className="glass-panel sticky bottom-4 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-zinc-300">
                      Selected Seats: <span className="font-bold">{selectedSeats.join(', ')}</span>
                    </p>
                    <p className="text-3xl font-bold text-red-300">
                      Total: ₹{calculateTotal()}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProceedToPayment}
                    disabled={processing}
                    className="cta-primary flex items-center gap-2 px-8 py-4 text-lg disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Payment Step */
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

              <div className="glass-card mb-6 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300">
                  <div>
                    <p className="text-zinc-400">Booking Reference</p>
                    <p className="font-mono font-bold">{bookingReference}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Seats</p>
                    <p className="font-semibold">{selectedSeats.join(', ')}</p>
                  </div>
                </div>
              </div>

              {clientSecret && (
                <Elements 
                  stripe={getStripe()} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <PaymentForm 
                    amount={calculateTotal()} 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}