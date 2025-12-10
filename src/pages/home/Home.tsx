import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../../components/Icons'
import '../../App.css'
import CategoryGrid from './CategoryGrid'
import { ExerciseManager } from './ExerciseManager'
import { AddRecordForm } from './AddRecordForm'
import { RecordsList } from './RecordsList'
import { CategoryDetailHeader } from './CategoryDetailHeader'
import { QuickRecordPopup } from './QuickRecordPopup'
import { RecordActionMenu } from './RecordActionMenu'
import type { WorkoutCategory, WorkoutRecord, WeightUnit } from '../../types/workout'

// -----------------------------------------------------------------------------
// Configuration & Types
// -----------------------------------------------------------------------------

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
// Main Component
// -----------------------------------------------------------------------------

export function Home() {
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
  const [initialExerciseForForm, setInitialExerciseForForm] = useState('')
  const [quickAddExercise, setQuickAddExercise] = useState<string | null>(null)
  const [activeRecordForMenu, setActiveRecordForMenu] = useState<WorkoutRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<WorkoutRecord | null>(null)

  // Helpers

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
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort desc

    if (historyDates.length === 0) return '首次训练'

    const lastDate = historyDates[0]
    const diffTime = Math.abs(new Date(today).getTime() - new Date(lastDate).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return `上次训练：${diffDays}天前 (${formatDate(lastDate)})`
  }

  // Exercise Management Logic
  const handleAddExercise = (name: string) => {
    if (!name || !selectedCategory) return
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
  const handleAddRecord = (data: { exercise: string; reps: number; weight: number; weightUnit: WeightUnit }) => {
    if (!selectedCategory) return
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      category: selectedCategory,
      ...data,
      sets: 1, // Always 1 set per record now
      date: selectedDate,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
    setRecords([newRecord, ...records])
  }

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id))
  }

  const activeCategoryConfig = categories.find(c => c.id === selectedCategory)
  const currentRecords = records.filter(r =>
    r.category === selectedCategory && r.date === selectedDate
  )
  const currentCategoryExercises = selectedCategory ? (exercises[selectedCategory] || []) : []

  // Group records by exercise
  const groupedRecords = currentRecords.reduce((acc, record) => {
    if (!acc[record.exercise]) {
      acc[record.exercise] = []
    }
    acc[record.exercise].push(record)
    return acc
  }, {} as Record<string, WorkoutRecord[]>)

  // Sort sets by time (id) - assuming id is timestamp
  Object.keys(groupedRecords).forEach(key => {
    groupedRecords[key].sort((a, b) => parseInt(a.id) - parseInt(b.id))
  })

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
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
                  FitTracker<span className="text-purple-500">.</span>
                </h1>
                <p className="text-gray-500 text-lg tracking-wide">Minimalist Workout Log</p>
              </div>
              <Link
                to="/body-fat"
                className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors text-purple-400 hover:text-purple-300 group"
                title="体脂记录"
              >
                <Icons.TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Last Workout Summary */}
            {(() => {
              if (records.length === 0) return null

              const sortedRecords = [...records].sort((a, b) => {
                if (a.date !== b.date) return b.date.localeCompare(a.date)
                return parseInt(b.id) - parseInt(a.id)
              })
              const lastRecord = sortedRecords[0]
              const categoryConfig = categories.find(c => c.id === lastRecord.category)

              const today = new Date()
              // const lastDate = new Date(lastRecord.date)
              const todayStr = today.toISOString().split('T')[0]

              // Calculate difference in days
              const diffTime = new Date(todayStr).getTime() - new Date(lastRecord.date).getTime()
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

              let message = ''
              let emoji = ''
              let textColor = 'text-gray-400'

              if (diffDays === 0) {
                message = '今天已完成训练，继续保持！'
                emoji = '🔥'
                textColor = 'text-green-400'
              } else if (diffDays === 1) {
                message = '今天还没有锻炼，加油！'
                emoji = '💪'
                textColor = 'text-blue-400'
              } else {
                message = `您已经 ${diffDays} 天没有锻炼过了`
                if (diffDays <= 3) emoji = '📅'
                else if (diffDays <= 7) emoji = '🕸️'
                else emoji = '🗿'
                textColor = 'text-orange-400'
              }

              return (
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Workout</span>
                    <span className="text-xs text-gray-600 font-mono">{lastRecord.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${categoryConfig?.color.replace('text-', 'bg-')}/10 ${categoryConfig?.color}`}>
                      {categoryConfig && <categoryConfig.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {categoryConfig?.label || lastRecord.category}
                      </div>
                      <div className={`text-sm ${textColor} flex items-center gap-1.5`}>
                        <span>{emoji}</span>
                        <span>{message}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </header>
        )}

        <main>
          {/* CATEGORY GRID */}
          {!selectedCategory && (
            <CategoryGrid setSelectedCategory={setSelectedCategory} categories={categories} />
          )}

          {/* RECORDS VIEW */}
          {selectedCategory && activeCategoryConfig && (
            <div className="animate-fade-in">
              {/* Detail Navigation Header */}
              <CategoryDetailHeader
                categoryLabel={activeCategoryConfig.label}
                CategoryIcon={activeCategoryConfig.icon}
                categoryColor={activeCategoryConfig.color}
                lastWorkoutInfo={getLastWorkoutInfo()}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onBack={() => {
                  setSelectedCategory(null)
                  setShowAddForm(false)
                }}
                showExerciseManager={showExerciseManager}
                onToggleExerciseManager={() => setShowExerciseManager(!showExerciseManager)}
              />

              {/* Exercise Manager Section */}
              {showExerciseManager && (
                <ExerciseManager
                  categoryLabel={activeCategoryConfig.label}
                  exercises={currentCategoryExercises}
                  onAddExercise={handleAddExercise}
                  onRemoveExercise={handleRemoveExercise}
                />
              )}

              {/* Add Form Toggle */}
              {!showAddForm && !showExerciseManager && (
                <button
                  onClick={() => {
                    setInitialExerciseForForm('')
                    setShowAddForm(true)
                  }}
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
                  initialExercise={initialExerciseForForm}
                  groupedRecords={groupedRecords}
                  onSave={(data) => {
                    handleAddRecord(data)
                    setShowAddForm(false)
                  }}
                  onCancel={() => setShowAddForm(false)}
                  onOpenExerciseManager={() => {
                    setShowAddForm(false)
                    setShowExerciseManager(true)
                  }}
                />
              )}

              {/* Records List (Grouped) */}
              <RecordsList
                groupedRecords={groupedRecords}
                onEditExercise={(exercise) => {
                  setQuickAddExercise(exercise)
                }}
                onLongPressRecord={(record) => {
                  setActiveRecordForMenu(record)
                }}
                showAddForm={showAddForm}
              />

              {/* Quick Record Popup (Add Set) */}
              {quickAddExercise && (
                <QuickRecordPopup
                  exercise={quickAddExercise}
                  onSave={(data) => {
                    handleAddRecord({ exercise: quickAddExercise, ...data })
                    setQuickAddExercise(null)
                  }}
                  onClose={() => setQuickAddExercise(null)}
                />
              )}

              {/* Quick Record Popup (Edit) */}
              {editingRecord && (
                <QuickRecordPopup
                  exercise={editingRecord.exercise}
                  initialValues={{
                    reps: editingRecord.reps,
                    weight: editingRecord.weight,
                    weightUnit: editingRecord.weightUnit
                  }}
                  onSave={(data) => {
                    // Update existing record
                    setRecords(records.map(r =>
                      r.id === editingRecord.id
                        ? { ...r, ...data }
                        : r
                    ))
                    setEditingRecord(null)
                  }}
                  onClose={() => setEditingRecord(null)}
                />
              )}

              {/* Action Menu */}
              {activeRecordForMenu && (
                <RecordActionMenu
                  onEdit={() => {
                    setEditingRecord(activeRecordForMenu)
                    setActiveRecordForMenu(null)
                  }}
                  onDelete={() => {
                    handleDeleteRecord(activeRecordForMenu.id)
                    setActiveRecordForMenu(null)
                  }}
                  onClose={() => setActiveRecordForMenu(null)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
