// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

// Estilos (los mismos que tenías)
const loginStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#f97316',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    width: '100%',
    maxWidth: '500px',
  },
  button: {
    padding: '20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1e293b',
    border: '2px solid #334155',
    borderRadius: '8px',
    cursor: 'pointer',
  }
}

function LoginPage() {
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function getParticipantes() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('participantes')
          .select('*')
          .order('nombre', { ascending: true })

        if (error) throw error
        if (data) setParticipantes(data)

      } catch (error) {
        console.error('Error cargando participantes:', error.message)
      } finally {
        setLoading(false)
      }
    }

    // --- MEJORA ---
    // Si el usuario ya existe en localStorage, lo mandamos a /home
    const existingUser = localStorage.getItem('halloween-user')
    if (existingUser) {
      navigate('/home')
    } else {
      // Si no, cargamos la lista de participantes para el login
      getParticipantes()
    }
  }, [navigate]) // Se ejecuta solo una vez al cargar

  // Función interna que hace el login
  const proceedToLogin = (participante) => {
    localStorage.setItem('halloween-user', JSON.stringify(participante))
    navigate('/home')
  }

  // 3. Función de "login" MODIFICADA
  const handleLogin = (participante) => {
    
    // --- LÓGICA DE LA CLAVE "CACUCA" ---
    if (participante.nombre === 'Martín' || participante.es_admin) {
      // Pide la clave usando un prompt simple del navegador
      const clave = prompt("Ingresa la clave de Admin:")
      
      if (clave === 'cacuca') {
        // Clave correcta, ¡adelante!
        proceedToLogin(participante)
      } else if (clave !== null) { 
        // Si escribió algo (no es "cancelar") y está mal
        alert("Clave incorrecta.")
      }
      // Si aprieta "cancelar" (clave === null), no hace nada.

    } else {
      // Si es cualquier otro usuario, entra directo
      proceedToLogin(participante)
    }
  }

  // 4. Renderizado
  if (loading) {
    return <div style={loginStyles.container}><h1>Cargando...</h1></div>
  }

  return (
    <div style={loginStyles.container}>
      <h1 style={loginStyles.title}>¿Quién eres?</h1>
      <div style={loginStyles.grid}>
        {participantes.map((p) => (
          <button
            key={p.id}
            style={loginStyles.button}
            onClick={() => handleLogin(p)} // Llama a nuestra función modificada
          >
            {p.nombre}
            {p.es_admin && ' 🎃'}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LoginPage