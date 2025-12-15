import React, { useState } from 'react'
import { Icons } from '../../../components/Icons'

interface ExerciseManagerProps {
  categoryLabel: string
  exercises: string[]
  onAddExercise: (name: string) => void
  onRemoveExercise: (name: string) => void
}

export const ExerciseManager: React.FC<ExerciseManagerProps> = ({
  categoryLabel,
  exercises,
  onAddExercise,
  onRemoveExercise
}) => {
  const [newExerciseName, setNewExerciseName] = useState('')

  const handleAdd = () => {
    if (newExerciseName.trim()) {
      onAddExercise(newExerciseName.trim())
      setNewExerciseName('')
    }
  }

  return (
    <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] animate-fade-in">
      <h3 className="text-lg font-bold mb-4 text-purple-400">管理{categoryLabel}动作</h3>

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
          onClick={handleAdd}
          disabled={!newExerciseName.trim()}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加
        </button>
      </div>

      {/* Exercise List */}
      <div className="flex flex-wrap gap-2">
        {exercises.map((exercise) => (
          <div key={exercise} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 group hover:border-white/30 transition-all">
            <span className="text-gray-300">{exercise}</span>
            <button
              onClick={() => onRemoveExercise(exercise)}
              className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {exercises.length === 0 && (
          <span className="text-gray-500 text-sm">暂无动作，请添加</span>
        )}
      </div>
    </div>
  )
}
