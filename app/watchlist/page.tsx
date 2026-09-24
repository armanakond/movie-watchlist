'use client'

import { useEffect, useState } from 'react'

interface WatchlistItem {
  id: string
  tmdb_movie_id: number
  status: string
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [movieDetails, setMovieDetails] = useState<Record<number, any>>({})

  useEffect(() => {
    fetchWatchlist()
  }, [])

  async function fetchWatchlist() {
    const res = await fetch('/api/watchlist')
    const data = await res.json()
    setItems(data)

    // fetch poster/title for each movie from TMDB via our own proxy could go here
    // for now, keeping it simple — you'll likely want a /api/movie/[id] route later
  }

  async function removeItem(id: string) {
    await fetch(`/api/watchlist/${id}`, { method: 'DELETE' })
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <h1 className="mb-6 text-2xl font-semibold">My Watchlist</h1>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded bg-zinc-800 p-3"
          >
            <span>Movie ID: {item.tmdb_movie_id} — {item.status}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}