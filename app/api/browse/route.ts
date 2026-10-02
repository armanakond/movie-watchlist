import { getTrending, getTopRated, getUpcoming, getFamilyMovies } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET() {
  const [trending, topRated, upcoming, family] = await Promise.all([
    getTrending(),
    getTopRated(),
    getUpcoming(),
    getFamilyMovies(),
  ])

  return NextResponse.json({ trending, topRated, upcoming, family })
}