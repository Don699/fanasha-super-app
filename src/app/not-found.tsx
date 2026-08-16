import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-bold text-amber-400 mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20">
        Back to Home
      </Link>
    </div>
  )
}
