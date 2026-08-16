"use client"
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState<'login' | 'signup' | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const supabase = createClient()

  function getData() {
    const fd = new FormData(formRef.current!)
    return {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    }
  }

  async function handleLogin() {
    setLoading('login')
    setError(null)
    setNotice(null)
    const { error } = await supabase.auth.signInWithPassword(getData())
    if (error) {
      setError(error.message)
      setLoading(null)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleSignup() {
    setLoading('signup')
    setError(null)
    setNotice(null)
    const { data, error } = await supabase.auth.signUp(getData())
    if (error) {
      setError(error.message)
      setLoading(null)
    } else if (data.session) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setNotice('Account created! You can now log in.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
            <ShieldCheck className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to Fanasha</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
            {notice}
          </div>
        )}

        <form ref={formRef} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="kwame@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading !== null}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {loading === 'login' ? 'Processing...' : 'Log in'}
            </button>
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading !== null}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'signup' ? 'Processing...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
