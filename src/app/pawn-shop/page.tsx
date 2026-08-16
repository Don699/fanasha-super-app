"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Upload, Lock, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'

const ITEM_BASE_VALUES: Record<string, [number, number]> = {
  Gold: [2000, 8000],
  Watch: [1500, 12000],
  Phone: [800, 9000],
  Laptop: [1500, 15000],
  Other: [500, 5000],
}

export default function PawnShopPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [itemType, setItemType] = useState('Phone')
  const [battery, setBattery] = useState(85)
  const [scratches, setScratches] = useState<'none' | 'minor' | 'major'>('minor')
  const [hasBox, setHasBox] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [estimate, setEstimate] = useState<[number, number] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null)
      setChecking(false)
    })
  }, [])

  function handleFiles(list: FileList | null) {
    if (!list) return
    const arr = Array.from(list).slice(0, 5)
    setFiles(arr)
    setPreviews(arr.map((f) => URL.createObjectURL(f)))
  }

  function computeEstimate(): [number, number] {
    const [lo, hi] = ITEM_BASE_VALUES[itemType]
    let factor = battery / 100
    if (scratches === 'none') factor += 0.1
    if (scratches === 'major') factor -= 0.25
    if (hasBox) factor += 0.05
    factor = Math.max(0.2, Math.min(1.15, factor))
    return [
      Math.round((lo * factor) / 10) * 10,
      Math.round((hi * factor) / 10) * 10,
    ]
  }

  async function submit() {
    if (!userId) return
    setSubmitting(true)
    setError(null)
    try {
      const paths: string[] = []
      for (const f of files) {
        const ext = f.name.split('.').pop()
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('pawn-media')
          .upload(path, f)
        if (upErr) throw new Error(upErr.message)
        paths.push(path)
      }
      const [lo, hi] = computeEstimate()
      const { error: dbErr } = await supabase.from('pawn_offers').insert({
        user_id: userId,
        item_type: itemType,
        description: notes,
        condition_score: battery,
        photos: paths,
        estimated_value: hi,
        status: 'PENDING_VALUATION',
      })
      if (dbErr) throw new Error(dbErr.message)
      setEstimate([lo, hi])
      setDone(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return <div className="min-h-[70vh] flex items-center justify-center text-slate-400">Loading...</div>
  }

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="w-12 h-12 text-amber-400 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Login required</h1>
        <p className="text-slate-400 max-w-md mb-6">Your valuations are private. Please log in to upload your items securely.</p>
        <Link href="/login" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20">
          Go to Login
        </Link>
      </div>
    )
  }

  if (done && estimate) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-lg bg-slate-900/50 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-md">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Valuation Submitted!</h1>
          <p className="text-slate-400 mb-8">Our team will confirm your confidential offer within 24 hours.</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <p className="text-sm text-slate-400 mb-2">Your Instant Estimate Range</p>
            <p className="text-3xl font-bold text-amber-400">
              GHS {estimate[0].toLocaleString()} – GHS {estimate[1].toLocaleString()}
            </p>
          </div>
          <Link href="/" className="text-slate-300 hover:text-white underline">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Get Instant Cash</h1>
        <p className="text-slate-400">Upload your item. Get a confidential offer. Your photos are never shown publicly.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-8 mb-12">
        {[
          { n: 1, label: 'Upload Photos' },
          { n: 2, label: 'Describe Condition' },
          { n: 3, label: 'Get Offer' },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.n ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
              {s.n}
            </div>
            <span className={`text-sm font-medium ${step >= s.n ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{error}</div>
      )}

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        {step === 1 && (
          <div className="space-y-6">
            <label className="block border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-amber-500/50 transition-colors">
              <Upload className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-1">Click to upload photos of your item</p>
              <p className="text-sm text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Encrypted & private — up to 5 photos
              </p>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-white/10">
                    <img src={src} alt={`upload ${i}`} className="w-full h-28 object-cover" />
                    <div className="absolute bottom-2 right-2 bg-slate-950/80 rounded-md p-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={files.length === 0}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Item Type</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(ITEM_BASE_VALUES).map((t) => (
                  <button
                    key={t}
                    onClick={() => setItemType(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${itemType === t ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 flex justify-between mb-2">
                <span>Condition / Battery Health</span>
                <span className="text-amber-400 font-bold">{battery}%</span>
              </label>
              <input type="range" min={10} max={100} value={battery} onChange={(e) => setBattery(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Scratches</label>
              <div className="flex gap-2">
                {(['none', 'minor', 'major'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScratches(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${scratches === s ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer">
              <span className="text-sm font-medium text-slate-300">Original Box Included</span>
              <input type="checkbox" checked={hasBox} onChange={(e) => setHasBox(e.target.checked)} className="w-5 h-5 accent-amber-500" />
            </label>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Extra Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="e.g. Barely used, charger included..."
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-2">Instant Estimate for your {itemType}</p>
              <p className="text-3xl font-bold text-amber-400">
                GHS {computeEstimate()[0].toLocaleString()} – GHS {computeEstimate()[1].toLocaleString()}
              </p>
            </div>

            <div className="text-sm text-slate-400 space-y-1">
              <p>• {files.length} photo(s) uploaded securely</p>
              <p>• Condition: {battery}% • Scratches: {scratches} • Box: {hasBox ? 'Yes' : 'No'}</p>
              <p>• Final confidential offer confirmed by our team within 24hrs</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all">
                Back
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
              >
                {submitting ? 'Uploading securely...' : 'Submit Valuation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
