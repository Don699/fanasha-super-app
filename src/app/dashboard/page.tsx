"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Gem, Home, Car, Hammer } from 'lucide-react'

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [counts, setCounts] = useState({ offers: 0, visits: 0, apps: 0, builds: 0 })
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setEmail(session.user.email ?? null)
      const [o, v, a, b] = await Promise.all([
        supabase.from('pawn_offers').select('id', { count: 'exact', head: true }),
        supabase.from('visit_requests').select('id', { count: 'exact', head: true }),
        supabase.from('work_pay_applications').select('id', { count: 'exact', head: true }),
        supabase.from('construction_requests').select('id', { count: 'exact', head: true }),
      ])
      setCounts({ offers: o.count ?? 0, visits: v.count ?? 0, apps: a.count ?? 0, builds: b.count ?? 0 })
      setReady(true)
    }
    load()
  }, [])

  if (!ready) {
    return <div className="min-h-[70vh] flex items-center justify-center text-slate-400">Loading your dashboard...</div>
  }

  const stats = [
    { icon: Gem, label: 'Pawn Valuations', value: counts.offers, href: '/pawn-shop' },
    { icon: Home, label: 'Site Visits Booked', value: counts.visits, href: '/properties' },
    { icon: Car, label: 'Vehicle Applications', value: counts.apps, href: '/work-and-pay' },
    { icon: Hammer, label: 'Construction Quotes', value: counts.builds, href: '/construction' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Akwaaba! 🇬🇭</h1>
        <p className="text-slate-400">{email}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <s.icon className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Need cash today?</h2>
        <p className="text-slate-400 mb-6">Upload your item and get a confidential valuation within 24 hours.</p>
        <Link href="/pawn-shop" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20">
          Get Instant Valuation
        </Link>
      </div>
    </div>
  )
}
