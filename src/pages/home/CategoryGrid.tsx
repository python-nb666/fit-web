import { Link } from 'react-router-dom'
import type { WorkoutCategory } from '../../types/workout'

interface Props {
  categories: { id: WorkoutCategory; label: string; icon: React.FC<any>; color: string }[]
}

export default function CategoryGrid(props: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {props.categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/${cat.id}`}
          className="group relative flex flex-col justify-between p-6 h-40 md:h-48 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
          {/* Decorative Background Icon */}
          <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-12`}>
            <cat.icon className={`w-32 h-32 ${cat.color}`} />
          </div>

          {/* Icon Container */}
          <div className={`w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <cat.icon className={`w-6 h-6 ${cat.color}`} />
          </div>

          {/* Label & Arrow */}
          <div className="relative w-full flex items-end justify-between z-10">
            <span className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white transition-colors tracking-wide">
              {cat.label}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <span className="text-white/50 text-lg leading-none">↗</span>
            </div>
          </div>

          {/* Active State Overlay */}
          <div className="absolute inset-0 bg-white/0 active:bg-white/5 transition-colors pointer-events-none" />
        </Link>
      ))}
    </div>
  )
}