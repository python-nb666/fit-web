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

export const getExercises = async (): Promise<{
  categories: Record<WorkoutCategory, string[]>;
  idMap: Record<string, number>;
}> => {
  const categories = await api.get<Category[], Category[]>(
    "/exercises/categories"
  );

  const result: Partial<Record<WorkoutCategory, string[]>> = {};
  const idMap: Record<string, number> = {};

  categories.forEach((cat) => {
    const key = cat.slug as WorkoutCategory;
    result[key] = cat.exercises.map((e) => {
      idMap[e.name] = e.id;
      return e.name;
    });
  });

  return {
    categories: result as Record<WorkoutCategory, string[]>,
    idMap,
  };
};
