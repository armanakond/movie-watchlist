'use client'

import { useState } from 'react'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  async function addToWatchlist(movieId: number) {
    await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdb_movie_id: movieId, status: 'want_to_watch' }),
    })
    alert('Added to watchlist')
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="flex-1 rounded bg-zinc-800 p-2"
        />
        <button type="submit" className="rounded bg-red-600 px-4 py-2 font-medium">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {results.map((movie) => (
          <div key={movie.id} className="space-y-2">
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
            <button
              onClick={() => addToWatchlist(movie.id)}
              className="w-full rounded bg-zinc-800 py-1 text-xs hover:bg-zinc-700"
            >
              + Add to watchlist
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}