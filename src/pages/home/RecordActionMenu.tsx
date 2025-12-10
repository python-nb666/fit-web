import React from 'react'
import { Icons } from '../../components/Icons'

interface RecordActionMenuProps {
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export const RecordActionMenu: React.FC<RecordActionMenuProps> = ({
  onEdit,
  onDelete,
  onClose
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#1c1c1e] rounded-t-3xl p-4 shadow-2xl animate-slide-up border-t border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onEdit()
              onClose()
            }}
            className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Edit className="w-5 h-5" />
            编辑
          </button>
          <button
            onClick={() => {
              onDelete()
              onClose()
            }}
            className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Trash className="w-5 h-5" />
            删除
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-4 rounded-2xl bg-black/20 hover:bg-black/30 text-gray-400 font-medium text-lg transition-colors"
        >
          取消
        </button>
        <div className="h-6" />
      </div>
    </div>
  )
}
