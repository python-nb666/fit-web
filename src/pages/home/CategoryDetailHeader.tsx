import React from 'react'
import { Icons } from '../../components/Icons'
import { formatDate } from '../../utils/date'

interface CategoryDetailHeaderProps {
  activeCategoryConfig: { label: string; icon: React.FC<any>; color: string }
  lastWorkoutInfo: string | null
  selectedDate: string
  onDateChange: (newDate: string) => void
  onBack: () => void
  showExerciseManager: boolean
  onToggleExerciseManager: () => void
}

export const CategoryDetailHeader: React.FC<CategoryDetailHeaderProps> = ({
  activeCategoryConfig,
  lastWorkoutInfo,
  selectedDate,
  onDateChange,
  onBack,
  showExerciseManager,
  onToggleExerciseManager
}) => {
  const changeDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    onDateChange(date.toISOString().split('T')[0])
  }



  return (
    <div className="flex flex-col gap-6 mb-10">
      {/* Top Row: Back & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 transition-colors">
            <Icons.ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wider">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-3xl font-bold">{activeCategoryConfig.label}</div>
            <div className="text-base text-purple-300 font-medium mt-1">{lastWorkoutInfo}</div>
          </div>
          {/* Mobile View for Title/Info */}
          <div className="md:hidden">
            <div className="text-2xl font-bold text-right">{activeCategoryConfig.label}</div>
            <div className="text-sm text-purple-300 font-medium text-right mt-1">{lastWorkoutInfo}</div>
          </div>
          <activeCategoryConfig.icon className={`w-10 h-10 ${activeCategoryConfig.color}`} />
        </div>
      </div>

      {/* Date Navigator & Manage Button */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center justify-between bg-white/[0.03] rounded-2xl p-2 border border-white/[0.05]">
          <button
            onClick={() => changeDate(-1)}
            className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Icons.ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative group cursor-pointer">
            <div className="text-center">
              <div className="text-lg font-medium text-white">{formatDate(selectedDate)}</div>
              {formatDate(selectedDate) !== selectedDate && (
                <div className="text-xs text-gray-500 font-mono">{selectedDate}</div>
              )}
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <button
            onClick={() => changeDate(1)}
            className="p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Icons.ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onToggleExerciseManager}
          className={`p-4 rounded-2xl border transition-all duration-300 ${showExerciseManager
            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
            : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06] text-gray-400 hover:text-white'
            }`}
          title="管理动作"
        >
          <Icons.Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
