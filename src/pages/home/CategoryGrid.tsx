
import type { WorkoutCategory } from '../../types/workout'

interface Props {
  setSelectedCategory: (category: WorkoutCategory) => void
  categories: { id: WorkoutCategory; label: string; icon: React.FC<any>; color: string }[]
}

export default function CategoryGrid(props: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {props.categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => props.setSelectedCategory(cat.id)}
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
  )
}