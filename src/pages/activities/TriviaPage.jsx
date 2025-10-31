// src/pages/activities/TriviaPage.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

function TriviaPage() {
  const [equipo, setEquipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getEquipo() {
      try {
        // 1. Obtener el usuario actual de localStorage
        const userData = localStorage.getItem('halloween-user')
        if (!userData) throw new Error('No se encontró al usuario')
        const user = JSON.parse(userData)

        // 2. Consultar solo la columna que necesitamos
        const { data, error: dbError } = await supabase
          .from('participantes')
          .select('equipo_trivia') // Solo traemos el equipo
          .eq('id', user.id) // Para el usuario actual
          .single() // Esperamos solo UN resultado

        if (dbError) throw dbError

        // 3. Validar y guardar el equipo
        if (data && data.equipo_trivia) {
          setEquipo(data.equipo_trivia)
        } else {
          // Si el admin olvidó poner el número
          throw new Error('El Admin no te ha asignado un equipo.')
        }

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getEquipo()
  }, []) // El array vacío [] significa que se ejecuta solo una vez

  // --- Renderizado ---
  if (loading) return <h1>Buscando tu equipo...</h1>
  if (error) return <h1 style={{ color: '#b91c1c' }}>Error: {error}</h1>

  return (
    <div style={{
      textAlign: 'center',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h2 style={{ color: '#aaa', fontSize: '1.5rem', fontWeight: 500 }}>
        Tu equipo para la Trivia es el:
      </h2>
      <h1 style={{
        color: '#f97316',
        fontSize: '12rem', // ¡Bien grande!
        margin: 0,
        lineHeight: 1
      }}>
        {equipo}
      </h1>
    </div>
  )
}

export default TriviaPage