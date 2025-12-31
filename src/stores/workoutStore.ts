import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WorkoutCategory, WorkoutRecord } from "../types/workout";

import { getExercises } from "../api/exercises";

const INITIAL_EXERCISES: Record<WorkoutCategory, string[]> = {
  chest: [],
  back: [],
  shoulders: [],
  legs: [],
  arms: [],
  core: [],
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
  fetchExercises: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      records: [],
      exercises: INITIAL_EXERCISES,

      fetchExercises: async () => {
        try {
          const data = await getExercises();
          set({ exercises: data });
        } catch (error) {
          console.error("Failed to fetch exercises", error);
        }
      },

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
