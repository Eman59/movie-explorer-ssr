export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface TMDBSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TMDBMovie[];
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
}

export interface TMDBConfiguration {
  images: {
    secure_base_url: string;
    poster_sizes: string[];
    backdrop_sizes: string[];
  };
}

export interface MovieSearchResult {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string | null;
  vote_average: number;
}

export interface MovieSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieSearchResult[];
}

export interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string | null;
  backdrop_url: string | null;
  vote_average: number;
  runtime: number;
  genres: string[];
  cast: {
    id: number;
    name: string;
    character: string;
    profile_url: string | null;
  }[];
  trailers: {
    key: string;
    site: string;
    type: string;
  }[];
}