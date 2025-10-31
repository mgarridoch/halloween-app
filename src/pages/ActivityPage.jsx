// src/pages/ActivityPage.jsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Importamos TODAS las posibles páginas de actividades
import PeliculasPage from './activities/PeliculasPage'
import IAHumanoPage from './activities/IAHumanoPage'
import ValitaPage from './activities/ValitaPage'
import TeekoPage from './activities/TeekoPage'
import TriviaPage from './activities/TriviaPage'
import DisfracesPage from './activities/DisfracesPage'
import BailePage from './activities/BailePage'
import MonstruoPage from './activities/MonstruoPage'
import NellaPage from './activities/NellaPage'
// (Aquí importaremos TriviaPage y DisfracesPage cuando las hagamos)

// Un componente simple para las páginas que aún no hacemos
function PlaceholderPage({ slug }) {
  return (
    <div>
      <h1 style={{ color: '#f97316' }}>{slug}</h1>
      <p>Esta actividad aún está en construcción...</p>
    </div>
  )
}

// Layout común para todas las páginas de actividad
function ActivityLayout({ children }) {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/home')}
        style={{
          background: 'none',
          border: 'none',
          color: '#f97316',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        &lt; Volver a Actividades
      </button>
      {/* Aquí se renderiza la actividad específica */}
      {children}
    </div>
  )
}


function ActivityPage() {
  // 1. Leemos el parámetro :slug de la URL
  const { slug } = useParams() 

  // 2. Decidimos qué componente mostrar
  const renderActivity = () => {
    switch (slug) {
      // Casos simples
      case 'pelis-terror':
        return <PeliculasPage />
      case 'valita':
        return <ValitaPage />
      case 'teeko':
        return <TeekoPage />
      
      // Caso especial
      case 'ia-humano':
        return <IAHumanoPage />

      case 'nella':
        return <NellaPage />
      // Casos futuros
      case 'disfraces':
        // Si el slug es 'disfraces', el admin ve resultados
        return <DisfracesPage adminMode="results" />
      
      case 'votar-disfraz':
        // Si el slug es 'votar-disfraz', el admin va a votar
        return <DisfracesPage adminMode="vote" />   
      case 'trivia':
        return <TriviaPage />
      case 'baile':
        return <BailePage />
      case 'monstruo':
        return <MonstruoPage />
      // Por si algo falla
      default:
        return <h1>Actividad no encontrada</h1>
    }
  }

  // 3. Renderizamos el layout + la actividad decidida
  return (
    <ActivityLayout>
      {renderActivity()}
    </ActivityLayout>
  )
}

export default ActivityPage