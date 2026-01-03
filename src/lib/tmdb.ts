import { TMDBConfiguration, TMDBMovieDetails, TMDBSearchResponse } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

if (!TMDB_TOKEN) {
  throw new Error('TMDB_READ_ACCESS_TOKEN is required');
}

const headers = {
  'Authorization': `Bearer ${TMDB_TOKEN}`,
  'Content-Type': 'application/json',
};

let configCache: TMDBConfiguration | null = null;
let configCacheTime = 0;
const CONFIG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getConfiguration(): Promise<TMDBConfiguration> {
  const now = Date.now();
  
  if (configCache && (now - configCacheTime) < CONFIG_CACHE_DURATION) {
    return configCache;
  }

  const response = await fetch(`${TMDB_BASE_URL}/configuration`, {
    headers,
    next: { revalidate: 86400 } // 24 hours
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  configCache = await response.json();
  configCacheTime = now;
  return configCache!;
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    include_adult: 'false',
    language: 'en-US'
  });

  const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
    headers,
    next: { revalidate: 60 }
  });

  if (response.status === 429) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetails> {
  const params = new URLSearchParams({
    append_to_response: 'videos,credits'
  });

  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?${params}`, {
    headers,
    next: { revalidate: 60 }
  });

  if (response.status === 404) {
    throw new Error('MOVIE_NOT_FOUND');
  }

  if (response.status === 429) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export function buildImageUrl(path: string | null, size: string = 'w500'): string | null {
  if (!path || !configCache) return null;
  return `${configCache.images.secure_base_url}${size}${path}`;
}