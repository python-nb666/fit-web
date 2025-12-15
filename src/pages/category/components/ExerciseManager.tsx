import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icons } from '../../../components/Icons'

interface ExerciseManagerProps {
  categoryLabel: string
  exercises: string[]
  onAddExercise: (name: string) => void
  onRemoveExercise: (name: string) => void
  onReorder: (newOrder: string[]) => void
}

interface SortableItemProps {
  id: string
  onRemove: () => void
}

const SortableExerciseItem = ({ id, onRemove }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 group hover:border-white/30 transition-all cursor-move select-none touch-none"
    >
      <span className="text-gray-300">{id}</span>
      <button
        onClick={(e) => {
          e.stopPropagation() // Prevent drag start when clicking remove
          onRemove()
        }}
        // Using onPointerDown to stop propagation for dnd-kit which uses pointer events
        onPointerDown={(e) => e.stopPropagation()}
        className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Icons.X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ExerciseManager: React.FC<ExerciseManagerProps> = ({
  categoryLabel,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onReorder
}) => {
  const [newExerciseName, setNewExerciseName] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag, prevents accidental drags on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = exercises.indexOf(active.id as string)
      const newIndex = exercises.indexOf(over.id as string)
      onReorder(arrayMove(exercises, oldIndex, newIndex))
    }
  }

  const handleAdd = () => {
    if (newExerciseName.trim()) {
      onAddExercise(newExerciseName.trim())
      setNewExerciseName('')
    }
  }

  return (
    <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] animate-fade-in">
      <h3 className="text-lg font-bold mb-4 text-purple-400">管理{categoryLabel}动作</h3>

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
          onClick={handleAdd}
          disabled={!newExerciseName.trim()}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加
        </button>
      </div>

      {/* Exercise List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={exercises}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-2">
            {exercises.map((exercise) => (
              <SortableExerciseItem
                key={exercise}
                id={exercise}
                onRemove={() => onRemoveExercise(exercise)}
              />
            ))}
            {exercises.length === 0 && (
              <span className="text-gray-500 text-sm">暂无动作，请添加</span>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
