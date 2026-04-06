import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('❌ Stripe publishable key is missing!');
      console.log('Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file');
      return null;
    }
    
    console.log('✅ Loading Stripe with key:', key.substring(0, 20) + '...');
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};