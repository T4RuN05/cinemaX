'use client';

import { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PaymentForm({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!stripe) {
      console.log('⏳ Waiting for Stripe to load...');
    } else {
      console.log('✅ Stripe loaded successfully');
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded');
      setError('Payment system not ready. Please refresh the page.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('💳 Submitting payment...');
      
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        console.error('Submit error:', submitError);
        setError(submitError.message);
        setProcessing(false);
        if (onError) onError(submitError.message);
        return;
      }

      console.log('✅ Elements submitted, confirming payment...');

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/booking-success',
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        console.error('Confirm error:', confirmError);
        setError(confirmError.message);
        setProcessing(false);
        if (onError) onError(confirmError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded!', paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        console.log('Payment status:', paymentIntent?.status);
        setError('Payment status: ' + paymentIntent?.status);
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment exception:', err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
      if (onError) onError('Payment failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-gray-900">₹{amount}</p>
          </div>
          <ShieldCheck className="h-12 w-12 text-blue-500" />
        </div>
      </div>

      {/* Loading State */}
      {!stripe && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <p className="text-sm text-blue-700">Loading payment system...</p>
          </div>
        </div>
      )}

      {/* Payment Element */}
      {stripe && (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <PaymentElement 
            onReady={() => {
              console.log('✅ Payment Element ready');
              setReady(true);
            }}
            onLoadError={(error) => {
              console.error('❌ Payment Element load error:', error);
              setError('Failed to load payment form. Please refresh the page.');
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !ready || processing}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition font-semibold text-lg shadow-lg"
      >
        {processing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Processing Payment...
          </>
        ) : !stripe || !ready ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <CreditCard className="h-6 w-6" />
            Pay ₹{amount}
          </>
        )}
      </button>

      {/* Test Card Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-yellow-800 mb-2">🧪 Test Mode - Use Test Card:</p>
        <div className="text-xs text-yellow-700 space-y-1 font-mono">
          <p>Card: <span className="bg-yellow-100 px-2 py-0.5 rounded">4242 4242 4242 4242</span></p>
          <p>Expiry: <span className="bg-yellow-100 px-2 py-0.5 rounded">12/34</span></p>
          <p>CVC: <span className="bg-yellow-100 px-2 py-0.5 rounded">123</span></p>
          <p>ZIP: <span className="bg-yellow-100 px-2 py-0.5 rounded">12345</span></p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="h-4 w-4" />
        <span>Secured by Stripe • SSL Encrypted</span>
      </div>
    </form>
  );
}