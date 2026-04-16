'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Film, Building2, Calendar, Ticket, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = isSignedIn
    ? isAdmin
      ? [
          { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/admin/theatres', label: 'Theatres', icon: Building2 },
          { href: '/admin/showtimes', label: 'Showtimes', icon: Calendar },
          { href: '/admin/bookings', label: 'Bookings', icon: Ticket },
        ]
      : [
          { href: '/dashboard', label: 'Movies', icon: Film },
          { href: '/my-bookings', label: 'My Bookings', icon: Ticket },
        ]
    : [{ href: '/dashboard', label: 'Browse', icon: Film }];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 text-white backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-18 items-center justify-between gap-3 py-2">
          <Link href="/" className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-white/5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-500/20 ring-1 ring-red-300/30">
              <Film className="h-5 w-5 text-red-300 transition group-hover:scale-110" />
            </span>
            <span className="text-2xl font-bold theme-gradient-text">CineMax</span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-red-500/20 text-red-200 ring-1 ring-red-300/35'
                      : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <span className="rounded-full border border-red-300/35 bg-red-500/20 px-3 py-1 text-[11px] font-bold tracking-wider text-red-200">
                    ADMIN
                  </span>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-10 w-10 ring-2 ring-red-300/30',
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="cta-secondary px-4 py-2 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="cta-primary px-4 py-2 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-red-500/20 text-red-200 ring-1 ring-red-300/35'
                    : 'bg-white/5 text-zinc-200 hover:bg-white/10'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}