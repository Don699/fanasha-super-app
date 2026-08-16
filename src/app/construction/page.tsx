"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Building2, Paintbrush, Hammer, Ruler, CheckCircle2, MapPin } from 'lucide-react'

const SERVICES = [
  { icon: Building2, title: 'Full Construction', desc: 'Residential & commercial builds delivered on time and on budget.' },
  { icon: Hammer, title: 'House Renovation', desc: 'Remodels and extensions that lift the value of your property.' },
  { icon: Paintbrush, title: 'Roofing & Painting', desc: 'Professional roofing, painting and finishing services.' },
  { icon: Ruler, title: 'Survey & Documentation', desc: 'Site surveys, indentures and title registration handled end-to-end.' },
]

export default function ConstructionPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [projectType, setProjectType] = useState('Full Construction')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null)
      setChecking(false)
    })
  }, [])

  async function submit() {
    if (!userId) return
    if (!description.trim() || !phone.trim()) {
      setError('Please describe your project and add a phone number.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.from('construction_requests').insert({
      user_id: userId,
      project_type: projectType,
      description,
      phone,
    })
    if (error) setError(error.message)
    else setSubmitted(true)
    setSubmitting(false)
  }

  if (checking) {
    return <div className="min-h-[70vh] flex items-center justify-center text-slate-400">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Construction & Renovation</h1>
        <p className="text-slate-400">From foundation to finishing — we build spaces that create value.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {SERVICES.map((s) => (
          <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
              <s.icon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-6 mb-12">
        <div className="grid sm:grid-cols-4 gap-4 text-sm text-slate-200 text-center">
          <div>1️⃣ Site Survey</div>
          <div>2️⃣ Transparent Quote</div>
          <div>3️⃣ We Build</div>
          <div>4️⃣ On-Time Handover</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-2">Request a Free Quote</h2>
        <p className="text-sm text-slate-400 mb-8">Tell us about your project — our team will visit your site and send a transparent quote.</p>

        {!userId ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-6">Please log in to request a quote.</p>
            <Link href="/login" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20">
              Go to Login
            </Link>
          </div>
        ) : submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Quote Request Received!</h3>
            <p className="text-slate-400">Our construction team will call you to schedule your free site survey.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {SERVICES.map((s) => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Describe Your Project</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="e.g. Build a 3-bedroom house on my plot at Kasoa, or renovate my roof..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="024 XXX XXXX"
              />
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              {submitting ? 'Sending...' : 'Request Free Quote'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
