import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WorkoutCategory, WorkoutRecord } from "../types/workout";

export const DEFAULT_EXERCISES: Record<WorkoutCategory, string[]> = {
  chest: ["杠铃卧推", "哑铃卧推", "上斜卧推", "双杠臂屈伸", "绳索夹胸"],
  back: ["引体向上", "杠铃划船", "高位下拉", "坐姿划船", "直臂下压"],
  shoulders: ["坐姿推举", "哑铃侧平举", "面拉", "前平举", "反向飞鸟"],
  legs: ["深蹲", "硬拉", "腿举", "哈克深蹲", "腿屈伸"],
  arms: ["杠铃弯举", "哑铃弯举", "绳索下压", "仰卧臂屈伸"],
  core: ["卷腹", "平板支撑", "悬垂举腿", "俄罗斯转体"],
};

interface WorkoutState {
  records: WorkoutRecord[];
  exercises: Record<WorkoutCategory, string[]>;

  // Actions
  addRecord: (record: WorkoutRecord) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, data: Partial<WorkoutRecord>) => void;
  addExercise: (category: WorkoutCategory, name: string) => void;
  removeExercise: (category: WorkoutCategory, name: string) => void;
  reorderExercises: (category: WorkoutCategory, newOrder: string[]) => void;
  clearRecords: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      records: [],
      exercises: DEFAULT_EXERCISES,

      addRecord: (record) =>
        set((state) => ({
          records: [record, ...state.records],
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      updateRecord: (id, data) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      addExercise: (category, name) =>
        set((state) => {
          const current = state.exercises[category] || [];
          if (current.includes(name)) return state;
          return {
            exercises: {
              ...state.exercises,
              [category]: [...current, name],
            },
          };
        }),

      removeExercise: (category, name) =>
        set((state) => ({
          exercises: {
            ...state.exercises,
            [category]: (state.exercises[category] || []).filter(
              (e) => e !== name
            ),
          },
        })),

      reorderExercises: (category, newOrder) =>
        set((state) => ({
          exercises: {
            ...state.exercises,
            [category]: newOrder,
          },
        })),

      clearRecords: () => set({ records: [] }),
    }),
    {
      name: "fit_storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Optional: Migrate old data if needed, but for now we assume fresh start or compatible data
      // partialize: (state) => ({ records: state.records, exercises: state.exercises }),
    }
  )
);
