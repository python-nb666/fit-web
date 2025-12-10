import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy } from 'react';
import { Home } from './pages/home/Home'
import './App.css'
const BodyFat = lazy(() => import('./pages/BodyFat'));

function App() {
  return (
    <BrowserRouter basename='/fit-web'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/body-fat" element={<BodyFat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
