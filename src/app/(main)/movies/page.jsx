'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MoviesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard since they're the same now
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}