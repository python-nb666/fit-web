import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
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
import { ClearLocalModal } from './components/ClearLocalModal'
import { LastWorkoutSummary } from './components/LastWorkoutSummary'
import { useWorkoutStore } from '../../stores/workoutStore'
import { formatDate } from '../../utils/date'

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

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function Home() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  // Validate categoryId
  const selectedCategory = categories.some(c => c.id === categoryId)
    ? (categoryId as WorkoutCategory)
    : null

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Store
  const {
    records,
    exercises,
    addRecord,
    deleteRecord,
    updateRecord,
    addExercise,
    removeExercise
  } = useWorkoutStore()

  // Exercise Manager State
  const [showExerciseManager, setShowExerciseManager] = useState(false)

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
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false)

  // Helpers

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
    addExercise(selectedCategory, name)
  }

  const handleRemoveExercise = (name: string) => {
    if (!selectedCategory) return
    removeExercise(selectedCategory, name)
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
    addRecord(newRecord)
  }

  const handleDeleteRecord = (id: string) => {
    deleteRecord(id)
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
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearCacheConfirm(true)}
                  className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors text-red-400 hover:text-red-300 group"
                  title="清除缓存"
                >
                  <Icons.Trash className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <Link
                  to="/body-fat"
                  className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors text-purple-400 hover:text-purple-300 group"
                  title="体脂记录"
                >
                  <Icons.TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Last Workout Summary */}
            <LastWorkoutSummary records={records} categories={categories} />
          </header>
        )}

        <main>
          {/* CATEGORY GRID */}
          {!selectedCategory && (
            <CategoryGrid categories={categories} />
          )}

          {/* RECORDS VIEW */}
          {selectedCategory && activeCategoryConfig && (
            <div className="animate-fade-in">
              {/* Detail Navigation Header */}
              <CategoryDetailHeader
                activeCategoryConfig={activeCategoryConfig}
                lastWorkoutInfo={getLastWorkoutInfo()}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onBack={() => {
                  navigate('/')
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
                    updateRecord(editingRecord.id, data)
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
        {/* Clear Cache Confirmation Modal */}
        <ClearLocalModal showClearCacheConfirm={showClearCacheConfirm} setShowClearCacheConfirm={setShowClearCacheConfirm} />
      </div>
    </div>
  )
}
