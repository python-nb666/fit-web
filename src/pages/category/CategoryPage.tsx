import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Icons } from '@/components/Icons'
import { ExerciseManager } from './components/ExerciseManager'
import { AddRecordForm } from './components/AddRecordForm'
import { RecordsList } from './components/RecordsList'
import { CategoryDetailHeader } from '@/pages/home/CategoryDetailHeader'
import { QuickRecordPopup } from './components/QuickRecordPopup'
import { RecordActionMenu } from './components/RecordActionMenu'
import type { WorkoutCategory, WorkoutRecord, WeightUnit } from '@/types/workout'
import { useWorkoutStore } from '@/stores/workoutStore'
import { categories } from '@/constants/categories'

export default function CategoryPage() {
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
    removeExercise,
    reorderExercises
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
  const [quickAddInitialValues, setQuickAddInitialValues] = useState<{ reps: number; weight: number; weightUnit: WeightUnit } | undefined>(undefined)
  const [activeRecordForMenu, setActiveRecordForMenu] = useState<WorkoutRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<WorkoutRecord | null>(null)

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

  // Calculate previous max weights for comparison
  const previousMaxWeights: Record<string, number> = {}

  Object.keys(groupedRecords).forEach(exercise => {
    // Filter records for this exercise that are BEFORE the selected date
    const previousRecords = records.filter(r =>
      r.exercise === exercise &&
      r.date < selectedDate
    )

    if (previousRecords.length > 0) {
      // Sort by date descending to find the most recent previous session
      previousRecords.sort((a, b) => b.date.localeCompare(a.date))
      const lastDate = previousRecords[0].date

      // Get all records for that last date
      const lastSessionRecords = previousRecords.filter(r => r.date === lastDate)

      // Find max weight
      const maxWeight = Math.max(...lastSessionRecords.map(r => r.weight))
      previousMaxWeights[exercise] = maxWeight
    }
  })

  if (!selectedCategory || !activeCategoryConfig) {
    return <div className="text-white text-center mt-20">Category not found</div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="animate-fade-in">
          {/* Detail Navigation Header */}
          {/* Detail Navigation Header */}
          <CategoryDetailHeader
            activeCategoryConfig={activeCategoryConfig}
            records={records}
            selectedCategory={selectedCategory}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onBack={() => {
              navigate('/')
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
              onReorder={(newOrder) => {
                if (selectedCategory) {
                  reorderExercises(selectedCategory, newOrder)
                }
              }}
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
            previousMaxWeights={previousMaxWeights}
            onEditExercise={(exercise) => {
              // Find last record for this exercise
              const exerciseRecords = records.filter(r => r.exercise === exercise).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || parseInt(b.id) - parseInt(a.id));
              const lastRecord = exerciseRecords[0];

              if (lastRecord) {
                setQuickAddInitialValues({
                  reps: lastRecord.reps,
                  weight: lastRecord.weight,
                  weightUnit: lastRecord.weightUnit
                })
              } else {
                setQuickAddInitialValues(undefined)
              }
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
              initialValues={quickAddInitialValues}
              submitLabel="Add Set"
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
              submitLabel="Update Set"
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
      </div>
    </div>
  )
}
