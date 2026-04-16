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
          return_url: window.location.origin + '/my-bookings',
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
      <div className="glass-card rounded-lg border-red-300/20 bg-red-500/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm text-zinc-300">Total Amount</p>
            <p className="text-3xl font-bold text-red-100">₹{amount}</p>
          </div>
          <ShieldCheck className="h-12 w-12 text-red-300" />
        </div>
      </div>

      {/* Loading State */}
      {!stripe && (
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-red-300" />
            <p className="text-sm text-zinc-300">Loading payment system...</p>
          </div>
        </div>
      )}

      {/* Payment Element */}
      {stripe && (
        <div className="glass-card rounded-lg p-4">
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
        <div className="rounded border-l-4 border-red-400 bg-red-500/12 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-300" />
            <div className="ml-3">
              <p className="text-sm text-red-100">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !ready || processing}
        className="cta-primary w-full gap-3 px-6 py-4 text-lg disabled:cursor-not-allowed disabled:opacity-55"
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
      <div className="glass-card rounded-lg border-red-300/20 p-4">
        <p className="mb-2 text-xs font-semibold text-red-100">Test Mode - Use Test Card:</p>
        <div className="space-y-1 font-mono text-xs text-zinc-300">
          <p>Card: <span className="rounded bg-black/30 px-2 py-0.5">4242 4242 4242 4242</span></p>
          <p>Expiry: <span className="rounded bg-black/30 px-2 py-0.5">12/34</span></p>
          <p>CVC: <span className="rounded bg-black/30 px-2 py-0.5">123</span></p>
          <p>ZIP: <span className="rounded bg-black/30 px-2 py-0.5">12345</span></p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
        <ShieldCheck className="h-4 w-4" />
        <span>Secured by Stripe • SSL Encrypted</span>
      </div>
    </form>
  );
}