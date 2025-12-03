export type WorkoutCategory = 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core';

export interface WorkoutRecord {
  id: string;
  category: WorkoutCategory;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}
