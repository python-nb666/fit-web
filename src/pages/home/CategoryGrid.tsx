import { Link } from 'react-router-dom'
import type { WorkoutCategory } from '../../types/workout'
import { Card, CardContent } from "@/components/ui/card"
import { motion } from 'framer-motion'

interface Props {
  categories: { id: WorkoutCategory; label: string; icon: React.FC<any>; color: string }[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0.55, 0.45, 1]
    }
  }
}

export default function CategoryGrid(props: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      {props.categories.map((cat) => (
        <motion.div
          key={cat.id}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to={`/${cat.id}`} className="block group">
            <Card className="relative h-40 md:h-48 overflow-hidden border-white/10 bg-linear-to-br from-white/8 to-white/2 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-purple-500/10 rounded-3xl">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                {/* Decorative Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-12 pointer-events-none">
                  <cat.icon className={`w-32 h-32 ${cat.color}`} />
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}