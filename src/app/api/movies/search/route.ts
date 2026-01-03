import { NextRequest, NextResponse } from 'next/server';
import { getConfiguration, searchMovies } from '@/lib/tmdb';
import { transformMovieForSearch, validateSearchQuery, validatePage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = validateSearchQuery(searchParams.get('q'));
    const page = validatePage(searchParams.get('page'));

    // Ensure configuration is loaded for image URLs
    await getConfiguration();

    const tmdbResponse = await searchMovies(query, page);
    
    const response = {
      page: tmdbResponse.page,
      total_pages: tmdbResponse.total_pages,
      total_results: tmdbResponse.total_results,
      results: tmdbResponse.results.map(transformMovieForSearch),
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('Query')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}