'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, PlayCircle } from 'lucide-react';

export default function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.png';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.year || 'N/A';

  const rating =
    movie.vote_average && typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : movie.vote_average || 'N/A';

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/movies/${movie.id}`} className="block h-full">
        {/* Movie Poster */}
        <figure className="relative h-100 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Hover Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <PlayCircle className="text-white h-14 w-14 drop-shadow-lg hover:scale-110 transition-transform" />
          </div>
        </figure>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="mb-1 truncate text-lg font-bold text-zinc-100">
            {movie.title}
          </h3>
          <p className="mb-2 truncate text-sm italic text-zinc-400">
            {movie.genre || 'Action, Adventure'}
          </p>

          <div className="flex items-center justify-between text-sm text-zinc-300">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-red-300 mr-1" />
              <span>{rating}</span>
            </div>
            {releaseYear !== 'N/A' && (
              <span className="font-medium text-zinc-300">{releaseYear}</span>
            )}
          </div>

          <button
            className="cta-primary mt-4 w-full py-2.5 text-sm"
            aria-label={`Book tickets for ${movie.title}`}
          >
            Book Tickets
          </button>
        </div>
      </Link>
    </article>
  );
}
