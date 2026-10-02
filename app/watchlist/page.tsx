'use client'

import { useEffect, useState } from 'react'

interface WatchlistItem {
  id: string
  tmdb_movie_id: number
  status: string
  rating: number | null
}

interface MovieDetails {
  id: number
  title: string
  poster_path: string | null
}

const STATUS_OPTIONS = [
  { value: 'plan_to_watch', label: 'Plan to Watch' },
  { value: 'currently_watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
]

const STATUS_COLORS: Record<string, string> = {
  plan_to_watch: 'bg-panel text-dim border border-dim/30',
  currently_watching: 'bg-magenta/20 text-magenta border border-magenta/40',
  completed: 'bg-gold/20 text-gold border border-gold/40',
}

const BORDER_COLORS: Record<string, string> = {
  plan_to_watch: 'border-dim/40',
  currently_watching: 'border-magenta',
  completed: 'border-gold',
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [movieDetails, setMovieDetails] = useState<Record<number, MovieDetails>>({})
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [localRating, setLocalRating] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchWatchlist()
  }, [])

  async function fetchWatchlist() {
    const res = await fetch('/api/watchlist')
    const data: WatchlistItem[] = await res.json()
    setItems(data)

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

  async function updateItem(id: string, changes: Partial<Pick<WatchlistItem, 'status' | 'rating'>>) {
    // Update local state immediately — optimistic
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    )

    const res = await fetch(`/api/watchlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    })

    if (!res.ok) {
      console.error('Failed to save update:', await res.json())
      // Optionally: re-fetch to resync if it actually failed
      fetchWatchlist()
    }
  }

  return (
    <div className="min-h-screen bg-void p-8 font-body text-ink">
      <h1 className="mb-8 font-display text-2xl font-800 tracking-wide text-gold">
        MY COLLECTION
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {STATUS_OPTIONS.map((column) => {
          const columnItems = items.filter((item) => item.status === column.value)

          return (
            <div key={column.value}>
              <div className="mb-4 flex items-center gap-2 border-b border-dim/20 pb-2">
                <h2 className="font-display text-sm font-600 uppercase tracking-wider text-dim">
                  {column.label}
                </h2>
                <span className="rounded-full bg-panel px-2 py-0.5 text-xs text-dim">
                  {columnItems.length}
                </span>
              </div>

              {columnItems.length === 0 && (
                <p className="text-sm text-dim/60">Nothing here yet.</p>
              )}

              <div className="space-y-4">
                {columnItems.map((item) => {
                  const movie = movieDetails[item.tmdb_movie_id]
                  if (!movie) return null
                  const sliderValue = localRating[item.id] ?? item.rating ?? 5.5

                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3 rounded-lg border-l-4 bg-panel p-3 ${BORDER_COLORS[item.status]}`}
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : '/no-poster.png'
                        }
                        alt={movie.title}
                        draggable={false}
                        className="h-24 w-16 flex-shrink-0 rounded object-cover"
                      />

                      <div className="flex flex-1 flex-col gap-2">
                        <p className="text-sm font-500 leading-tight">{movie.title}</p>

                        {/* Dropdown — clearly styled as a select */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                            className={`flex w-full items-center justify-between rounded px-2 py-1 text-xs font-500 ${STATUS_COLORS[item.status]}`}
                          >
                            <span>{STATUS_OPTIONS.find((s) => s.value === item.status)?.label}</span>
                            <span className="text-sm">▾</span>
                          </button>
                          {openDropdown === item.id && (
                            <div className="absolute z-10 mt-1 w-full rounded border border-dim/30 bg-void shadow-lg">
                              {STATUS_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => {
                                    updateItem(item.id, { status: opt.value })
                                    setOpenDropdown(null)
                                  }}
                                  className="block w-full px-3 py-2 text-left text-xs hover:bg-panel"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Rating slider */}
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-dim">
                            <span>Rating</span>
                            <span className="font-display text-gold">
                              {sliderValue.toFixed(1)} / 10
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            step={0.5}
                            value={sliderValue}
                            onChange={(e) =>
                              setLocalRating((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                            }
                            onMouseUp={(e) =>
                              updateItem(item.id, { rating: Number((e.target as HTMLInputElement).value) })
                            }
                            onTouchEnd={(e) =>
                              updateItem(item.id, { rating: Number((e.target as HTMLInputElement).value) })
                            }
                            className="w-full accent-gold"
                          />
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="self-start text-xs text-dim hover:text-magenta"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}