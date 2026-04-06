'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    if (isLoaded && params.showtimeId) {
      fetchShowtime();
    }
  }, [params.showtimeId, isSignedIn, isLoaded]);

  const fetchShowtime = async () => {
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
  };

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading showtime...</p>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Showtime not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-green-50 to-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600">
                Your tickets have been booked successfully
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
              <p className="text-xl font-mono font-bold text-gray-900">
                {bookingReference}
              </p>
            </div>

            <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 'payment' ? 'Back to Seat Selection' : 'Back to Movie'}
        </button>

        {/* Movie & Theatre Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{showtime.movieTitle}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
              <SeatMap
                seats={showtime.seats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </div>

            {/* Booking Summary */}
            {selectedSeats.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">
                      Selected Seats: <span className="font-bold">{selectedSeats.join(', ')}</span>
                    </p>
                    <p className="text-3xl font-bold text-red-500">
                      Total: ₹{calculateTotal()}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProceedToPayment}
                    disabled={processing}
                    className="flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-lg shadow-lg"
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
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Booking Reference</p>
                    <p className="font-mono font-bold">{bookingReference}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Seats</p>
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