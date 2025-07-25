import MagicLinkLogin from '@/components/MagicLinkLogin'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">flick.page</h1>
        <p className="text-slate-400 mt-2 text-lg">
          Your one-click portfolio is waiting.
        </p>
      </div>
      <div className="mt-12 w-full max-w-sm">
        <MagicLinkLogin />
      </div>
    </main>
  )
}