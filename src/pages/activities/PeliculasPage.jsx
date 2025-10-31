
import React from 'react'

function PeliculasPage() {
  return (
    <div>
      <p>Es la actividad de que toca ver películas de terror en grupo!</p>
      <p style={{ marginTop: '20px', color: '#aaa' }}>
        Resultados de la votación (Top 5):
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>1. El Conjuro</li>
        <li>2. Hereditary</li>
        <li>3. Viernes 13</li>
        <li>4. La Monja</li>
        <li>5. Actividad Paranormal 2</li>
      </ul>
    </div>
  )
}
export default PeliculasPage