import { validateSearchQuery, validatePage } from '@/lib/utils';

describe('API Validation', () => {
  describe('Search Query Validation', () => {
    it('should validate correct search queries', () => {
      expect(validateSearchQuery('batman')).toBe('batman');
      expect(validateSearchQuery('  superman  ')).toBe('superman');
      expect(validateSearchQuery('the dark knight')).toBe('the dark knight');
    });

    it('should reject invalid search queries', () => {
      expect(() => validateSearchQuery(null)).toThrow('Query parameter is required');
      expect(() => validateSearchQuery('')).toThrow('Query parameter is required');
      expect(() => validateSearchQuery('a')).toThrow('Query must be at least 2 characters long');
      expect(() => validateSearchQuery('  ')).toThrow('Query parameter is required');
    });
  });

  describe('Page Validation', () => {
    it('should validate correct page numbers', () => {
      expect(validatePage('1')).toBe(1);
      expect(validatePage('10')).toBe(10);
      expect(validatePage('999')).toBe(999);
    });

    it('should handle invalid page numbers', () => {
      expect(validatePage(null)).toBe(1);
      expect(validatePage('0')).toBe(1);
      expect(validatePage('-5')).toBe(1);
      expect(validatePage('abc')).toBe(1);
      expect(validatePage('1.5')).toBe(1);
    });
  });
});