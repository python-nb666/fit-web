import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import type { WorkoutCategory, WorkoutRecord } from "../types/workout";

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
  exerciseIdMap: Record<string, number>;

  // Actions
  setRecords: (records: WorkoutRecord[]) => void;
  setExercises: (
    exercises: Record<WorkoutCategory, string[]>,
    idMap: Record<string, number>
  ) => void;
  addRecord: (record: WorkoutRecord) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, data: Partial<WorkoutRecord>) => void;
  addExercise: (category: WorkoutCategory, name: string) => void;
  removeExercise: (category: WorkoutCategory, name: string) => void;
  reorderExercises: (category: WorkoutCategory, newOrder: string[]) => void;
  clearRecords: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set) => ({
        records: [],
        exercises: INITIAL_EXERCISES,
        exerciseIdMap: {},

        setRecords: (records) => set({ records }),

        setExercises: (exercises, idMap) =>
          set({ exercises, exerciseIdMap: idMap }),

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
        name: "fit_storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
