import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import type { WorkoutCategory, WorkoutRecord } from "../types/workout";

import { getExercises } from "../api/exercises";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../api/records";

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
  addRecord: (record: WorkoutRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  updateRecord: (id: string, data: Partial<WorkoutRecord>) => Promise<void>;
  addExercise: (category: WorkoutCategory, name: string) => void;
  removeExercise: (category: WorkoutCategory, name: string) => void;
  reorderExercises: (category: WorkoutCategory, newOrder: string[]) => void;
  clearRecords: () => void;
  fetchExercises: () => Promise<void>;
  fetchRecords: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set, get) => ({
        records: [],
        exercises: INITIAL_EXERCISES,
        exerciseIdMap: {},

        fetchExercises: async () => {
          try {
            const { categories, idMap } = await getExercises();
            set({ exercises: categories, exerciseIdMap: idMap });
          } catch (error) {
            console.error("Failed to fetch exercises", error);
          }
        },

        fetchRecords: async () => {
          try {
            const apiRecords = await getRecords(1); // Hardcoded userId 1
            const transformedRecords: WorkoutRecord[] = apiRecords.map(
              (r: any) => {
                const workoutDate = new Date(r.workoutTime);
                return {
                  id: r.id.toString(),
                  category: r.exercise.category.slug as WorkoutCategory,
                  exercise: r.exercise.name,
                  sets: r.sets,
                  reps: r.reps,
                  weight: r.weight,
                  weightUnit: r.weightUnit as any,
                  date: workoutDate.toISOString().split("T")[0],
                  time: workoutDate.toTimeString().split(" ")[0],
                };
              }
            );
            set({ records: transformedRecords });
          } catch (error) {
            console.error("Failed to fetch records", error);
          }
        },

        addRecord: async (record) => {
          // Optimistic update
          set((state) => ({
            records: [record, ...state.records],
          }));

          try {
            const state = get();
            const exerciseId = state.exerciseIdMap[record.exercise];

            if (exerciseId) {
              await createRecord({
                userId: 1, // Hardcoded for now
                exerciseId,
                reps: record.reps,
                weight: record.weight,
                weightUnit: record.weightUnit,
                sets: record.sets,
                date: record.date,
                time: record.time || "00:00:00",
              });
            } else {
              console.error("Exercise ID not found for", record.exercise);
            }
          } catch (error) {
            console.error("Failed to save record to API", error);
          }
        },

        deleteRecord: async (id) => {
          // Optimistic update
          set((state) => ({
            records: state.records.filter((r) => r.id !== id),
          }));

          try {
            await deleteRecord(id);
          } catch (error) {
            console.error("Failed to delete record from API", error);
          }
        },

        updateRecord: async (id, data) => {
          // Optimistic update
          set((state) => ({
            records: state.records.map((r) =>
              r.id === id ? { ...r, ...data } : r
            ),
          }));

          try {
            const payload: any = { ...data };
            // If date or time is updated, we should ideally re-calculate workoutTime on backend
            // For now, the backend updateRecord handles date/time if provided
            await updateRecord(id, payload);
          } catch (error) {
            console.error("Failed to update record in API", error);
          }
        },

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
      }
    )
  )
);
