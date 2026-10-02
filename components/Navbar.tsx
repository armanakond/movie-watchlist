'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  if (pathname === '/login') return null

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-gold/20 bg-panel px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-lg font-800 tracking-wide text-gold">
            WATCHLIST
          </Link>
          <div className="flex gap-6">
            <Link href="/search" className="text-sm font-medium text-dim transition-colors hover:text-ink">
              Browse
            </Link>
            <Link href="/watchlist" className="text-sm font-medium text-dim transition-colors hover:text-ink">
              My Collection
            </Link>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-dim transition-colors hover:text-magenta">
          Log out
        </button>
      </div>
    </nav>
  )
}