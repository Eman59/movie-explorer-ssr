# TMDB Movie Explorer

A Next.js application for exploring movies using The Movie Database (TMDB) API. Built with App Router, server-side rendering, and TypeScript.

## Features

- **Server-side rendered** movie search and detail pages
- **Movie search** with pagination
- **Movie details** with cast, trailers, and ratings
- **Rate limiting** and error handling
- **Responsive design** with Tailwind CSS
- **Caching strategy** for optimal performance

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- TMDB API
- Jest for testing

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- TMDB API account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local
```

4. Add your TMDB API token to `.env.local`:
```
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
```

### Getting TMDB API Token

1. Create account at [https://www.themoviedb.org](https://www.themoviedb.org)
2. Go to Account Settings → API
3. Request API access (free)
4. Copy your API Read Access Token (v4)

### Running the Application

Development:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm run start
```

Type checking:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

Testing:
```bash
npm test
```

Run tests:
```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── config/
│   │   └── movies/
│   ├── movie/[id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── types/
└── __tests__/
```