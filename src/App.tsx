import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Home from './pages/Home'
import CategoryDetail from './pages/CategoryDetail'
import { seedCategoriesIfEmpty } from './db'

function App() {
  const location = useLocation()

  useEffect(() => {
    seedCategoriesIfEmpty()
  }, [])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
