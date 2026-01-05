import { validateSearchQuery, validatePage, transformMovieForSearch } from '../src/lib/utils';
import { TMDBMovie } from '../src/types/tmdb';

// Mock the buildImageUrl function
jest.mock('@/lib/tmdb', () => ({
  buildImageUrl: jest.fn((path: string | null) => 
    path ? `https://image.tmdb.org/t/p/w500${path}` : null
  )
}));

describe('Utility Functions', () => {
  describe('validateSearchQuery', () => {
    it('should return trimmed query for valid input', () => {
      expect(validateSearchQuery('  batman  ')).toBe('batman');
      expect(validateSearchQuery('superman')).toBe('superman');
    });

    it('should throw error for invalid queries', () => {
      expect(() => validateSearchQuery(null)).toThrow('Query parameter is required');
      expect(() => validateSearchQuery('')).toThrow('Query parameter is required');
      expect(() => validateSearchQuery('a')).toThrow('Query must be at least 2 characters long');
      expect(() => validateSearchQuery('  a  ')).toThrow('Query must be at least 2 characters long');
    });
  });

  describe('validatePage', () => {
    it('should return valid page numbers', () => {
      expect(validatePage('1')).toBe(1);
      expect(validatePage('5')).toBe(5);
      expect(validatePage('100')).toBe(100);
    });

    it('should return 1 for invalid inputs', () => {
      expect(validatePage(null)).toBe(1);
      expect(validatePage('0')).toBe(1);
      expect(validatePage('-1')).toBe(1);
      expect(validatePage('abc')).toBe(1);
      expect(validatePage('')).toBe(1);
    });
  });

  describe('transformMovieForSearch', () => {
    it('should transform TMDB movie to search result format', () => {
      const tmdbMovie: TMDBMovie = {
        id: 123,
        title: 'Test Movie',
        release_date: '2023-01-01',
        overview: 'Test overview',
        poster_path: '/test.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 7.5
      };

      const result = transformMovieForSearch(tmdbMovie);

      expect(result).toEqual({
        id: 123,
        title: 'Test Movie',
        release_date: '2023-01-01',
        overview: 'Test overview',
        poster_url: 'https://image.tmdb.org/t/p/w500/test.jpg',
        vote_average: 7.5
      });
    });

    it('should handle null poster path', () => {
      const tmdbMovie: TMDBMovie = {
        id: 123,
        title: 'Test Movie',
        release_date: '2023-01-01',
        overview: 'Test overview',
        poster_path: null,
        backdrop_path: null,
        vote_average: 7.5
      };

      const result = transformMovieForSearch(tmdbMovie);

      expect(result.poster_url).toBeNull();
    });
  });
});