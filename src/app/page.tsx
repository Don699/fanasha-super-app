// src/app/page.tsx
import { ArrowRight, Sparkles, Home as HomeIcon, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-950 to-slate-950" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ghana's Premier Multi-Service Ecosystem</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
            Building Spaces. <br/>
            <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              Creating Wealth.
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
            From litigation-free land and modern homes to instant asset valuations and flexible auto-financing. Experience Fanasha Divine Limited, reimagined.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 text-base">
              Get Instant Cash Offer
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white px-8 py-6 rounded-xl text-base">
              Browse Properties
            </Button>
          </div>
        </div>
        
        <div className="hidden lg:grid grid-cols-2 gap-4">
           <div className="col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                    <HomeIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-semibold text-lg">Verified Land & Homes</p>
                    <p className="text-sm text-slate-400">150+ Litigation-Free Plots Available</p>
                 </div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
              <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
              <div className="text-3xl font-bold text-amber-400">24hr</div>
              <p className="text-sm text-slate-300 mt-1">Fast Pawn Valuations</p>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
              <Car className="w-8 h-8 text-emerald-400 mb-2" />
              <div className="text-3xl font-bold text-emerald-400 mb-2">0%</div>
              <p className="text-sm text-slate-300 mt-1">Hidden Financing Fees</p>
           </div>
        </div>
      </div>
    </section>
  )
}