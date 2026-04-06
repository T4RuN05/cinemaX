'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Film, Search, Building2, Calendar, Ticket, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold">CineMax</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Admin Navigation */}
            {isSignedIn && isAdmin ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-2 hover:text-red-500 transition ${
                    isActive('/admin/dashboard') ? 'text-red-500 font-semibold' : ''
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/theatres"
                  className={`flex items-center gap-2 hover:text-red-500 transition ${
                    isActive('/admin/theatres') ? 'text-red-500 font-semibold' : ''
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Theatres
                </Link>
                <Link
                  href="/admin/showtimes"
                  className={`flex items-center gap-2 hover:text-red-500 transition ${
                    isActive('/admin/showtimes') ? 'text-red-500 font-semibold' : ''
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Showtimes
                </Link>
                <Link
                  href="/admin/bookings"
                  className={`flex items-center gap-2 hover:text-red-500 transition ${
                    isActive('/admin/bookings') ? 'text-red-500 font-semibold' : ''
                  }`}
                >
                  <Ticket className="h-4 w-4" />
                  Bookings
                </Link>
              </>
            ) : (
              <>
                {/* Customer Navigation - Only Dashboard and My Bookings */}
                {isSignedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`hover:text-red-500 transition ${
                        isActive('/dashboard') ? 'text-red-500 font-semibold' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/my-bookings"
                      className={`hover:text-red-500 transition ${
                        isActive('/my-bookings') ? 'text-red-500 font-semibold' : ''
                      }`}
                    >
                      My Bookings
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/movies"
                    className={`hover:text-red-500 transition ${
                      isActive('/movies') ? 'text-red-500 font-semibold' : ''
                    }`}
                  >
                    Browse Movies
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-full transition">
              <Search className="h-5 w-5" />
            </button>
            
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    ADMIN
                  </span>
                )}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 hover:bg-gray-800 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}