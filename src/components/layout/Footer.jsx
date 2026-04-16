import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/35 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-zinc-300 sm:flex-row sm:px-6 sm:text-left">
        <p>
          &copy; {new Date().getFullYear()} CineMax. Crafted by Tarun, Asmit and Rashi.
        </p>

        <div className="flex items-center gap-4">
          <Link className="transition hover:text-red-300" href="/dashboard">
            Movies
          </Link>
          <Link className="transition hover:text-red-300" href="/my-bookings">
            Bookings
          </Link>
        </div>
      </div>
    </footer>
  );
}