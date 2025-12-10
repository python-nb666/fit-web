import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { BodyFat } from './pages/BodyFat'
import './App.css'

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
