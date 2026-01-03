import { TMDBMovie, TMDBMovieDetails, MovieSearchResult, MovieDetails } from '@/types/tmdb';
import { buildImageUrl } from './tmdb';

export function transformMovieForSearch(movie: TMDBMovie): MovieSearchResult {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    overview: movie.overview,
    poster_url: buildImageUrl(movie.poster_path),
    vote_average: movie.vote_average,
  };
}

export function transformMovieDetails(movie: TMDBMovieDetails): MovieDetails {
  const youtubeTrailers = movie.videos.results
    .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
    .slice(0, 3);

  const topCast = movie.credits.cast.slice(0, 5).map(actor => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profile_url: buildImageUrl(actor.profile_path, 'w185'),
  }));

  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    overview: movie.overview,
    poster_url: buildImageUrl(movie.poster_path),
    backdrop_url: buildImageUrl(movie.backdrop_path, 'w1280'),
    vote_average: movie.vote_average,
    runtime: movie.runtime,
    genres: movie.genres.map(g => g.name),
    cast: topCast,
    trailers: youtubeTrailers,
  };
}

export function validateSearchQuery(query: string | null): string {
  if (!query || typeof query !== 'string') {
    throw new Error('Query parameter is required');
  }
  
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    throw new Error('Query parameter is required');
  }
  
  if (trimmed.length < 2) {
    throw new Error('Query must be at least 2 characters long');
  }
  
  return trimmed;
}

export function validatePage(page: string | null): number {
  const pageNum = page ? parseInt(page, 10) : 1;
  if (isNaN(pageNum) || pageNum < 1) {
    return 1;
  }
  return pageNum;
}