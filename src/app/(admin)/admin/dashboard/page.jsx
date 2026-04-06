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
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 to-black text-white">
        <div className="text-xl animate-pulse">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-linear-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Manage theatres, screens, showtimes & bookings
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: 'Theatres',
              value: stats.totalTheatres,
              icon: <Building2 className="h-10 w-10 text-blue-300" />,
              color: 'from-blue-500/20 to-blue-900/40',
            },
            {
              title: 'Screens',
              value: stats.totalScreens,
              icon: <Film className="h-10 w-10 text-green-300" />,
              color: 'from-green-500/20 to-green-900/40',
            },
            {
              title: 'Active Showtimes',
              value: stats.totalShowtimes,
              icon: <Calendar className="h-10 w-10 text-purple-300" />,
              color: 'from-purple-500/20 to-purple-900/40',
            },
            {
              title: 'Total Bookings',
              value: stats.totalBookings,
              icon: <Ticket className="h-10 w-10 text-red-300" />,
              color: 'from-red-500/20 to-red-900/40',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl backdrop-blur-xl bg-linear-to-br ${stat.color} border border-white/10 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm mb-1">{stat.title}</p>
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
              icon: <Building2 className="h-14 w-14 mx-auto mb-4 text-blue-400" />,
              title: 'Manage Theatres',
              desc: 'Add, edit, or remove theatres and screens',
              color: 'from-blue-600/20 to-blue-900/40',
            },
            {
              href: '/admin/showtimes',
              icon: <Calendar className="h-14 w-14 mx-auto mb-4 text-purple-400" />,
              title: 'Manage Showtimes',
              desc: 'Create and manage movie showtimes',
              color: 'from-purple-600/20 to-purple-900/40',
            },
            {
              href: '/admin/bookings',
              icon: <Ticket className="h-14 w-14 mx-auto mb-4 text-red-400" />,
              title: 'View Bookings',
              desc: 'Monitor and manage all bookings',
              color: 'from-red-600/20 to-red-900/40',
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`rounded-2xl p-8 text-center backdrop-blur-xl bg-linear-to-br ${item.color} border border-white/10 hover:border-white/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group`}
            >
              <div className="group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-2 mt-2 text-white">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
