import { render, screen } from '@testing-library/react';
import MovieCard from '@/components/MovieCard';
import { MovieSearchResult } from '@/types/tmdb';

// Mock Next.js modules
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    toString: () => '',
  }),
}));

describe('MovieCard Component', () => {
  const mockMovie: MovieSearchResult = {
    id: 123,
    title: 'Test Movie',
    release_date: '2023-06-15',
    overview: 'This is a test movie overview',
    poster_url: 'https://example.com/poster.jpg',
    vote_average: 7.5,
  };

  it('should render movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('7.5')).toBeInTheDocument();
    expect(screen.getByText('This is a test movie overview')).toBeInTheDocument();
  });

  it('should handle null poster_url', () => {
    const movieWithoutPoster: MovieSearchResult = {
      ...mockMovie,
      poster_url: null,
    };

    render(<MovieCard movie={movieWithoutPoster} />);
    const card = screen.getByRole('link');
    expect(card).toBeInTheDocument();
  });

  it('should render "N/A" when release_date is empty', () => {
    const movieWithoutDate: MovieSearchResult = {
      ...mockMovie,
      release_date: '',
    };

    render(<MovieCard movie={movieWithoutDate} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should link to the correct movie detail page', () => {
    render(<MovieCard movie={mockMovie} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/123?from=%2F');
  });
});