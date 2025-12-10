import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Icons } from '../components/Icons'

interface BodyFatRecord {
  id: string
  date: string
  percentage: number
}

export default function BodyFat() {
  const [records, setRecords] = useState<BodyFatRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fit_bodyfat')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [percentage, setPercentage] = useState('')

  useEffect(() => {
    localStorage.setItem('fit_bodyfat', JSON.stringify(records))
  }, [records])

  const handleAdd = () => {
    if (!percentage || !date) return

    const newRecord = {
      id: Date.now().toString(),
      date,
      percentage: parseFloat(percentage)
    }

    // Add and sort by date
    const newRecords = [...records, newRecord].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    setRecords(newRecords)
    setPercentage('')
  }

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id))
  }

  // Prepare data for chart (already sorted)
  const chartData = records.map(r => ({
    date: new Date(r.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    value: r.percentage
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-emerald-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -left-[10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <Icons.ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">体脂记录</h1>
              <p className="text-emerald-400 text-sm font-medium mt-1">Body Fat Tracker</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-10 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] h-[400px]">
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#888', marginBottom: '4px' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              暂无数据，请添加记录
            </div>
          )}
        </div>

        {/* Add Entry Form */}
        <div className="mb-10 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
          <h3 className="text-lg font-bold mb-6 text-white">添加记录</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-emerald-500 outline-none transition-all text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">体脂率 (%)</label>
              <input
                type="number"
                step="0.1"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-emerald-500 outline-none transition-all text-white placeholder-white/20"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={!percentage || !date}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                记录
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold mb-4 text-white px-2">历史记录</h3>
          {records.length === 0 ? (
            <p className="text-gray-600 px-2">暂无历史记录</p>
          ) : (
            [...records].reverse().map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-mono text-sm">{record.date}</span>
                  <span className="text-xl font-bold text-white">{record.percentage}%</span>
                </div>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
