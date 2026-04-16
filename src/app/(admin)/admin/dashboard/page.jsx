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
    totalShowtimes: 5,
    totalBookings: 24,
  });

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center text-white">
        <div className="glass-panel rounded-2xl px-8 py-6 text-xl font-semibold">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="glass-panel mb-10 rounded-3xl px-6 py-8 text-center sm:px-8">
          <h1 className="text-5xl font-bold theme-gradient-text">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-zinc-300">
            Manage theatres, screens, showtimes & bookings
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Theatres',
              value: stats.totalTheatres,
              icon: <Building2 className="h-10 w-10 text-red-200" />,
              color: 'from-red-500/20 to-red-900/25',
            },
            {
              title: 'Screens',
              value: stats.totalScreens,
              icon: <Film className="h-10 w-10 text-red-200" />,
              color: 'from-red-500/15 to-red-900/20',
            },
            {
              title: 'Active Showtimes',
              value: stats.totalShowtimes,
              icon: <Calendar className="h-10 w-10 text-red-200" />,
              color: 'from-red-500/20 to-red-900/25',
            },
            {
              title: 'Total Bookings',
              value: stats.totalBookings,
              icon: <Ticket className="h-10 w-10 text-red-200" />,
              color: 'from-red-500/20 to-red-900/25',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`glass-panel rounded-2xl bg-linear-to-br p-6 transition-all duration-300 hover:-translate-y-0.5 ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-300">{stat.title}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="opacity-80">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              href: '/admin/theatres',
              icon: <Building2 className="mx-auto mb-4 h-14 w-14 text-red-300" />,
              title: 'Manage Theatres',
              desc: 'Add, edit, or remove theatres and screens',
              color: 'from-red-500/15 to-red-900/20',
            },
            {
              href: '/admin/showtimes',
              icon: <Calendar className="mx-auto mb-4 h-14 w-14 text-red-300" />,
              title: 'Manage Showtimes',
              desc: 'Create and manage movie showtimes',
              color: 'from-red-500/20 to-red-900/25',
            },
            {
              href: '/admin/bookings',
              icon: <Ticket className="mx-auto mb-4 h-14 w-14 text-red-300" />,
              title: 'View Bookings',
              desc: 'Monitor and manage all bookings',
              color: 'from-red-500/20 to-red-900/25',
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`glass-panel group rounded-2xl bg-linear-to-br p-8 text-center transition-all duration-300 hover:-translate-y-1 ${item.color}`}
            >
              <div className="transition-transform duration-300 group-hover:scale-105">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-2 mt-2 text-white">
                {item.title}
              </h3>
              <p className="text-zinc-300">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
