import Link from 'next/link'
import { ShieldCheck, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-lg font-bold text-white">Fanasha <span className="text-amber-400">Divine</span></span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Building spaces. Creating value. Enhancing lives. Ghana's trusted multi-service ecosystem.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <Link href="/properties" className="hover:text-amber-400 transition-colors">Properties</Link>
            <Link href="/pawn-shop" className="hover:text-amber-400 transition-colors">Instant Cash</Link>
            <Link href="/work-and-pay" className="hover:text-amber-400 transition-colors">Work & Pay</Link>
            <Link href="/construction" className="hover:text-amber-400 transition-colors">Construction</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Our Values</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <span>Integrity</span>
            <span>Trust</span>
            <span>Commitment</span>
            <span>Excellence</span>
            <span>Innovation</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Accra, Ghana</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> +233 (0) XX XXX XXXX</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400" /> info@fanashadivine.com</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Fanasha Divine Limited. All rights reserved.
      </div>
    </footer>
  )
}
