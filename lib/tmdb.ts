const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function searchMovies(query: string) {
  const res = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&api_key=${process.env.TMDB_API_KEY}`
  )
  if (!res.ok) throw new Error('TMDB search failed')
  const data = await res.json()
  return data.results
}

export async function getMovieDetails(id: string) {
  const res = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${process.env.TMDB_API_KEY}`)
  if (!res.ok) throw new Error('TMDB details fetch failed')
  return res.json()
}

export function posterUrl(path: string | null, size: 'w200' | 'w500' = 'w200') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/no-poster.png'
}