// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage' // Aún no los creamos, pero lo haremos ahora
import HomePage from './pages/HomePage'
import ActivityPage from './pages/ActivityPage'

function App() {
  return (
    <Routes>
      {/* Ruta raíz: / */}
      <Route path="/" element={<LoginPage />} />

      {/* Ruta del home: /home */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/actividad/:slug" element={<ActivityPage />} />

      {/* Más adelante agregaremos las rutas para cada actividad:
      <Route path="/actividad/:slug" element={<ActivityPage />} />
      */}
    </Routes>
  )
}

export default App