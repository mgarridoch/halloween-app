// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// --- Estilos (puedes moverlos a App.css) ---
const homeStyles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    color: '#f97316', // Naranjo
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
    marginTop: '20px',
  },
  // Estilo base de las tarjetas de actividad
  card: {
    padding: '25px 20px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    border: '2px solid #334155',
  },
  // Modal de confirmación
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    background: '#1e293b',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  modalButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    margin: '0 10px',
  },
}
// --- Fin de Estilos ---

function HomePage() {
  const [user, setUser] = useState(null)
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para la modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)

  const navigate = useNavigate()

  // 1. Cargar datos del usuario desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem('halloween-user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      navigate('/') // Si no hay usuario, de vuelta al login
    }
  }, [navigate])

  // 2. Cargar actividades y suscribirse a Realtime
  useEffect(() => {
    // No hacer nada si el usuario aún no se ha cargado
    if (!user) return

    // Función para cargar las actividades
    async function getActividades() {
      setLoading(true)
      let query = supabase.from('actividades').select('*')

      // ¡LÓGICA CLAVE!
      if (user.es_admin) {
        // Admin: Traer todas, ordenar por las no liberadas primero
        query = query.order('liberada', { ascending: true })
                      .order('id', { ascending: true })
      } else {
        // Usuario normal: Traer solo las liberadas, ordenadas
        query = query.filter('liberada', 'eq', true)
                     .order('orden_liberacion', { ascending: true })
      }

      const { data, error } = await query
      if (error) {
        console.error('Error cargando actividades:', error.message)
      } else {
        setActividades(data)
      }
      setLoading(false)
    }

    // Carga inicial
    getActividades()

    // --- ¡LA MAGIA DE REALTIME! ---
    // Escucha cualquier cambio en la tabla 'actividades'
    const channel = supabase
      .channel('actividades-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'actividades' },
        (payload) => {
          console.log('¡Cambio detectado!', payload)
          // Cuando algo cambie (alguien libere), volvemos a cargar la lista
          getActividades()
        }
      )
      .subscribe()

    // Función de limpieza: Se ejecuta cuando el componente se "desmonta"
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user]) // Este hook se re-ejecuta si 'user' cambia

  // 3. Funciones para manejar la modal (solo admin)
  const handleShowConfirm = (actividad) => {
    setSelectedActivity(actividad)
    setShowConfirm(true)
  }

  const handleCancel = () => {
    setSelectedActivity(null)
    setShowConfirm(false)
  }

  const handleLiberate = async () => {
    if (!selectedActivity) return

    try {
      // 1. Contamos cuántas ya están liberadas para asignar el orden
      const { count, error: countError } = await supabase
        .from('actividades')
        .select('*', { count: 'exact', head: true })
        .eq('liberada', true)

      if (countError) throw countError

      // 2. Actualizamos la actividad
      const { error } = await supabase
        .from('actividades')
        .update({
          liberada: true,
          orden_liberacion: count + 1, // Asigna el siguiente número de orden
        })
        .eq('id', selectedActivity.id)
      
      if (error) throw error

    } catch (error) {
      console.error('Error al liberar actividad:', error.message)
    } finally {
      // 3. Cerramos la modal
      handleCancel()
      // No necesitamos recargar datos, ¡Realtime lo hará por nosotros!
    }
  }

  // 4. Función de click principal
  const handleCardClick = (actividad) => {
    if (user.es_admin) {
      if (actividad.liberada) {
        // Admin + Liberada: Ir a la actividad
        navigate(`/actividad/${actividad.slug}`)
      } else {
        // Admin + No Liberada: Mostrar modal
        handleShowConfirm(actividad)
      }
    } else {
      // Usuario Normal: (Solo verá liberadas) Ir a la actividad
      navigate(`/actividad/${actividad.slug}`)
    }
  }

  // 5. Renderizado
  if (loading || !user) {
    return <div style={homeStyles.container}><h1>Cargando...</h1></div>
  }

  return (
    <div style={homeStyles.container}>
      {/* --- MODAL DE CONFIRMACIÓN (oculta por defecto) --- */}
      {showConfirm && selectedActivity && (
        <div style={homeStyles.modalOverlay}>
          <div style={homeStyles.modalContent}>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              ¿Seguro que quieres liberar<br />
              <strong>{selectedActivity.titulo}</strong>?
            </p>
            <button
              style={{ ...homeStyles.modalButton, backgroundColor: '#b91c1c' }}
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              style={{ ...homeStyles.modalButton, backgroundColor: '#16a34a' }}
              onClick={handleLiberate}
            >
              ¡Liberar!
            </button>
          </div>
        </div>
      )}

      {/* --- PÁGINA PRINCIPAL --- */}
      <div style={homeStyles.header}>
        <h1 style={homeStyles.title}>¡Bienvenid@, {user.nombre}!</h1>
        {user.es_admin && '🎃'}
      </div>

      <h2 style={{ color: '#aaa', marginTop: 40, borderBottom: '1px solid #334155', paddingBottom: 10 }}>
        {user.es_admin ? 'Panel de Actividades' : 'Actividades Liberadas'}
      </h2>

      {/* --- LISTA DE ACTIVIDADES --- */}
      <div style={homeStyles.grid}>
        {actividades.length === 0 && !user.es_admin && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            El admin aún no ha liberado ninguna actividad.<br />
            ¡Espera aquí! 👻
          </p>
        )}

        {actividades.map((act) => {
          // Asigna el color de fondo según el estado (solo para admin)
          const adminCardColor = act.liberada ? '#15803d' : '#991b1b'; // verde / rojo
          // Para usuarios, todas las que ven son verdes
          const userCardColor = '#15803d';
          
          return (
            <button
              key={act.id}
              style={{
                ...homeStyles.card,
                backgroundColor: user.es_admin ? adminCardColor : userCardColor,
              }}
              onClick={() => handleCardClick(act)}
            >
              {act.titulo}
            </button>
          )
        })}
        {user?.es_admin && (
          <button
            style={{
              ...homeStyles.card,
              backgroundColor: '#15803d', // Verde (liberada)
              border: '2px dashed #f97316' // Borde punteado para distinguirla
            }}
            onClick={() => navigate('/actividad/votar-disfraz')} // Un slug nuevo y "falso"
          >
            Votar para disfraz (Admin)
          </button>
        )}
      </div>
    </div>
  )
}

export default HomePage