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
    <div className="page-shell flex min-h-screen items-center justify-center text-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-400 border-t-transparent"></div>
        <p className="mt-4 text-zinc-300">Redirecting...</p>
      </div>
    </div>
  );
}