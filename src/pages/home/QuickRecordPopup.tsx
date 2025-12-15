import React, { useState, useEffect } from 'react'
import { Icons } from '../../components/Icons'
import type { WeightUnit } from '../../types/workout'

interface QuickRecordPopupProps {
  exercise: string
  initialValues?: { reps: number; weight: number; weightUnit: WeightUnit }
  onSave: (data: { reps: number; weight: number; weightUnit: WeightUnit }) => void
  onClose: () => void
  submitLabel?: string
}

export const QuickRecordPopup: React.FC<QuickRecordPopupProps> = ({
  exercise,
  initialValues,
  onSave,
  onClose,
  submitLabel = initialValues ? 'Update Set' : 'Add Set'
}) => {
  const [reps, setReps] = useState(0)
  const [weight, setWeight] = useState(0)
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg')

  useEffect(() => {
    if (initialValues) {
      setReps(initialValues.reps)
      setWeight(initialValues.weight)
      setWeightUnit(initialValues.weightUnit)
    }
  }, [initialValues])

  const handleSave = () => {
    if (reps > 0) {
      onSave({ reps, weight, weightUnit })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-t-3xl p-6 shadow-2xl animate-slide-up border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{exercise}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Reps */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Reps</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setReps(Math.max(0, reps - 1))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <Icons.Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={reps || ''}
                onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                className="flex-1 min-w-0 bg-transparent text-center text-2xl font-bold text-white outline-none"
                placeholder="0"
              />
              <button
                onClick={() => setReps(reps + 1)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <Icons.Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {[8, 10, 12].map(num => (
                <button
                  key={num}
                  onClick={() => setReps(num)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${reps === num ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Weight</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWeight(Math.max(0, weight - 2.5))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <Icons.Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="flex-1 min-w-0 bg-transparent text-center text-2xl font-bold text-white outline-none"
                placeholder="0"
              />
              <button
                onClick={() => setWeight(weight + 2.5)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <Icons.Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Sliding Unit Toggle */}
            <div className="flex justify-center mt-3">
              <div className="relative flex bg-white/5 rounded-lg p-1 cursor-pointer">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-purple-600 rounded-md transition-all duration-300 ease-out ${weightUnit === 'kg' ? 'left-1' : 'left-[calc(50%+0px)]'
                    }`}
                />
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`relative z-10 px-4 py-1 text-xs font-medium transition-colors duration-300 ${weightUnit === 'kg' ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`relative z-10 px-4 py-1 text-xs font-medium transition-colors duration-300 ${weightUnit === 'lbs' ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={reps === 0}
          className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
        >
          {submitLabel}
        </button>
        <div className="h-6" /> {/* Safe area spacer */}
      </div>
    </div>
  )
}
