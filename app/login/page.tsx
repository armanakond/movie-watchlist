'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/watchlist')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-8">
        <h1 className="text-2xl font-semibold text-white">
          {isSignUp ? 'Sign up' : 'Log in'}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded bg-zinc-800 p-2 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded bg-zinc-800 p-2 text-white"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-red-600 p-2 font-medium text-white hover:bg-red-700"
        >
          {isSignUp ? 'Sign up' : 'Log in'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-zinc-400"
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  )
}