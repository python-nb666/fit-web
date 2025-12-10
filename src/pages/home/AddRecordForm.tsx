import React, { useState, useEffect } from 'react'
import { CustomSelect } from '../../components/CustomSelect'
import type { WorkoutRecord, WeightUnit } from '../../types/workout'

interface AddRecordFormProps {
  exercises: string[]
  initialExercise?: string
  groupedRecords: Record<string, WorkoutRecord[]>
  onSave: (data: { exercise: string; reps: number; weight: number; weightUnit: WeightUnit }) => void
  onCancel: () => void
  onOpenExerciseManager: () => void
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({
  exercises,
  initialExercise = '',
  groupedRecords,
  onSave,
  onCancel,
  onOpenExerciseManager
}) => {
  const [formData, setFormData] = useState({
    exercise: initialExercise,
    reps: 0,
    weight: 0,
    weightUnit: 'kg' as WeightUnit
  })

  useEffect(() => {
    if (initialExercise) {
      setFormData(prev => ({ ...prev, exercise: initialExercise }))
    }
  }, [initialExercise])

  const handleSave = () => {
    if (formData.exercise && formData.reps) {
      onSave(formData)
    }
  }

  return (
    <div className="mb-10 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="md:col-span-2">
          <CustomSelect
            label="Exercise"
            placeholder="选择动作..."
            value={formData.exercise}
            onChange={(val) => setFormData({ ...formData, exercise: val as string })}
            options={exercises.map(e => ({ value: e, label: e }))}
          />
          {exercises.length === 0 && (
            <p className="text-xs text-red-400 mt-2 cursor-pointer" onClick={onOpenExerciseManager}>
              当前无可用动作，请先点击此处或右上角设置图标添加动作。
            </p>
          )}
        </div>

        {formData.exercise && groupedRecords[formData.exercise] && groupedRecords[formData.exercise].length > 0 && (
          <div className="md:col-span-2 mb-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">今日已记录组数</label>
            <div className="flex flex-wrap gap-2">
              {groupedRecords[formData.exercise].map((record, idx) => (
                <div key={record.id} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-purple-400 font-mono">#{idx + 1}</span>
                  <span>{record.reps} x {record.weight}{record.weightUnit || 'kg'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <CustomSelect
            label="Reps"
            placeholder="0"
            value={formData.reps || ''}
            onChange={(val) => setFormData({ ...formData, reps: val as number })}
            options={Array.from({ length: 30 }, (_, i) => i + 1).map(num => ({ value: num, label: num.toString() }))}
          />
          <div className="flex gap-2 mt-2">
            {[6, 8, 10, 12].map(num => (
              <button
                key={num}
                onClick={() => setFormData({ ...formData, reps: num })}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              className="flex-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base placeholder-white/20"
              placeholder="0"
            />
            <div className="flex bg-black/20 rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setFormData({ ...formData, weightUnit: 'kg' })}
                className={`px-3 rounded-lg text-sm font-medium transition-all ${formData.weightUnit === 'kg' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'
                  }`}
              >
                kg
              </button>
              <button
                onClick={() => setFormData({ ...formData, weightUnit: 'lbs' })}
                className={`px-3 rounded-lg text-sm font-medium transition-all ${formData.weightUnit === 'lbs' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'
                  }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
        >
          完成
        </button>
        <button
          onClick={handleSave}
          disabled={!formData.exercise || !formData.reps}
          className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加一组
        </button>
      </div>
    </div>
  )
}
