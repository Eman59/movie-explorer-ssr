import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MovieDetails } from '@/types/tmdb';
import { getConfiguration, getMovieDetails } from '@/lib/tmdb';
import { transformMovieDetails } from '@/lib/utils';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const movieId = parseInt(id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }

  try {
    await getConfiguration();
    const movieDetails = await getMovieDetails(movieId);
    return transformMovieDetails(movieDetails);
  } catch (error) {
    if (error instanceof Error && error.message === 'MOVIE_NOT_FOUND') {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const movie = await fetchMovieDetails(id);
    
    return {
      title: `${movie.title} (${new Date(movie.release_date).getFullYear()}) - Movie Explorer`,
      description: movie.overview,
    };
  } catch {
    return {
      title: 'Movie Not Found - Movie Explorer',
      description: 'The requested movie could not be found.',
    };
  }
}

export default async function MoviePage({ params, searchParams }: MoviePageProps & { searchParams: Promise<{ from?: string }> }) {
  const { id } = await params;
  const search = await searchParams;
  const movie = await fetchMovieDetails(id);
  const backUrl = search.from || '/';

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop */}
      {movie.backdrop_url && (
        <div className="relative h-[60vh] w-full">
          <Image
            src={movie.backdrop_url}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative" style={{ marginTop: movie.backdrop_url ? '-20rem' : '0' }}>
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-black mb-4 text-white">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-300 text-lg mb-6">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-xl border border-yellow-500/30">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-2xl font-bold text-yellow-400">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-gray-300 rounded-xl text-sm font-medium border border-gray-700"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-4 text-white">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>
            </div>

            {/* Cast */}
            {movie.cast.length > 0 && (
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-6 text-white">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {movie.cast.map((actor) => (
                    <div key={actor.id} className="text-center group">
                      <div className="aspect-square relative bg-gray-800 rounded-xl overflow-hidden mb-3 border border-gray-700 group-hover:border-red-500 transition-all">
                        {actor.profile_url ? (
                          <Image
                            src={actor.profile_url}
                            alt={actor.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-sm text-white mb-1">{actor.name}</p>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailers */}
            {movie.trailers.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Trailers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.trailers.map((trailer) => (
                    <div key={trailer.key} className="aspect-video rounded-xl overflow-hidden border border-gray-700">
                      <iframe
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title={`${movie.title} - ${trailer.type}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}