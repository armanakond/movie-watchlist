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

async function getMultiplePages(url: string, pages: number) {
  const requests = Array.from({ length: pages }, (_, i) =>
    fetch(`${url}&page=${i + 1}`).then((res) => res.json())
  )
  const results = await Promise.all(requests)
  const allMovies = results.flatMap((r) => r.results)

  // dedupe by id
  const seen = new Set<number>()
  return allMovies.filter((movie) => {
    if (seen.has(movie.id)) return false
    seen.add(movie.id)
    return true
  })
}

export async function getTrending() {
  return getMultiplePages(
    `${TMDB_BASE}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`,
    3
  )
}

export async function getTopRated() {
  return getMultiplePages(
    `${TMDB_BASE}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`,
    3
  )
}

export async function getUpcoming() {
  return getMultiplePages(
    `${TMDB_BASE}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`,
    3
  )
}

export async function getFamilyMovies() {
  return getMultiplePages(
    `${TMDB_BASE}/discover/movie?with_genres=10751&api_key=${process.env.TMDB_API_KEY}`,
    3
  )
}