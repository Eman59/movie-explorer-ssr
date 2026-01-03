'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MovieSearchResult } from '@/types/tmdb';
import { useSearchParams } from 'next/navigation';

interface MovieCardProps {
  movie: MovieSearchResult;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const searchParams = useSearchParams();
  const currentUrl = searchParams?.toString() ? `/?${searchParams.toString()}` : '/';
  
  return (
    <Link href={`/movie/${movie.id}?from=${encodeURIComponent(currentUrl)}`} className="block group">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 border border-gray-700/50 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10">
        <div className="aspect-[16/9] relative bg-gray-900">
          {movie.poster_url ? (
            <Image
              src={movie.poster_url}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-sm font-bold text-white">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white group-hover:text-red-400 transition-colors leading-tight">{movie.title}</h3>
          <div className="flex items-center gap-3 text-gray-400 text-sm mb-3">
            <span className="font-medium">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{movie.overview}</p>
        </div>
      </div>
    </Link>
  );
}