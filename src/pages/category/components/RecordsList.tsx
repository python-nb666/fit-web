import React from 'react'
import { Icons } from '../../../components/Icons'
import type { WorkoutRecord } from '../../../types/workout'

interface RecordsListProps {
  groupedRecords: Record<string, WorkoutRecord[]>
  onEditExercise: (exerciseName: string) => void
  onLongPressRecord: (record: WorkoutRecord) => void
  showAddForm: boolean
}

export const RecordsList: React.FC<RecordsListProps> = ({
  groupedRecords,
  onEditExercise, // This is now "Add Set"
  onLongPressRecord,
  showAddForm
}) => {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTouchStart = (record: WorkoutRecord) => {
    timerRef.current = setTimeout(() => {
      onLongPressRecord(record)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Mouse events for desktop testing
  const handleMouseDown = (record: WorkoutRecord) => {
    timerRef.current = setTimeout(() => {
      onLongPressRecord(record)
    }, 500)
  }

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
  const [expandedExercises, setExpandedExercises] = React.useState<Set<string>>(new Set())

  const toggleExpand = (exercise: string) => {
    const newExpanded = new Set(expandedExercises)
    if (newExpanded.has(exercise)) {
      newExpanded.delete(exercise)
    } else {
      newExpanded.add(exercise)
    }
    setExpandedExercises(newExpanded)
  }

  if (Object.keys(groupedRecords).length === 0) {
    return !showAddForm ? (
      <div className="py-20 text-center">
        <p className="text-gray-600">今日无记录</p>
      </div>
    ) : null
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedRecords).map(([exercise, exerciseRecords]) => {
        const isExpanded = expandedExercises.has(exercise)
        const shouldCollapse = exerciseRecords.length > 4
        // Reverse first to show newest, then slice if needed
        const reversedRecords = [...exerciseRecords].reverse()
        const visibleRecords = shouldCollapse && !isExpanded
          ? reversedRecords.slice(0, 4)
          : reversedRecords

        return (
          <div
            key={exercise}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">{exercise}</h4>
              <span className="text-sm text-gray-500">{exerciseRecords.length} sets</span>
            </div>

            <div className="space-y-2">
              {visibleRecords.map((record, idx) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group select-none active:scale-[0.98] duration-200"
                  onTouchStart={() => handleTouchStart(record)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  onMouseDown={() => handleMouseDown(record)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="flex items-center gap-4 pointer-events-none">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-500 font-mono text-sm w-8">
                        #{exerciseRecords.length - idx}
                      </span>
                      {record.time && (
                        <span className="text-[10px] text-gray-600 font-mono">{record.time}</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">{record.reps}</span>
                      <span className="text-xs text-gray-500 uppercase">reps</span>
                    </div>
                    <span className="text-gray-600">×</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-medium text-purple-400">{record.weight}</span>
                      <span className="text-xs text-purple-400/70">{record.weightUnit || 'kg'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pointer-events-none">
                    <div className="text-right hidden md:block">
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Volume</div>
                      <div className="text-sm font-light text-gray-400">
                        {(record.reps * record.weight).toLocaleString()} {record.weightUnit || 'kg'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {shouldCollapse && (
              <button
                onClick={() => toggleExpand(exercise)}
                className="w-full mt-3 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.08] border border-white/[0.05] text-sm font-medium text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2 group"
              >
                {isExpanded ? (
                  <>
                    <span>收起记录</span>
                    <Icons.ChevronUp className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </>
                ) : (
                  <>
                    <span>展开剩余 {exerciseRecords.length - 4} 组</span>
                    <Icons.ChevronDown className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            )}

            {/* Quick Add Button */}
            <button
              onClick={() => onEditExercise(exercise)}
              className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-500 hover:text-purple-300 transition-all flex items-center justify-center gap-2 group"
            >
              <Icons.Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Add Set</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
