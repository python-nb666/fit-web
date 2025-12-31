import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react';
import { Home } from './pages/home/Home'
import CategoryPage from './pages/category/CategoryPage'

import './App.css'

const BodyFat = lazy(() => import('./pages/BodyFat'));
// const CategoryPage = lazy(() => import('./pages/category/CategoryPage'));
const ExerciseHistoryPage = lazy(() => import('./pages/exercise/ExerciseHistoryPage'));

const Loading = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

import { useEffect } from 'react';
import { useWorkoutStore } from './stores/workoutStore';
import { getExercises } from './api/exercises';
import { getRecords } from './api/records';
import type { WorkoutCategory, WorkoutRecord } from './types/workout';

function App() {
  const setExercises = useWorkoutStore((state) => state.setExercises);
  const setRecords = useWorkoutStore((state) => state.setRecords);

  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch Exercises
        const { categories, idMap } = await getExercises();
        setExercises(categories, idMap);

        // Fetch Records
        const apiRecords = await getRecords(1);
        const transformedRecords: WorkoutRecord[] = apiRecords.map((r: any) => {
          const workoutDate = new Date(r.workoutTime);
          return {
            id: r.id.toString(),
            category: r.exercise.category.slug as WorkoutCategory,
            exercise: r.exercise.name,
            sets: r.sets,
            reps: r.reps,
            weight: r.weight,
            weightUnit: r.weightUnit as any,
            date: workoutDate.toISOString().split('T')[0],
            time: workoutDate.toTimeString().split(' ')[0],
          };
        });
        setRecords(transformedRecords);
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    initData();
  }, [setExercises, setRecords]);

  return (
    <BrowserRouter basename="/fit-web/">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:categoryId" element={<CategoryPage />} />
          <Route path="/body-fat" element={<BodyFat />} />
          <Route path="/exercise-history/:exerciseName" element={<ExerciseHistoryPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
