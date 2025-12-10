import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../../components/Icons'
import { CustomSelect } from '../../components/CustomSelect'
import '../App.css'

// -----------------------------------------------------------------------------
// Configuration & Types
// -----------------------------------------------------------------------------

type WorkoutCategory = 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core'
type WeightUnit = 'kg' | 'lbs'

interface WorkoutRecord {
  id: string
  category: WorkoutCategory
  exercise: string
  sets: number
  reps: number
  weight: number
  weightUnit: WeightUnit
  date: string
}

const categories: { id: WorkoutCategory; label: string; icon: React.FC<any>; color: string }[] = [
  { id: 'chest', label: '胸部', icon: Icons.Chest, color: 'text-rose-400' },
  { id: 'back', label: '背部', icon: Icons.Back, color: 'text-sky-400' },
  { id: 'shoulders', label: '肩部', icon: Icons.Shoulders, color: 'text-amber-400' },
  { id: 'legs', label: '腿部', icon: Icons.Legs, color: 'text-emerald-400' },
  { id: 'arms', label: '手臂', icon: Icons.Arms, color: 'text-violet-400' },
  { id: 'core', label: '核心', icon: Icons.Core, color: 'text-indigo-400' },
]

const DEFAULT_EXERCISES: Record<WorkoutCategory, string[]> = {
  chest: ['杠铃卧推', '哑铃卧推', '上斜卧推', '双杠臂屈伸', '绳索夹胸'],
  back: ['引体向上', '杠铃划船', '高位下拉', '坐姿划船', '直臂下压'],
  shoulders: ['坐姿推举', '哑铃侧平举', '面拉', '前平举', '反向飞鸟'],
  legs: ['深蹲', '硬拉', '腿举', '哈克深蹲', '腿屈伸'],
  arms: ['杠铃弯举', '哑铃弯举', '绳索下压', '仰卧臂屈伸'],
  core: ['卷腹', '平板支撑', '悬垂举腿', '俄罗斯转体']
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Records State
  const [records, setRecords] = useState<WorkoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fit_records')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Exercises State
  const [exercises, setExercises] = useState<Record<WorkoutCategory, string[]>>(() => {
    try {
      const saved = localStorage.getItem('fit_exercises')
      return saved ? JSON.parse(saved) : DEFAULT_EXERCISES
    } catch (e) {
      return DEFAULT_EXERCISES
    }
  })

  // Exercise Manager State
  const [showExerciseManager, setShowExerciseManager] = useState(false)
  const [newExerciseName, setNewExerciseName] = useState('')

  useEffect(() => {
    localStorage.setItem('fit_records', JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem('fit_exercises', JSON.stringify(exercises))
  }, [exercises])

  // Reset state when entering a category
  useEffect(() => {
    if (selectedCategory) {
      setSelectedDate(new Date().toISOString().split('T')[0])
      setShowAddForm(false)
      setShowExerciseManager(false)
    }
  }, [selectedCategory])

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    exercise: '',
    reps: 0,
    weight: 0,
    weightUnit: 'kg' as WeightUnit
  })

  // Helpers
  const changeDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateString = date.toISOString().split('T')[0]
    const todayString = today.toISOString().split('T')[0]
    const yesterdayString = yesterday.toISOString().split('T')[0]

    if (dateString === todayString) return '今天'
    if (dateString === yesterdayString) return '昨天'
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const getLastWorkoutInfo = () => {
    if (!selectedCategory) return null

    const today = new Date().toISOString().split('T')[0]

    // Filter records for this category, excluding today
    const historyDates = records
      .filter(r => r.category === selectedCategory && r.date < today)
      .map(r => r.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort desc

    if (historyDates.length === 0) return '首次训练'

    const lastDate = historyDates[0]
    const diffTime = Math.abs(new Date(today).getTime() - new Date(lastDate).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return `上次训练：${diffDays}天前 (${formatDate(lastDate)})`
  }

  // Exercise Management Logic
  const handleAddExercise = () => {
    if (!newExerciseName.trim() || !selectedCategory) return
    const current = exercises[selectedCategory] || []
    if (current.includes(newExerciseName.trim())) return

    setExercises({
      ...exercises,
      [selectedCategory]: [...current, newExerciseName.trim()]
    })
    setNewExerciseName('')
  }

  const handleRemoveExercise = (name: string) => {
    if (!selectedCategory) return
    setExercises({
      ...exercises,
      [selectedCategory]: (exercises[selectedCategory] || []).filter(e => e !== name)
    })
  }

  // Record Logic
  const handleAddRecord = () => {
    if (!selectedCategory) return
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      category: selectedCategory,
      ...formData,
      sets: 1, // Always 1 set per record now
      date: selectedDate,
    }
    setRecords([newRecord, ...records])
    // Keep exercise selected, just reset reps/weight slightly or keep them for convenience? 
    // Usually people do similar weight/reps, so keeping might be better, but let's reset reps to 0 to encourage accuracy
    // setFormData({ ...formData, reps: 0 }) 
  }

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id))
  }

  const activeCategoryConfig = categories.find(c => c.id === selectedCategory)
  const currentRecords = records.filter(r =>
    r.category === selectedCategory && r.date === selectedDate
  )
  const currentCategoryExercises = selectedCategory ? (exercises[selectedCategory] || []) : []

  // Group records by exercise
  const groupedRecords = currentRecords.reduce((acc, record) => {
    if (!acc[record.exercise]) {
      acc[record.exercise] = []
    }
    acc[record.exercise].push(record)
    return acc
  }, {} as Record<string, WorkoutRecord[]>)

  // Sort sets by time (id) - assuming id is timestamp
  Object.keys(groupedRecords).forEach(key => {
    groupedRecords[key].sort((a, b) => parseInt(a.id) - parseInt(b.id))
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">

        {/* HEADER */}
        {!selectedCategory && (
          <header className="mb-12 md:mb-16 animate-fade-in flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
                FitTracker<span className="text-purple-500">.</span>
              </h1>
              <p className="text-gray-500 text-lg tracking-wide">Minimalist Workout Log</p>
            </div>
            <Link
              to="/body-fat"
              className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors text-purple-400 hover:text-purple-300 group"
              title="体脂记录"
            >
              <Icons.TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Link>
          </header>
        )}

        <main>
          {/* CATEGORY GRID */}
          {!selectedCategory && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="group relative flex flex-col items-start justify-between p-6 h-40 md:h-48 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
                >
                  <div className={`p-3 rounded-2xl bg-white/[0.03] group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon className={`w-6 h-6 ${cat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="w-full flex items-end justify-between">
                    <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">
                      {cat.label}
                    </span>
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-white/50">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* RECORDS VIEW */}
          {selectedCategory && activeCategoryConfig && (
            <div className="animate-fade-in">
              {/* Detail Navigation Header */}
              <div className="flex flex-col gap-6 mb-10">
                {/* Top Row: Back & Title */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setShowAddForm(false)
                    }}
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
                      <div className="text-base text-purple-300 font-medium mt-1">{getLastWorkoutInfo()}</div>
                    </div>
                    {/* Mobile View for Title/Info */}
                    <div className="md:hidden">
                      <div className="text-2xl font-bold text-right">{activeCategoryConfig.label}</div>
                      <div className="text-sm text-purple-300 font-medium text-right mt-1">{getLastWorkoutInfo()}</div>
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
                        onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
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
                    onClick={() => setShowExerciseManager(!showExerciseManager)}
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

              {/* Exercise Manager Section */}
              {showExerciseManager && (
                <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] animate-fade-in">
                  <h3 className="text-lg font-bold mb-4 text-purple-400">管理{activeCategoryConfig.label}动作</h3>

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
                      onClick={handleAddExercise}
                      disabled={!newExerciseName.trim()}
                      className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加
                    </button>
                  </div>

                  {/* Exercise List */}
                  <div className="flex flex-wrap gap-2">
                    {currentCategoryExercises.map((exercise) => (
                      <div key={exercise} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 group hover:border-white/30 transition-all">
                        <span className="text-gray-300">{exercise}</span>
                        <button
                          onClick={() => handleRemoveExercise(exercise)}
                          className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {currentCategoryExercises.length === 0 && (
                      <span className="text-gray-500 text-sm">暂无动作，请添加</span>
                    )}
                  </div>
                </div>
              )}

              {/* Add Form Toggle */}
              {!showAddForm && !showExerciseManager && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-4 mb-8 rounded-2xl border border-dashed border-white/20 text-gray-500 hover:text-white hover:border-white/40 hover:bg-white/[0.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Icons.Plus className="w-5 h-5" />
                  <span>添加新记录</span>
                </button>
              )}

              {/* Add Form */}
              {showAddForm && (
                <div className="mb-10 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                      <CustomSelect
                        label="Exercise"
                        placeholder="选择动作..."
                        value={formData.exercise}
                        onChange={(val) => setFormData({ ...formData, exercise: val as string })}
                        options={currentCategoryExercises.map(e => ({ value: e, label: e }))}
                      />
                      {currentCategoryExercises.length === 0 && (
                        <p className="text-xs text-red-400 mt-2">
                          当前无可用动作，请先点击右上角设置图标添加动作。
                        </p>
                      )}
                    </div>

                    {/* Show recent sets for this exercise if selected */}
                    {formData.exercise && groupedRecords[formData.exercise] && (
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
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
                    >
                      完成
                    </button>
                    <button
                      onClick={handleAddRecord}
                      disabled={!formData.exercise || !formData.reps}
                      className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加一组
                    </button>
                  </div>
                </div>
              )}

              {/* Records List (Grouped) */}
              <div className="space-y-6">
                {Object.keys(groupedRecords).length === 0 ? (
                  !showAddForm && (
                    <div className="py-20 text-center">
                      <p className="text-gray-600">今日无记录</p>
                    </div>
                  )
                ) : (
                  Object.entries(groupedRecords).map(([exercise, exerciseRecords]) => (
                    <div
                      key={exercise}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, exercise }))
                        setShowAddForm(true)
                      }}
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
                                onClick={() => handleDeleteRecord(record.id)}
                                className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Icons.X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
