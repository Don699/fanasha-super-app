"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Car, Bike, Calculator, MapPin, PhoneCall, CheckCircle2, Building2, Handshake } from 'lucide-react'

export default function WorkAndPayPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  const [price, setPrice] = useState(50000)
  const [interest, setInterest] = useState(100)
  const [term, setTerm] = useState<24 | 30>(24)
  const [deposit, setDeposit] = useState(15000)

  const [vehicleType, setVehicleType] = useState<'Car' | 'Motorbike'>('Car')
  const [details, setDetails] = useState('')
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

  const total = price * (1 + interest / 100)
  const weeks = Math.round((term * 52) / 12)
  const balance = Math.max(total - deposit, 0)
  const weekly = weeks > 0 ? balance / weeks : 0

  async function submitApplication() {
    if (!userId) return
    if (!details.trim() || !phone.trim()) {
      setError('Please fill in the vehicle details and your phone number.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.from('work_pay_applications').insert({
      user_id: userId,
      vehicle_type: vehicleType,
      vehicle_details: details,
      budget: price,
      term_months: term,
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
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Work & Pay</h1>
        <p className="text-slate-400">Tell us the vehicle you need. We buy it. You work and pay weekly.</p>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">1. Tell Us the Vehicle</h3>
          <p className="text-sm text-slate-400">You choose the car or motorbike you want to work with.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">2. We Buy It For You</h3>
          <p className="text-sm text-slate-400">Our team goes to the market and sources it on your behalf.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Handshake className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">3. Pay Weekly at Office</h3>
          <p className="text-sm text-slate-400">Spread over 24 or 30 months. All payments made at our office.</p>
        </div>
      </div>

      {/* The Rules */}
      <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-6 mb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Deposit: GHS 15,000
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Interest: 100% (negotiable)
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Weekly payments, 24–30 months
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" /> Payments at the office (no MoMo)
          </div>
        </div>
      </div>

      {/* Calculator + Form */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-8">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Plan Calculator</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Vehicle Market Price (GHS)</label>
              <input
                type="number"
                value={price}
                min={0}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 flex justify-between mb-2">
                <span>Interest Rate</span>
                <span className="text-amber-400 font-bold">{interest}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <PhoneCall className="w-3 h-3" /> Standard 100% — negotiable. Contact us for a custom rate.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Payment Term</label>
              <div className="flex gap-2">
                {([24, 30] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${term === t ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                  >
                    {t} months
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Upfront Deposit (GHS)</label>
              <input
                type="number"
                value={deposit}
                min={0}
                onChange={(e) => setDeposit(Number(e.target.value) || 0)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Total Payable (price + {interest}%)</span>
              <span className="font-semibold text-white">GHS {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Deposit (upfront)</span>
              <span className="font-semibold text-white">– GHS {deposit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Balance over {weeks} weekly payments</span>
              <span className="font-semibold text-white">GHS {balance.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="text-slate-300 font-medium">Your Weekly Payment</span>
              <span className="text-2xl font-bold text-amber-400">GHS {Math.round(weekly).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Application */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-2">Apply for Your Vehicle</h2>
          <p className="text-sm text-slate-400 mb-8">Tell us what you need — we'll contact you to finalize the deal and negotiate your rate.</p>

          {!userId ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">Please log in to submit your application.</p>
              <Link href="/login" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20">
                Go to Login
              </Link>
            </div>
          ) : submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
              <p className="text-slate-400">Our team will call you to discuss the vehicle and your custom rate. Visit our office to pay your deposit and start driving.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Vehicle Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVehicleType('Car')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${vehicleType === 'Car' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                  >
                    <Car className="w-4 h-4" /> Car
                  </button>
                  <button
                    onClick={() => setVehicleType('Motorbike')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${vehicleType === 'Motorbike' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                  >
                    <Bike className="w-4 h-4" /> Motorbike
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Which vehicle do you need?</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. Toyota Corolla 2018, silver, or delivery motorbike..."
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
                onClick={submitApplication}
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>

              <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" /> Deposit & weekly payments are made in person at our office.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
