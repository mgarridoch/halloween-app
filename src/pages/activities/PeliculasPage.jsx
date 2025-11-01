
import React from 'react'

function PeliculasPage() {
  return (
    <div>
      <p>Es la actividad de que toca ver películas de terror en grupo!</p>
      <p style={{ marginTop: '20px', color: '#aaa' }}>
        Resultados de la votación (Top 5):
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>Con 2 votos, Get out</li>
        <li>Todo el resto de las películas empatan con 1 voto cada una</li>
      </ul>
    </div>
  )
}
export default PeliculasPage