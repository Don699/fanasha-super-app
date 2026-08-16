"use client"
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { MapPin, BadgeCheck, ShieldCheck, X, CalendarCheck } from 'lucide-react'

type Property = {
  id: string
  title: string
  type: string
  location: string
  price: number
  image_url: string
  description: string | null
  litigation_free: boolean
  verified: boolean
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('All')
  const [type, setType] = useState('All')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [litFreeOnly, setLitFreeOnly] = useState(false)
  const [selected, setSelected] = useState<Property | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)
  const [booking, setBooking] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
      const { data: authData } = await supabase.auth.getSession()
      setProperties((data as Property[]) ?? [])
      setUserId(authData.session?.user?.id ?? null)
      setLoading(false)
    }
    load()
  }, [])

  const locations = useMemo(
    () => ['All', ...Array.from(new Set(properties.map((p) => p.location)))],
    [properties]
  )

  const filtered = useMemo(
    () =>
      properties.filter(
        (p) =>
          (location === 'All' || p.location === location) &&
          (type === 'All' || p.type === type) &&
          (maxPrice === null || p.price <= maxPrice) &&
          (!litFreeOnly || p.litigation_free)
      ),
    [properties, location, type, maxPrice, litFreeOnly]
  )

  async function bookVisit() {
    if (!selected || !userId) return
    setBooking(true)
    const { error } = await supabase
      .from('visit_requests')
      .insert({ user_id: userId, property_id: selected.id })
    if (!error) setBooked(true)
    setBooking(false)
  }

  function closeModal() {
    setSelected(null)
    setBooked(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Property Marketplace</h1>
        <p className="text-slate-400">Verified homes and litigation-free land across Ghana.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          {locations.map((l) => (
            <option key={l} value={l}>Location: {l}</option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option value="All">Type: All</option>
          <option value="Land">Type: Land</option>
          <option value="Apartment">Type: Apartment</option>
          <option value="Commercial">Type: Commercial</option>
        </select>

        <select
          value={maxPrice ?? 'any'}
          onChange={(e) => setMaxPrice(e.target.value === 'any' ? null : Number(e.target.value))}
          className="bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option value="any">Max Price: Any</option>
          <option value="500000">Under GHS 500K</option>
          <option value="1000000">Under GHS 1M</option>
          <option value="2000000">Under GHS 2M</option>
          <option value="5000000">Under GHS 5M</option>
        </select>

        <button
          onClick={() => setLitFreeOnly(!litFreeOnly)}
          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all ${litFreeOnly ? 'border-amber-500/60 bg-amber-500/10' : 'border-amber-500/40 bg-slate-900'}`}
        >
          <span className={`relative h-5 w-9 rounded-full transition-colors ${litFreeOnly ? 'bg-amber-500' : 'bg-white/20'}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${litFreeOnly ? 'left-4' : 'left-0.5'}`} />
          </span>
          <span className="text-sm font-medium text-white">Litigation-Free Only</span>
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-400">Loading properties...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400">No properties match your filters. Try adjusting them.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer"
              onClick={() => setSelected(p)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-sm rounded-lg px-3 py-1.5 shadow-lg">
                  GHS {p.price.toLocaleString()}
                </div>
                <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur text-white text-xs rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {p.location}
                </div>
                <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
                  {p.verified && (
                    <span className="bg-emerald-600/90 text-white text-xs font-medium rounded-md px-2.5 py-1 flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {p.litigation_free && (
                    <span className="bg-amber-600/90 text-white text-xs font-medium rounded-md px-2.5 py-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Litigation-Free
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg mb-1">{p.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{p.type}</p>
                <button className="w-full border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-medium py-2 rounded-xl transition-all text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <img src={selected.image_url} alt={selected.title} className="w-full h-72 object-cover" />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur rounded-full p-2 text-white hover:bg-slate-950"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selected.title}</h2>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {selected.location} • {selected.type}
                  </p>
                </div>
                <p className="text-2xl font-bold text-amber-400 whitespace-nowrap">
                  GHS {selected.price.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 mb-6">
                {selected.verified && (
                  <span className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium rounded-md px-2.5 py-1 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </span>
                )}
                {selected.litigation_free ? (
                  <span className="bg-amber-600/20 border border-amber-500/40 text-amber-400 text-xs font-medium rounded-md px-2.5 py-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Litigation-Free
                  </span>
                ) : (
                  <span className="bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-medium rounded-md px-2.5 py-1">
                    Litigation Check In Progress
                  </span>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed mb-8">{selected.description}</p>

              {userId ? (
                booked ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5" /> Visit requested! Our agent will contact you within 24 hours.
                  </div>
                ) : (
                  <button
                    onClick={bookVisit}
                    disabled={booking}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    {booking ? 'Booking...' : 'Book a Free Site Visit'}
                  </button>
                )
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all"
                >
                  Login to Book a Site Visit
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
