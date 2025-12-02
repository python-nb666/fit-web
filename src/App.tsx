import { useState } from 'react'
import './App.css'

// -----------------------------------------------------------------------------
// 1. Icons System (Minimalist SVG)
// -----------------------------------------------------------------------------

const Icons = {
  Chest: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.64l8.42 8.42 8.42-8.42a5.4 5.4 0 0 0 0-7.64z" />
      <path d="M12 5.36l-1.43-1.4a6.4 6.4 0 0 0-9.06 0 6.4 6.4 0 0 0 0 9.06l.74.74" className="opacity-30" />
    </svg>
  ),
  Back: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="M9 14h6" />
      <path d="M9 18h6" />
      <path d="M9 10h6" />
    </svg>
  ),
  Shoulders: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="5" r="1" />
      <path d="M12 6v13" />
      <path d="M6 8l6-2 6 2" />
      <path d="M6 18l6-2 6 2" />
      <circle cx="6" cy="8" r="1" />
      <circle cx="18" cy="8" r="1" />
    </svg>
  ),
  Legs: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 14v8" />
      <path d="M8 14v8" />
      <path d="M16 14v8" />
      <rect x="4" y="4" width="16" height="10" rx="2" />
      <path d="M4 9h16" />
    </svg>
  ),
  Arms: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8L2 12l4 4" />
      <path d="M18 8l4 4-4 4" />
      <path d="M14 5h-4" />
      <path d="M10 19h4" />
      <rect x="8" y="5" width="8" height="14" rx="2" />
    </svg>
  ),
  Core: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
}

// -----------------------------------------------------------------------------
// 2. Configuration & Types
// -----------------------------------------------------------------------------

type WorkoutCategory = 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core'

interface WorkoutRecord {
  id: string
  category: WorkoutCategory
  exercise: string
  sets: number
  reps: number
  weight: number
  date: string
}

const categories: { id: WorkoutCategory; label: string; icon: React.FC<any>; color: string }[] = [
  { id: 'chest', label: '胸部', icon: Icons.Chest, color: 'text-rose-400' },
  { id: 'back', label: '背部', icon: Icons.Back, color: 'text-sky-400' },
  { id: 'shoulders', label: '肩部', icon: Icons.Shoulders, color: 'text-amber-400' },
  { id: 'legs', label: '腿部', icon: Icons.Legs, color: 'text-emerald-400' },
  { id: 'arms', label: '手臂', icon: Icons.Arms, color: 'text-violet-400' },
  { id: 'core', label: '核心', icon: Icons.Core, color: 'text-indigo-400' },
]

// -----------------------------------------------------------------------------
// 3. Main App Component
// -----------------------------------------------------------------------------

function App() {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null)
  const [records, setRecords] = useState<WorkoutRecord[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    exercise: '',
    sets: 0,
    reps: 0,
    weight: 0,
  })

  // Logic Handlers
  const handleAddRecord = () => {
    if (!selectedCategory) return
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      category: selectedCategory,
      ...formData,
      date: new Date().toISOString().split('T')[0],
    }
    setRecords([newRecord, ...records])
    setFormData({ exercise: '', sets: 0, reps: 0, weight: 0 })
    setShowAddForm(false)
  }

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecords = records.filter(r => r.date === today)
    return {
      totalSets: todayRecords.reduce((sum, r) => sum + r.sets, 0),
      totalReps: todayRecords.reduce((sum, r) => sum + (r.sets * r.reps), 0),
      totalWeight: todayRecords.reduce((sum, r) => sum + (r.sets * r.reps * r.weight), 0),
    }
  }

  const stats = getStats()
  const activeCategoryConfig = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
              FitTracker<span className="text-purple-500">.</span>
            </h1>
            <p className="text-gray-500 text-lg tracking-wide">Minimalist Workout Log</p>
          </div>
          
          {/* Stats - Minimalist Row */}
          <div className="flex items-center gap-8 md:gap-12 border-t md:border-t-0 border-white/10 pt-6 md:pt-0">
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-widest mb-1">Sets</div>
              <div className="text-2xl font-light tracking-tight text-white">{stats.totalSets}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-widest mb-1">Reps</div>
              <div className="text-2xl font-light tracking-tight text-white">{stats.totalReps}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-widest mb-1">Vol</div>
              <div className="text-2xl font-light tracking-tight text-white">{(stats.totalWeight / 1000).toFixed(1)}<span className="text-sm text-gray-600 ml-1">k</span></div>
            </div>
          </div>
        </header>

        <main>
          {/* CATEGORY GRID */}
          {!selectedCategory && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="group relative flex flex-col items-start justify-between p-6 h-40 md:h-48 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
                >
                  <div className={`p-3 rounded-2xl bg-white/[0.03] group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon className={`w-6 h-6 ${cat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="w-full flex items-end justify-between">
                    <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">
                      {cat.label}
                    </span>
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-white/50">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* RECORDS VIEW */}
          {selectedCategory && activeCategoryConfig && (
            <div className="animate-fade-in">
              {/* Detail Header */}
              <div className="flex items-center justify-between mb-10">
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setShowAddForm(false)
                  }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 transition-colors">
                    <Icons.ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider">Back</span>
                </button>
                
                <div className="flex items-center gap-3">
                  <activeCategoryConfig.icon className={`w-6 h-6 ${activeCategoryConfig.color}`} />
                  <h2 className="text-2xl font-bold">{activeCategoryConfig.label}</h2>
                </div>
              </div>

              {/* Add Form Toggle */}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-4 mb-8 rounded-2xl border border-dashed border-white/20 text-gray-500 hover:text-white hover:border-white/40 hover:bg-white/[0.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Icons.Plus className="w-5 h-5" />
                  <span>添加新记录</span>
                </button>
              )}

              {/* Add Form */}
              {showAddForm && (
                <div className="mb-10 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Exercise</label>
                      <input
                        type="text"
                        value={formData.exercise}
                        onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                        className="w-full px-0 py-3 bg-transparent border-b border-white/10 focus:border-purple-500 outline-none transition-colors text-lg placeholder-white/20 text-base"
                        placeholder="动作名称..."
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Sets</label>
                      <input
                        type="number"
                        value={formData.sets || ''}
                        onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Reps</label>
                      <input
                        type="number"
                        value={formData.reps || ''}
                        onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleAddRecord}
                      disabled={!formData.exercise}
                      className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      保存
                    </button>
                  </div>
                </div>
              )}

              {/* Records List */}
              <div className="space-y-3">
                {records.filter(r => r.category === selectedCategory).length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-600">暂无记录</p>
                  </div>
                ) : (
                  records
                    .filter(r => r.category === selectedCategory)
                    .map((record) => (
                      <div
                        key={record.id}
                        className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="text-lg font-medium text-gray-200 mb-2">{record.exercise}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                            <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400">{record.sets} sets</span>
                            <span>×</span>
                            <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400">{record.reps} reps</span>
                            <span>@</span>
                            <span className="text-purple-400">{record.weight}kg</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:block md:text-right border-t border-white/5 pt-3 md:border-0 md:pt-0">
                          <div className="text-xs text-gray-600 uppercase tracking-wider md:mb-1">Volume</div>
                          <div className="text-xl font-light text-white">
                            {(record.sets * record.reps * record.weight).toLocaleString()} <span className="text-sm text-gray-600">kg</span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
