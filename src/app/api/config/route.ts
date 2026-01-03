import { NextResponse } from 'next/server';
import { getConfiguration } from '@/lib/tmdb';

export async function GET() {
  try {
    const config = await getConfiguration();
    
    // Return only what the UI needs
    const response = {
      images: {
        secure_base_url: config.images.secure_base_url,
        poster_sizes: config.images.poster_sizes,
        backdrop_sizes: config.images.backdrop_sizes,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}