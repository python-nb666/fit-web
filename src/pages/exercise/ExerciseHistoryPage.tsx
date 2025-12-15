import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Icons } from '@/components/Icons'
import { useWorkoutStore } from '@/stores/workoutStore'
import { formatDate } from '@/utils/date'

import { getExerciseNameFromSlug } from '@/utils/exerciseMapping'

export default function ExerciseHistoryPage() {
  const { exerciseName } = useParams<{ exerciseName: string }>()
  const { records } = useWorkoutStore()

  const decodedExerciseName = getExerciseNameFromSlug(exerciseName || '')

  const chartData = useMemo(() => {
    if (!decodedExerciseName) return []

    // 1. Filter records for this exercise
    const exerciseRecords = records.filter(r => r.exercise === decodedExerciseName)

    // 2. Group by date and find max weight per day
    const maxWeightByDate = exerciseRecords.reduce((acc, record) => {
      const date = record.date
      if (!acc[date] || record.weight > acc[date]) {
        acc[date] = record.weight
      }
      return acc
    }, {} as Record<string, number>)

    // 3. Convert to array and sort by date
    return Object.entries(maxWeightByDate)
      .map(([date, weight]) => ({
        date,
        displayDate: formatDate(date),
        weight
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [records, decodedExerciseName])

  const maxWeightAllTime = useMemo(() => {
    if (chartData.length === 0) return 0
    return Math.max(...chartData.map(d => d.weight))
  }, [chartData])

  if (!decodedExerciseName) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -left-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link
              to={-1 as any}
              className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <Icons.ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{decodedExerciseName}</h1>
              <p className="text-purple-400 text-sm font-medium mt-1">历史最大重量记录</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-sm text-gray-500 mb-1">历史最佳</div>
            <div className="text-2xl font-bold text-white">{maxWeightAllTime} <span className="text-sm font-normal text-gray-500">kg</span></div>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-sm text-gray-500 mb-1">训练天数</div>
            <div className="text-2xl font-bold text-white">{chartData.length} <span className="text-sm font-normal text-gray-500">天</span></div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-10 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] h-[400px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" debounce={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  minTickGap={30}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  unit="kg"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#888', marginBottom: '4px' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              暂无数据
            </div>
          )}
        </div>

        {/* History List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold mb-4 text-white px-2">详细记录</h3>
          {[...chartData].reverse().map((record) => (
            <div
              key={record.date}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all"
            >
              <span className="text-gray-400 font-mono text-sm">{record.date}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{record.weight}</span>
                <span className="text-sm text-gray-500">kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
