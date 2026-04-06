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
    <article className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 group cursor-pointer">
      <Link href={`/movies/${movie.id}`} className="block h-full">
        {/* Movie Poster */}
        <figure className="relative h-[400px] w-full overflow-hidden">
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
        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2 truncate italic">
            {movie.genre || 'Action, Adventure'}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{rating}</span>
            </div>
            {releaseYear !== 'N/A' && (
              <span className="font-medium text-gray-700">{releaseYear}</span>
            )}
          </div>

          <button
            className="w-full mt-4 bg-red-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-600 active:scale-[0.98] transition-all"
            aria-label={`Book tickets for ${movie.title}`}
          >
            Book Tickets
          </button>
        </div>
      </Link>
    </article>
  );
}
