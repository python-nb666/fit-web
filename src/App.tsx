import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react';
import { Home } from './pages/home/Home'

import './App.css'

const BodyFat = lazy(() => import('./pages/BodyFat'));
const CategoryPage = lazy(() => import('./pages/category/CategoryPage'));
const ExerciseHistoryPage = lazy(() => import('./pages/exercise/ExerciseHistoryPage'));

const Loading = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

function App() {
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
