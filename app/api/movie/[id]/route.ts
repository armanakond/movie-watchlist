import { getMovieDetails } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const movie = await getMovieDetails(id)
    return NextResponse.json(movie)
  } catch (error) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
  }
}