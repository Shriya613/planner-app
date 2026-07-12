import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import CategoryDetail from './pages/CategoryDetail'
import { seedCategoriesIfEmpty } from './db'

function App() {
  useEffect(() => {
    seedCategoriesIfEmpty()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/category/:id" element={<CategoryDetail />} />
    </Routes>
  )
}

export default App
