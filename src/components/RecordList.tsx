import type { WorkoutRecord } from '../types'

interface RecordListProps {
  records: WorkoutRecord[]
}

export function RecordList({ records }: RecordListProps) {
  if (records.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">今日无记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h4 className="text-lg font-medium text-gray-200 mb-2">{record.exercise}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
              <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400">{record.sets} sets</span>
              <span>×</span>
              <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400">{record.reps} reps</span>
              <span>@</span>
              <span className="text-purple-400">{record.weight}kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between md:block md:text-right border-t border-white/5 pt-3 md:border-0 md:pt-0">
            <div className="text-xs text-gray-600 uppercase tracking-wider md:mb-1">Volume</div>
            <div className="text-xl font-light text-white">
              {(record.sets * record.reps * record.weight).toLocaleString()} <span className="text-sm text-gray-600">kg</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
