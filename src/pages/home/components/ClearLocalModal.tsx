import { Icons } from "../../../components/Icons";

export function ClearLocalModal({ showClearCacheConfirm, setShowClearCacheConfirm }: { showClearCacheConfirm: boolean, setShowClearCacheConfirm: (show: boolean) => void }) {
  return (
    <div>
      {showClearCacheConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1c1e] rounded-2xl w-full max-w-sm overflow-hidden border border-white/10 shadow-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Icons.Trash className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">确认清除所有数据？</h3>
              <p className="text-gray-400 text-sm mb-6">
                此操作将删除所有本地存储的训练记录和自定义动作。此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearCacheConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}