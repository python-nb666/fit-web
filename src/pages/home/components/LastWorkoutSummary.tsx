import React from 'react'
import { Icons } from '@/components/Icons'
import type { WorkoutRecord, WorkoutCategory } from '@/types/workout'
import { formatDate } from '@/utils/date'
import { useWorkoutStore } from '@/stores/workoutStore'

export interface CategoryConfig {
  id: WorkoutCategory
  label: string
  icon: React.FC<any>
  color: string
}

interface LastWorkoutSummaryProps {
  categories: CategoryConfig[]
}

export const LastWorkoutSummary: React.FC<LastWorkoutSummaryProps> = ({ categories }) => {
  // Store
  const { records } = useWorkoutStore()
  let lastRecord: WorkoutRecord | null = null
  let categoryConfig: CategoryConfig | undefined | null = null
  let message = ''
  let emoji = ''
  let textColor = 'text-gray-400'
  let dateDisplay = ''
  let label = ''
  let IconComponent: React.ElementType = Icons.TrendingUp
  let iconColorClass = 'text-purple-400'
  let iconBgClass = 'bg-purple-500/10'

  if (records.length > 0) {
    const sortedRecords = [...records].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date)
      return parseInt(b.id) - parseInt(a.id)
    })
    lastRecord = sortedRecords[0] as WorkoutRecord
    categoryConfig = categories.find(c => c.id === lastRecord!.category)

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const diffTime = new Date(todayStr).getTime() - new Date(lastRecord!.date).getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    dateDisplay = formatDate(lastRecord!.date)
    label = categoryConfig?.label || lastRecord!.category
    if (categoryConfig) {
      IconComponent = categoryConfig.icon
      iconColorClass = categoryConfig.color
      iconBgClass = `${categoryConfig.color.replace('text-', 'bg-')}/10`
    }

    if (diffDays === 0) {
      message = '今天已完成训练，继续保持！'
      emoji = '😀'
      textColor = 'text-green-400'
    } else if (diffDays === 1) {
      message = '今天还没有锻炼，加油！'
      emoji = '😅'
      textColor = 'text-blue-400'
    } else {
      message = `您已经 ${diffDays} 天没有锻炼过了`
      if (diffDays <= 3) emoji = '🤨'
      else if (diffDays <= 7) emoji = '😒'
      else emoji = '🤬'
      textColor = 'text-orange-400'
    }
  } else {
    // No records case
    message = '今天还没有锻炼，加油！'
    emoji = '👋'
    textColor = 'text-blue-400'
    dateDisplay = formatDate(new Date().toISOString().split('T')[0])
    label = '开始记录'
  }

  return (
    <div className="bg-white/3 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {records.length > 0 ? 'Last Workout' : 'Status'}
        </span>
        <span className="text-xs text-gray-600 font-mono">{dateDisplay}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${iconBgClass} ${iconColorClass}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">
            {label}
          </div>
          <div className={`text-sm ${textColor} flex items-center gap-1.5`}>
            <span>{emoji}</span>
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
