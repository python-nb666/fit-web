import { useState, useEffect } from 'react'
import './App.css'
import { Icons } from './components/Icons'
import { categories, DEFAULT_EXERCISES } from './constants'
import type { WorkoutCategory, WorkoutRecord } from './types'
import { CategoryGrid } from './components/CategoryGrid'
import { ExerciseManager } from './components/ExerciseManager'
import { AddRecordForm } from './components/AddRecordForm'
import { RecordList } from './components/RecordList'

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
  const [showAddForm, setShowAddForm] = useState(false)

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

    // Filter records for this category, excluding today
    const historyDates = records
      .filter(r => r.category === selectedCategory && r.date < today)
      .map(r => r.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (historyDates.length === 0) return '首次训练'

    const lastDate = historyDates[0]
    const diffTime = Math.abs(new Date(today).getTime() - new Date(lastDate).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return `上次训练：${diffDays}天前 (${formatDate(lastDate)})`
  }

  // Exercise Management Logic
  const handleAddExercise = (name: string) => {
    if (!selectedCategory) return
    const current = exercises[selectedCategory] || []
    if (current.includes(name)) return

    setExercises({
      ...exercises,
      [selectedCategory]: [...current, name]
    })
  }

  const handleRemoveExercise = (name: string) => {
    if (!selectedCategory) return
    setExercises({
      ...exercises,
      [selectedCategory]: (exercises[selectedCategory] || []).filter(e => e !== name)
    })
  }

  // Record Logic
  const handleAddRecord = (data: { exercise: string; sets: number; reps: number; weight: number }) => {
    if (!selectedCategory) return
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      category: selectedCategory,
      ...data,
      date: selectedDate,
    }
    setRecords([newRecord, ...records])
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
            <CategoryGrid onSelectCategory={setSelectedCategory} />
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
                    className={`p-4 rounded-2xl border transition-all duration-300 ${showExerciseManager
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
                <ExerciseManager
                  category={selectedCategory}
                  categoryLabel={activeCategoryConfig.label}
                  exercises={currentCategoryExercises}
                  onAdd={handleAddExercise}
                  onRemove={handleRemoveExercise}
                />
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
                <AddRecordForm
                  exercises={currentCategoryExercises}
                  onSave={handleAddRecord}
                  onCancel={() => setShowAddForm(false)}
                />
              )}

              {/* Records List */}
              <RecordList records={currentRecords} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
