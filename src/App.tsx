import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import { seedCategoriesIfEmpty } from './db'

function App() {
  useEffect(() => {
    seedCategoriesIfEmpty()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
