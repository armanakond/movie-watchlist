import { searchMovies } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const results = await searchMovies(query)
  return NextResponse.json(results)
}