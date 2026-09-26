'use client'

import { useEffect, useState } from 'react'

interface WatchlistItem {
  id: string
  tmdb_movie_id: number
  status: string
}

interface MovieDetails {
  id: number
  title: string
  poster_path: string | null
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [movieDetails, setMovieDetails] = useState<Record<number, MovieDetails>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  async function fetchWatchlist() {
    const res = await fetch('/api/watchlist')
    const data: WatchlistItem[] = await res.json()
    console.log('Watchlist response:', data)
    setItems(data)

    // fetch movie details for each item, in parallel
    const detailsEntries = await Promise.all(
      data.map(async (item) => {
        const res = await fetch(`/api/movie/${item.tmdb_movie_id}`)
        const movie = await res.json()
        return [item.tmdb_movie_id, movie] as const
      })
    )

    setMovieDetails(Object.fromEntries(detailsEntries))
    setLoading(false)
  }

  async function removeItem(id: string) {
    await fetch(`/api/watchlist/${id}`, { method: 'DELETE' })
    setItems(items.filter((item) => item.id !== id))
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 p-8 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <h1 className="mb-6 text-2xl font-semibold">My Watchlist</h1>

      {items.length === 0 && (
        <p className="text-zinc-400">Nothing here yet — go search for something.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => {
          const movie = movieDetails[item.tmdb_movie_id]
          if (!movie) return null

          return (
            <div key={item.id} className="space-y-2">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : '/no-poster.png'
                }
                alt={movie.title}
                className="w-full rounded"
              />
              <p className="text-sm font-medium">{movie.title}</p>
              <p className="text-xs text-zinc-400">{item.status}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="w-full rounded bg-zinc-800 py-1 text-xs hover:bg-zinc-700"
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}