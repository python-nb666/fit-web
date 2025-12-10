import React from 'react'
import { Icons } from '../../components/Icons'
import type { WorkoutRecord } from '../../types/workout'

interface RecordsListProps {
  groupedRecords: Record<string, WorkoutRecord[]>
  onEditExercise: (exerciseName: string) => void
  onDeleteRecord: (id: string) => void
  showAddForm: boolean
}

export const RecordsList: React.FC<RecordsListProps> = ({
  groupedRecords,
  onEditExercise,
  onDeleteRecord,
  showAddForm
}) => {
  if (Object.keys(groupedRecords).length === 0) {
    return !showAddForm ? (
      <div className="py-20 text-center">
        <p className="text-gray-600">今日无记录</p>
      </div>
    ) : null
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedRecords).map(([exercise, exerciseRecords]) => (
        <div
          key={exercise}
          onClick={() => onEditExercise(exercise)}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 cursor-pointer hover:bg-white/[0.04] hover:border-white/10 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-white">{exercise}</h4>
            <span className="text-sm text-gray-500">{exerciseRecords.length} sets</span>
          </div>

          <div className="space-y-2">
            {exerciseRecords.map((record, idx) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-mono text-sm w-8">#{idx + 1}</span>
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

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Volume</div>
                    <div className="text-sm font-light text-gray-400">
                      {(record.reps * record.weight).toLocaleString()} {record.weightUnit || 'kg'}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
