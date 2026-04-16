import Link from 'next/link';
import { ArrowRight, Film, ShieldCheck, Ticket } from 'lucide-react';

export default function Home() {
  return (
    <div className="page-shell relative flex min-h-screen items-center justify-center px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <section className="glass-panel rounded-3xl p-8 sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-200">
            <Film className="h-4 w-4" />
            One Place For Movie Nights
          </div>

          <h1 className="theme-heading text-5xl font-bold leading-tight sm:text-6xl">
            Book Faster.
            <br />
            Watch Sooner.
          </h1>

          <p className="theme-subtext mt-5 max-w-2xl text-lg">
            CineMax keeps ticket booking simple: choose a movie, pick your showtime, lock seats, and pay securely in minutes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="cta-primary gap-2">
              Start Booking
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="cta-secondary">
              Browse Movies
            </Link>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
            <p className="glass-card rounded-xl px-4 py-3">Live showtimes and seats</p>
            <p className="glass-card rounded-xl px-4 py-3">Fast, secure checkout</p>
            <p className="glass-card rounded-xl px-4 py-3">Mobile-first booking flow</p>
          </div>
        </section>

        <aside className="glass-panel rounded-3xl p-8">
          <h2 className="mb-4 text-3xl font-bold theme-gradient-text">Why CineMax</h2>
          <ul className="space-y-4 text-zinc-300">
            <li className="glass-card rounded-xl p-4">
              <div className="mb-1 flex items-center gap-2 font-semibold text-red-200">
                <Ticket className="h-4 w-4" />
                Clear Booking Experience
              </div>
              <p>No clutter. Just movie, theatre, time, and seats.</p>
            </li>
            <li className="glass-card rounded-xl p-4">
              <div className="mb-1 flex items-center gap-2 font-semibold text-red-200">
                <ShieldCheck className="h-4 w-4" />
                Reliable Payments
              </div>
              <p>Secure checkout with instant booking confirmation.</p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
