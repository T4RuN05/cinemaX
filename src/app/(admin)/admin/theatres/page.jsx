'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Film, Building2, Calendar, Ticket } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalTheatres: 3,
    totalScreens: 10,
    totalShowtimes: '--',
    totalBookings: 0,
  });

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white">
      {/* Background Red Gradient Patches */}
      <div className="absolute inset-0 bg-linear-to-br from-red-900/40 via-black to-black"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-700/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Manage theatres, screens, showtimes, and bookings efficiently.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: 'Theatres',
              value: stats.totalTheatres,
              icon: <Building2 className="h-12 w-12 text-red-400 opacity-80" />,
            },
            {
              label: 'Screens',
              value: stats.totalScreens,
              icon: <Film className="h-12 w-12 text-red-400 opacity-80" />,
            },
            {
              label: 'Active Showtimes',
              value: stats.totalShowtimes,
              icon: <Calendar className="h-12 w-12 text-red-400 opacity-80" />,
            },
            {
              label: 'Total Bookings',
              value: stats.totalBookings,
              icon: <Ticket className="h-12 w-12 text-red-400 opacity-80" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-red-900/30 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{item.label}</p>
                  <p className="text-3xl font-bold text-red-400">{item.value}</p>
                </div>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              href: '/admin/theatres',
              icon: <Building2 className="h-16 w-16 mx-auto mb-4 text-red-400 group-hover:scale-110 transition" />,
              title: 'Manage Theatres',
              desc: 'Add, edit, or remove theatres and screens',
            },
            {
              href: '/admin/showtimes',
              icon: <Calendar className="h-16 w-16 mx-auto mb-4 text-red-400 group-hover:scale-110 transition" />,
              title: 'Manage Showtimes',
              desc: 'Create and manage movie showtimes',
            },
            {
              href: '/admin/bookings',
              icon: <Ticket className="h-16 w-16 mx-auto mb-4 text-red-400 group-hover:scale-110 transition" />,
              title: 'View Bookings',
              desc: 'Monitor and manage all bookings',
            },
          ].map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="group backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/10 hover:border-red-500/40 shadow-lg hover:shadow-red-900/30 transition transform hover:scale-105 text-center"
            >
              {action.icon}
              <h3 className="text-2xl font-semibold text-red-400 mb-2">{action.title}</h3>
              <p className="text-gray-300">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
