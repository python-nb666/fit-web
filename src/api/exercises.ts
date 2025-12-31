import api from "./axios";
import type { WorkoutCategory } from "../types/workout";

interface Exercise {
  id: number;
  name: string;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  exercises: Exercise[];
}

export const getExercises = async (): Promise<
  Record<WorkoutCategory, string[]>
> => {
  const categories = await api.get<Category[], Category[]>(
    "/exercises/categories"
  );

  const result: Partial<Record<WorkoutCategory, string[]>> = {};

  categories.forEach((cat) => {
    const key = cat.slug as WorkoutCategory;
    result[key] = cat.exercises.map((e) => e.name);
  });

  return result as Record<WorkoutCategory, string[]>;
};
