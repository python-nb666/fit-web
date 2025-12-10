import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react';
import { Home } from './pages/home/Home'
import './App.css'
const BodyFat = lazy(() => import('./pages/BodyFat'));

const Loading = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <BrowserRouter basename='/fit-web'>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/body-fat" element={<BodyFat />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
