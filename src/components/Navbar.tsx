"use client"
import React from 'react'
import Link from 'next/link'
import { Menu, ShieldCheck } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Fanasha <span className="text-amber-400">Divine</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/properties" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Properties</Link>
          <Link href="/pawn-shop" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Instant Cash</Link>
          <Link href="/work-and-pay" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Work & Pay</Link>
          <Link href="/construction" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Construction</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 h-10 px-4 transition-colors">
            Login
          </Link>
          <Link href="/pawn-shop" className="inline-flex items-center justify-center rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 h-10 px-5 shadow-lg shadow-amber-500/20 transition-colors">
            Get Valuation
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md h-10 w-10 text-white hover:bg-white/10 focus:outline-none">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 border-white/10 text-white p-6">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/properties" className="text-lg font-medium hover:text-amber-400">Properties</Link>
                <Link href="/pawn-shop" className="text-lg font-medium hover:text-amber-400">Instant Cash</Link>
                <Link href="/work-and-pay" className="text-lg font-medium hover:text-amber-400">Work & Pay</Link>
                <Link href="/construction" className="text-lg font-medium hover:text-amber-400">Construction</Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-md text-base font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 h-11 px-5 shadow-lg shadow-amber-500/20 transition-colors mt-4">
                  Login / Sign Up
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
