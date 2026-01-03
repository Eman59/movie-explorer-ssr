import { NextRequest, NextResponse } from 'next/server';
import { getConfiguration, getMovieDetails } from '@/lib/tmdb';
import { transformMovieDetails } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id, 10);
    
    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    // Ensure configuration is loaded for image URLs
    await getConfiguration();

    const movieDetails = await getMovieDetails(movieId);
    const response = transformMovieDetails(movieDetails);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'MOVIE_NOT_FOUND') {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}