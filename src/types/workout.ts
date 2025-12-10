export type WorkoutCategory =
  | "chest"
  | "back"
  | "shoulders"
  | "legs"
  | "arms"
  | "core";

export type WeightUnit = "kg" | "lbs";

export interface WorkoutRecord {
  id: string;
  category: WorkoutCategory;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  date: string;
  time?: string;
}
