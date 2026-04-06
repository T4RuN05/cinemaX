import Link from 'next/link'
import { Film, Ticket, Clock, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-r from-gray-950 via-black to-gray-900 text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.25),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,50,50,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(200,0,0,0.1),transparent_40%)]"></div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="flex justify-center mb-6">
          <Film className="h-24 w-24 text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]" />
        </div>

        <h1 className="text-7xl font-extrabold mb-6 leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-pink-500 to-red-700">CineMax</span>
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Discover the ultimate movie booking experience with stunning visuals, real-time seat availability, and a seamless payment experience.
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
          <Link
            href="/sign-up"
            className="px-10 py-4 bg-linear-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/30 transition-all transform hover:scale-105 backdrop-blur-md"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="px-10 py-4 bg-transparent border-2 border-white/60 hover:bg-white hover:text-gray-900 font-semibold rounded-xl backdrop-blur-sm transition-all"
          >
            Browse Movies
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-20 container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 bg-linear-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
          Why Choose CineMax?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-red-400/40 shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Ticket className="h-14 w-14 text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.4)]" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Easy Booking</h3>
            <p className="text-gray-300 leading-relaxed">
              Book your tickets effortlessly with our intuitive interface. Pick your favorite movie, choose seats, and confirm in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-red-400/40 shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Clock className="h-14 w-14 text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.4)]" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Real-Time Updates</h3>
            <p className="text-gray-300 leading-relaxed">
              Stay updated with live showtimes and seat availability. No surprises — see everything in real time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-red-400/40 shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Shield className="h-14 w-14 text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.4)]" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Secure Payments</h3>
            <p className="text-gray-300 leading-relaxed">
              All transactions are encrypted and verified. Your data is protected with bank-grade security for complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="relative p-12 rounded-3xl overflow-hidden bg-linear-to-r from-red-600 via-pink-600 to-red-800 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)]"></div>

            <div className="relative text-center">
              <h2 className="text-5xl font-extrabold mb-4 text-white">Experience Cinema Like Never Before</h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of CineMax users today and discover a new way to enjoy your favorite films.
              </p>

              <Link
                href="/sign-up"
                className="inline-block px-10 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-100 shadow-lg transition transform hover:scale-105"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative bg-black/90 border-t border-white/10 backdrop-blur-xl text-gray-400 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm mb-2">&copy; 2025 CineMax. All Rights Reserved.</p>
          <p className="text-xs text-gray-500">Built with Next.js, MongoDB, Tailwind CSS & Clerk Authentication</p>
        </div>
      </footer>
    </div>
  )
}
