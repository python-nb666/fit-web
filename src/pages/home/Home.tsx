import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '@/components/Icons'
import '@/App.css'
import CategoryGrid from './CategoryGrid'
import { ClearLocalModal } from './components/ClearLocalModal'
import { LastWorkoutSummary } from './components/LastWorkoutSummary'
import { categories } from '@/constants/categories'



export function Home() {
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false)



  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">

        {/* HEADER */}
        <header className="mb-12 md:mb-16 animate-fade-in">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
                FitTracker<span className="text-purple-500">.</span>
              </h1>
              <p className="text-gray-500 text-lg tracking-wide">Minimalist Workout Log</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearCacheConfirm(true)}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-red-400 hover:text-red-300 group"
                title="清除缓存"
              >
                <Icons.Trash className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <Link
                to="/body-fat"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-purple-400 hover:text-purple-300 group"
                title="体脂记录"
              >
                <Icons.TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Last Workout Summary */}
          <LastWorkoutSummary categories={categories} />
        </header>

        <main>
          {/* CATEGORY GRID */}
          <CategoryGrid categories={categories} />
        </main>

        {/* Clear Cache Confirmation Modal */}
        <ClearLocalModal showClearCacheConfirm={showClearCacheConfirm} setShowClearCacheConfirm={setShowClearCacheConfirm} />
      </div>
    </div>
  )
}
