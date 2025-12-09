import { useState } from 'react'

interface CustomSelectProps {
  value: string | number
  onChange: (value: string | number) => void
  options: { value: string | number; label: string }[]
  placeholder?: string
  label?: string
}

export function CustomSelect({ value, onChange, options, placeholder, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {label && <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</label>}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-500 outline-none transition-all text-base text-left flex items-center justify-between text-white group"
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {value ? options.find(o => o.value === value)?.label || value : placeholder || 'Select...'}
        </span>
        <span className={`text-gray-500 text-xs transition-transform duration-200 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/50 max-h-60 overflow-y-auto animate-fade-in backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between ${value === option.value ? 'text-purple-400 bg-white/[0.02]' : 'text-gray-300'
                }`}
            >
              <span>{option.label}</span>
              {value === option.value && <span className="text-purple-500">✓</span>}
            </button>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">暂无选项</div>
          )}
        </div>
      )}
    </div>
  )
}
