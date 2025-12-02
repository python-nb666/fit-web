import { useState, useEffect } from 'react'
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
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

const DEFAULT_EXERCISES: Record<WorkoutCategory, string[]> = {
  chest: ['杠铃卧推', '哑铃卧推', '上斜卧推', '双杠臂屈伸', '绳索夹胸'],
  back: ['引体向上', '杠铃划船', '高位下拉', '坐姿划船', '直臂下压'],
  shoulders: ['坐姿推举', '哑铃侧平举', '面拉', '前平举', '反向飞鸟'],
  legs: ['深蹲', '硬拉', '腿举', '哈克深蹲', '腿屈伸'],
  arms: ['杠铃弯举', '哑铃弯举', '绳索下压', '仰卧臂屈伸'],
  core: ['卷腹', '平板支撑', '悬垂举腿', '俄罗斯转体']
}

// -----------------------------------------------------------------------------
// 3. UI Components
// -----------------------------------------------------------------------------

interface CustomSelectProps {
  value: string | number
  onChange: (value: string | number) => void
  options: { value: string | number; label: string }[]
  placeholder?: string
  label?: string
}

function CustomSelect({ value, onChange, options, placeholder, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {label && <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</label>}
      
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base text-left flex items-center justify-between text-white group"
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {value ? options.find(o => o.value === value)?.label || value : placeholder || 'Select...'}
        </span>
        <span className={`text-gray-500 text-xs transition-transform duration-200 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/50 max-h-60 overflow-y-auto animate-fade-in backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between ${
                value === option.value ? 'text-purple-400 bg-white/[0.02]' : 'text-gray-300'
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && <span className="text-purple-500">✓</span>}
            </button>
          ))}
          {options.length === 0 && (
             <div className="px-4 py-3 text-sm text-gray-500">暂无选项</div>
          )}
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// 4. Main App Component
// -----------------------------------------------------------------------------

function App() {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Records State
  const [records, setRecords] = useState<WorkoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fit_records')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Exercises State
  const [exercises, setExercises] = useState<Record<WorkoutCategory, string[]>>(() => {
    try {
      const saved = localStorage.getItem('fit_exercises')
      return saved ? JSON.parse(saved) : DEFAULT_EXERCISES
    } catch (e) {
      return DEFAULT_EXERCISES
    }
  })

  // Exercise Manager State
  const [showExerciseManager, setShowExerciseManager] = useState(false)
  const [newExerciseName, setNewExerciseName] = useState('')

  useEffect(() => {
    localStorage.setItem('fit_records', JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem('fit_exercises', JSON.stringify(exercises))
  }, [exercises])

  // Reset state when entering a category
  useEffect(() => {
    if (selectedCategory) {
      setSelectedDate(new Date().toISOString().split('T')[0])
      setShowAddForm(false)
      setShowExerciseManager(false)
    }
  }, [selectedCategory])

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    exercise: '',
    sets: 0,
    reps: 0,
    weight: 0,
  })

  // Helpers
  const changeDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateString = date.toISOString().split('T')[0]
    const todayString = today.toISOString().split('T')[0]
    const yesterdayString = yesterday.toISOString().split('T')[0]

    if (dateString === todayString) return '今天'
    if (dateString === yesterdayString) return '昨天'
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const getLastWorkoutInfo = () => {
    if (!selectedCategory) return null
    
    const today = new Date().toISOString().split('T')[0]
    
    // Filter records for this category, excluding today (future dates strictly shouldn't exist but good to handle)
    const historyDates = records
      .filter(r => r.category === selectedCategory && r.date < today)
      .map(r => r.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort desc
      
    if (historyDates.length === 0) return '首次训练'
    
    const lastDate = historyDates[0]
    const diffTime = Math.abs(new Date(today).getTime() - new Date(lastDate).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return `上次训练：${diffDays}天前 (${formatDate(lastDate)})`
  }

  // Exercise Management Logic
  const handleAddExercise = () => {
    if (!newExerciseName.trim() || !selectedCategory) return
    const current = exercises[selectedCategory] || []
    if (current.includes(newExerciseName.trim())) return

    setExercises({
      ...exercises,
      [selectedCategory]: [...current, newExerciseName.trim()]
    })
    setNewExerciseName('')
  }

  const handleRemoveExercise = (name: string) => {
    if (!selectedCategory) return
    setExercises({
      ...exercises,
      [selectedCategory]: (exercises[selectedCategory] || []).filter(e => e !== name)
    })
  }

  // Record Logic
  const handleAddRecord = () => {
    if (!selectedCategory) return
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      category: selectedCategory,
      ...formData,
      date: selectedDate,
    }
    setRecords([newRecord, ...records])
    setFormData({ exercise: '', sets: 0, reps: 0, weight: 0 })
    setShowAddForm(false)
  }

  const activeCategoryConfig = categories.find(c => c.id === selectedCategory)
  const currentRecords = records.filter(r => 
    r.category === selectedCategory && r.date === selectedDate
  )
  const currentCategoryExercises = selectedCategory ? (exercises[selectedCategory] || []) : []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER */}
        {!selectedCategory && (
          <header className="mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
              FitTracker<span className="text-purple-500">.</span>
            </h1>
            <p className="text-gray-500 text-lg tracking-wide">Minimalist Workout Log</p>
          </header>
        )}

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
              {/* Detail Navigation Header */}
              <div className="flex flex-col gap-6 mb-10">
                {/* Top Row: Back & Title */}
                <div className="flex items-center justify-between">
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
                    <div className="text-right hidden md:block">
                      <div className="text-3xl font-bold">{activeCategoryConfig.label}</div>
                      <div className="text-base text-purple-300 font-medium mt-1">{getLastWorkoutInfo()}</div>
                    </div>
                    {/* Mobile View for Title/Info */}
                    <div className="md:hidden">
                       <div className="text-2xl font-bold text-right">{activeCategoryConfig.label}</div>
                       <div className="text-sm text-purple-300 font-medium text-right mt-1">{getLastWorkoutInfo()}</div>
                    </div>
                    <activeCategoryConfig.icon className={`w-10 h-10 ${activeCategoryConfig.color}`} />
                  </div>
                </div>

                {/* Date Navigator & Manage Button */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center justify-between bg-white/[0.03] rounded-2xl p-2 border border-white/[0.05]">
                    <button 
                      onClick={() => changeDate(-1)}
                      className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Icons.ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="relative group cursor-pointer">
                      <div className="text-center">
                        <div className="text-lg font-medium text-white">{formatDate(selectedDate)}</div>
                        {formatDate(selectedDate) !== selectedDate && (
                          <div className="text-xs text-gray-500 font-mono">{selectedDate}</div>
                        )}
                      </div>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>

                    <button 
                      onClick={() => changeDate(1)}
                      className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Icons.ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowExerciseManager(!showExerciseManager)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      showExerciseManager 
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                        : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06] text-gray-400 hover:text-white'
                    }`}
                    title="管理动作"
                  >
                    <Icons.Settings className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Exercise Manager Section */}
              {showExerciseManager && (
                <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] animate-fade-in">
                  <h3 className="text-lg font-bold mb-4 text-purple-400">管理{activeCategoryConfig.label}动作</h3>
                  
                  {/* Add New Exercise */}
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base placeholder-white/20"
                      placeholder="输入新动作名称..."
                    />
                    <button
                      onClick={handleAddExercise}
                      disabled={!newExerciseName.trim()}
                      className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加
                    </button>
                  </div>

                  {/* Exercise List */}
                  <div className="flex flex-wrap gap-2">
                    {currentCategoryExercises.map((exercise) => (
                      <div key={exercise} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 group hover:border-white/30 transition-all">
                        <span className="text-gray-300">{exercise}</span>
                        <button
                          onClick={() => handleRemoveExercise(exercise)}
                          className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {currentCategoryExercises.length === 0 && (
                      <span className="text-gray-500 text-sm">暂无动作，请添加</span>
                    )}
                  </div>
                </div>
              )}

              {/* Add Form Toggle */}
              {!showAddForm && !showExerciseManager && (
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
                      <CustomSelect
                        label="Exercise"
                        placeholder="选择动作..."
                        value={formData.exercise}
                        onChange={(val) => setFormData({ ...formData, exercise: val as string })}
                        options={currentCategoryExercises.map(e => ({ value: e, label: e }))}
                      />
                      {currentCategoryExercises.length === 0 && (
                        <p className="text-xs text-red-400 mt-2">
                          当前无可用动作，请先点击右上角设置图标添加动作。
                        </p>
                      )}
                    </div>
                    <div>
                      <CustomSelect
                        label="Sets"
                        placeholder="0"
                        value={formData.sets || ''}
                        onChange={(val) => setFormData({ ...formData, sets: val as number })}
                        options={Array.from({ length: 12 }, (_, i) => i + 1).map(num => ({ value: num, label: num.toString() }))}
                      />
                    </div>
                    <div>
                      <CustomSelect
                        label="Reps"
                        placeholder="0"
                        value={formData.reps || ''}
                        onChange={(val) => setFormData({ ...formData, reps: val as number })}
                        options={Array.from({ length: 20 }, (_, i) => i + 1).map(num => ({ value: num, label: num.toString() }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base placeholder-white/20"
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
                {currentRecords.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-600">今日无记录</p>
                  </div>
                ) : (
                  currentRecords.map((record) => (
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
