import { Suspense } from 'react';
import SearchForm from '@/components/SearchForm';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { MovieSearchResponse } from '@/types/tmdb';
import { getConfiguration, searchMovies } from '@/lib/tmdb';
import { transformMovieForSearch } from '@/lib/utils';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

async function fetchMovies(query: string, page: number): Promise<MovieSearchResponse> {
  await getConfiguration();
  const tmdbResponse = await searchMovies(query, page);
  
  return {
    page: tmdbResponse.page,
    total_pages: tmdbResponse.total_pages,
    total_results: tmdbResponse.total_results,
    results: tmdbResponse.results.map(transformMovieForSearch),
  };
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 animate-pulse">
          <div className="aspect-[16/9] bg-gray-700"></div>
          <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-20">
      <div className="inline-block p-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 mb-6">
        <svg className="w-20 h-20 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">No movies found</h2>
      <p className="text-gray-400 text-lg">
        No results for <span className="text-red-400 font-semibold">"{query}"</span>. Try different keywords.
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-20">
      <div className="inline-block p-6 bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-500/50 mb-6">
        <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-red-400 mb-3">Error</h2>
      <p className="text-gray-300 text-lg">{error}</p>
    </div>
  );
}

async function MovieResults({ query, page }: { query: string; page: number }) {
  try {
    const data = await fetchMovies(query, page);

    if (data.results.length === 0) {
      return <EmptyState query={query} />;
    }

    return (
      <>
        <div className="mb-6">
          <p className="text-gray-400 text-lg">
            Found <span className="text-white font-semibold">{data.total_results.toLocaleString()}</span> results for <span className="text-red-400 font-semibold">"{query}"</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {data.total_pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            query={query}
          />
        )}
      </>
    );
  } catch (error) {
    return <ErrorState error={error instanceof Error ? error.message : 'An error occurred'} />;
  }
}

export default async function HomePage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim();
  const page = parseInt(params.page || '1', 10);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
            Movie Explorer
          </h1>
          <p className="text-gray-400 text-lg">Discover your next favorite movie</p>
        </div>
        
        <SearchForm />

        {query && query.length >= 2 ? (
          <Suspense fallback={<LoadingState />}>
            <MovieResults query={query} page={page} />
          </Suspense>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 mb-6">
              <svg className="w-24 h-24 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to Movie Explorer</h2>
            <p className="text-gray-400 text-lg">Search for your favorite movies using the search bar above</p>
          </div>
        )}
      </div>
    </div>
  );
}