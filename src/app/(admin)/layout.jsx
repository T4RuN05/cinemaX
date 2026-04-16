'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
        <div className="glass-panel rounded-2xl px-8 py-6 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (user?.publicMetadata?.role !== 'admin') {
    return null;
  }

  return (
    <div className="page-shell flex min-h-screen flex-col text-white">
      <Navbar />
      <main className="grow px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}