import { useState, useEffect } from 'react'
import './App.css'
import { categories, DEFAULT_EXERCISES } from './constants'
import type { WorkoutCategory, WorkoutRecord } from './types'
import { CategoryGrid } from './components/CategoryGrid'
import { WorkoutRecordsView } from './components/WorkoutRecordsView'
import * as api from './api/adapter'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Records State - 从 API 获取
  const [records, setRecords] = useState<WorkoutRecord[]>([])

  // Exercises State - 保持本地存储
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

  // 从 API 加载记录
  useEffect(() => {
    loadRecords()
  }, [])

  // 保存 exercises 到本地存储
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

  // 加载记录
  const loadRecords = async () => {
    try {
      const result = await api.getRecords()
      setRecords(result.list)
    } catch (error) {
      console.error('Failed to load records:', error)
    }
  }

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

  // Exercise Management Logic - 保持本地存储
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

  // Record Logic - 使用 API
  const handleAddRecord = async (data: { exercise: string; sets: number; reps: number; weight: number }) => {
    if (!selectedCategory) return

    try {
      const newRecord = await api.createRecord({
        category: selectedCategory,
        ...data,
        date: selectedDate,
      })

      // 更新本地状态
      setRecords([newRecord, ...records])
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to create record:', error)
      alert('创建记录失败，请重试')
    }
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
            <WorkoutRecordsView
              category={selectedCategory}
              categoryLabel={activeCategoryConfig.label}
              categoryIcon={activeCategoryConfig.icon}
              categoryColor={activeCategoryConfig.color}
              selectedDate={selectedDate}
              records={currentRecords}
              exercises={currentCategoryExercises}
              showExerciseManager={showExerciseManager}
              showAddForm={showAddForm}
              lastWorkoutInfo={getLastWorkoutInfo()}
              onBack={() => {
                setSelectedCategory(null)
                setShowAddForm(false)
              }}
              onChangeDate={changeDate}
              onDateChange={setSelectedDate}
              onToggleExerciseManager={() => setShowExerciseManager(!showExerciseManager)}
              onAddExercise={handleAddExercise}
              onRemoveExercise={handleRemoveExercise}
              onShowAddForm={() => setShowAddForm(true)}
              onCancelAddForm={() => setShowAddForm(false)}
              onAddRecord={handleAddRecord}
              formatDate={formatDate}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
