import { useState } from 'react'
import { CustomSelect } from './CustomSelect'

interface AddRecordFormProps {
  exercises: string[]
  onSave: (data: { exercise: string; sets: number; reps: number; weight: number }) => void
  onCancel: () => void
}

export function AddRecordForm({ exercises, onSave, onCancel }: AddRecordFormProps) {
  const [formData, setFormData] = useState({
    exercise: '',
    sets: 0,
    reps: 0,
    weight: 0,
  })

  const handleSave = () => {
    onSave(formData)
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
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={!formData.exercise}
          className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存
        </button>
      </div>
    </div>
  )
}
