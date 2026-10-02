'use client'

import { useEffect, useRef, useState } from 'react'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  popularity: number
}

interface BrowseData {
  trending: Movie[]
  topRated: Movie[]
  upcoming: Movie[]
  family: Movie[]
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[] | null>(null)
  const [browse, setBrowse] = useState<BrowseData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/browse')
      .then((res) => res.json())
      .then(setBrowse)
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    if (!query.trim()) {
      setResults(null)
      return
    }

    setLoading(true)

    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}`
    )

    const data = await res.json()

    setResults(data)
    setLoading(false)
  }

  async function addToWatchlist(movieId: number) {
    await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tmdb_movie_id: movieId,
        status: 'plan_to_watch',
      }),
    })

    alert('Added to watchlist')
  }

  function MovieRow({
    title,
    movies,
  }: {
    title: string
    movies: Movie[]
  }) {
    const scrollRef = useRef<HTMLDivElement>(null)

    function scroll(direction: 'left' | 'right') {
      if (!scrollRef.current) return

      const amount = direction === 'left' ? -400 : 400

      scrollRef.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      })
    }

    return (
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">{title}</h2>

        <div className="group relative">
          {/* Left button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-r from-zinc-950 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          >
            <span className="text-2xl">‹</span>
          </button>

          {/* Movies */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]"
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="w-32 flex-shrink-0 space-y-1"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : '/no-poster.png'
                  }
                  alt={movie.title}
                  draggable={false}
                  className="w-full rounded"
                />

                <p className="truncate text-xs font-medium">
                  {movie.title}
                </p>

                <p className="text-xs text-zinc-400">
                  ★ {movie.vote_average?.toFixed(1) ?? 'N/A'}
                </p>

                <button
                  onClick={() => addToWatchlist(movie.id)}
                  className="w-full rounded bg-zinc-800 py-1 text-xs hover:bg-zinc-700"
                >
                  + Add
                </button>
              </div >
            ))}
          </div >

          {/* Right button */}
          < button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-l from-zinc-950 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          >
            <span className="text-2xl">›</span>
          </button >
        </div >
      </div >
    )
  }

  return (
    <div className="p-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="flex-1 rounded bg-zinc-900 px-4 py-2 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-zinc-800 px-5 py-2 hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Search results */}
      {results && (
        <MovieRow title="Search Results" movies={results} />
      )}

      {/* Browse mode */}
      {!results && browse && (
        <>
          <MovieRow
            title="Trending Now"
            movies={browse.trending}
          />

          <MovieRow
            title="Top Rated"
            movies={browse.topRated}
          />

          <MovieRow
            title="Up and Coming"
            movies={browse.upcoming}
          />

          <MovieRow
            title="Fun with Family"
            movies={browse.family}
          />
        </>
      )}
    </div>
  )
}

