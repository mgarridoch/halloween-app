// src/pages/activities/DisfracesPage.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

// --- Estilos (son bastantes, puedes moverlos a CSS) ---
const styles = {
  container: { textAlign: 'center' },
  phaseTitle: { fontSize: '1.5rem', color: '#f97316' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginTop: '20px',
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
  },
  waitingText: { fontSize: '1.2rem', color: '#aaa', marginTop: '40px' },
  adminTable: {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse',
  },
  adminTh: {
    padding: '8px',
    border: '1px solid #334155',
    background: '#1e293b',
    fontSize: '0.8rem',
  },
  adminTd: {
    padding: '8px',
    border: '1px solid #334155',
    fontSize: '0.9rem',
  },
  resultsTable: {
    width: '100%',
    marginTop: '20px',
  },
  resultsTd: {
    padding: '12px',
    fontSize: '1.2rem',
  },
}
// --- Fin Estilos ---

function DisfracesPage({ adminMode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [allParticipants, setAllParticipants] = useState([])
  const [myVoteStatus, setMyVoteStatus] = useState(null)
  const [allVoteStatuses, setAllVoteStatuses] = useState([]) // Solo para admin
  const [currentPhase, setCurrentPhase] = useState(1) // 1, 2, 3, o 'done'

  // 1. Carga inicial de datos (usuario y lista de participantes)
  useEffect(() => {
    async function loadInitialData() {
      const userData = localStorage.getItem('halloween-user')
      if (!userData) {
        setLoading(false)
        return
      }
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      const { data: participantsData, error } = await supabase
        .from('participantes')
        .select('id, nombre')
      
      if (error) {
        console.error('Error cargando participantes', error)
      } else {
        setAllParticipants(participantsData)
      }
    }
    loadInitialData()
  }, [])

  // 2. Carga y suscripción a los datos de votación (¡Realtime!)
  useEffect(() => {
    // No hacer nada si el usuario o los participantes no se han cargado
    if (!user || allParticipants.length === 0) return

    // Función para obtener los datos de votación
    async function fetchVotes() {
      // Pedimos el estado de mi votación
      const { data: myData, error: myError } = await supabase
        .from('votacion_disfraces')
        .select('*')
        .eq('participante_id', user.id)
        .single() // Solo me interesa mi fila

      if (myError && myError.code !== 'PGRST116') { // PGRST116 = "fila no encontrada", lo cual está bien
        console.error('Error cargando mi voto', myError)
      }
      
      setMyVoteStatus(myData)
      // Determinamos la fase actual del usuario
      if (!myData?.voto_1_id) setCurrentPhase(1)
      else if (!myData?.voto_2_id) setCurrentPhase(2)
      else if (!myData?.voto_3_id) setCurrentPhase(3)
      else setCurrentPhase('done')

      // Si es admin, también pedimos los votos de TODOS
      if (user.es_admin) {
        const { data: allData, error: allError } = await supabase
          .from('votacion_disfraces')
          .select('participante_id, voto_1_id, voto_2_id, voto_3_id')

        if (allError) {
          console.error('Error cargando todos los votos (admin)', allError)
        } else {
          setAllVoteStatuses(allData)
        }
      }
      setLoading(false)
    }

    // Carga inicial
    fetchVotes()

    // Suscripción Realtime
    const channel = supabase
      .channel('votacion-disfraces-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votacion_disfraces' },
        (payload) => {
          console.log('¡Voto detectado!', payload)
          fetchVotes() // Recargamos los datos cada vez que alguien vota
        }
      )
      .subscribe()

    // Limpieza
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, allParticipants]) // Se re-ejecuta si el usuario o los participantes cambian

  // 3. Función para manejar el voto
  const handleVote = async (votedParticipantId) => {
    setLoading(true)
    let updateData = {}
    if (currentPhase === 1) updateData.voto_1_id = votedParticipantId
    if (currentPhase === 2) updateData.voto_2_id = votedParticipantId
    if (currentPhase === 3) updateData.voto_3_id = votedParticipantId

    try {
      // 'upsert' crea la fila si no existe, o la actualiza si ya existe.
      // Es perfecto para esto.
      const { error } = await supabase
        .from('votacion_disfraces')
        .upsert({
          participante_id: user.id,
          ...myVoteStatus, // Incluye los votos anteriores
          ...updateData    // Sobrescribe con el voto nuevo
        })
      
      if (error) throw error

    } catch (error) {
      console.error('Error al guardar el voto:', error.message)
    }
    // Necesitamos que se recargue la pagina para ver el nuevo estado
    window.location.reload()
    // No necesitamos setLoading(false), Realtime se encargará de recargar
  }

  // --- VISTAS INTERNAS ---

  // 4. Vista del Admin
  const AdminView = () => {
    // Unimos los votos con los nombres
    const voteStatusByName = allParticipants.map(p => {
      const voteData = allVoteStatuses.find(v => v.participante_id === p.id)
      return {
        nombre: p.nombre,
        voto_1: voteData?.voto_1_id ? '✅' : '❌',
        voto_2: voteData?.voto_2_id ? '✅' : '❌',
        voto_3: voteData?.voto_3_id ? '✅' : '❌',
        done: !!voteData?.voto_3_id
      }
    })

    const allDone = voteStatusByName.length > 0 && voteStatusByName.every(v => v.done)

    if (allDone) {
      return <ResultsView />
    }

    return (
      <div>
        <h2 style={styles.phaseTitle}>Estado de Votación (Admin)</h2>
        <p style={styles.waitingText}>Esperando a que todos terminen de votar...</p>
        <table style={styles.adminTable}>
          <thead>
            <tr>
              <th style={styles.adminTh}>Usuario</th>
              <th style={styles.adminTh}>Voto 1</th>
              <th style={styles.adminTh}>Voto 2</th>
              <th style={styles.adminTh}>Voto 3</th>
            </tr>
          </thead>
          <tbody>
            {voteStatusByName.map(p => (
              <tr key={p.nombre}>
                <td style={styles.adminTd}>{p.nombre}</td>
                <td style={styles.adminTd}>{p.voto_1}</td>
                <td style={styles.adminTd}>{p.voto_2}</td>
                <td style={styles.adminTd}>{p.voto_3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // 5. Vista de Resultados (para Admin)
  const ResultsView = () => {
    // Asignamos Puntos: 1er Lugar = 5pts, 2do = 3pts, 3ro = 1pt
    const scores = {}
    allParticipants.forEach(p => scores[p.id] = { nombre: p.nombre, score: 0 });

    allVoteStatuses.forEach(vote => {
      if (vote.voto_1_id) scores[vote.voto_1_id].score += 5
      if (vote.voto_2_id) scores[vote.voto_2_id].score += 3
      if (vote.voto_3_id) scores[vote.voto_3_id].score += 1
    })

    const finalResults = Object.values(scores).sort((a, b) => b.score - a.score)

    return (
      <div>
        <h2 style={styles.phaseTitle}>¡Resultados Finales!</h2>
        <table style={styles.resultsTable}>
          <tbody>
            {finalResults.map((r, index) => (
              <tr key={r.nombre} style={{ background: index % 2 === 0 ? '#1e293b' : 'transparent' }}>
                <td style={{...styles.resultsTd, width: '40px', fontWeight: 'bold' }}>#{index + 1}</td>
                <td style={styles.resultsTd}>{r.nombre}</td>
                <td style={{...styles.resultsTd, width: '80px', fontWeight: 'bold' }}>{r.score} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // 6. Vista de Votación (Usuario Normal)
  const VotingView = () => {
    let title = ''
    let voteIdsToExclude = [user.id] // No se puede votar por uno mismo

    if (currentPhase === 1) {
      title = 'Vota por el MEJOR disfraz'
    }
    if (currentPhase === 2) {
      title = 'Vota por el 2DO mejor disfraz'
      voteIdsToExclude.push(myVoteStatus.voto_1_id) // No se puede repetir voto
    }
    if (currentPhase === 3) {
      title = 'Vota por el 3ER mejor disfraz'
      voteIdsToExclude.push(myVoteStatus.voto_1_id)
      voteIdsToExclude.push(myVoteStatus.voto_2_id) // No se puede repetir
    }

    // Filtramos la lista de opciones
    const options = allParticipants.filter(p => !voteIdsToExclude.includes(p.id))

    return (
      <div>
        <h2 style={styles.phaseTitle}>{title}</h2>
        <div style={styles.grid}>
          {options.map(p => (
            <button
              key={p.id}
              style={styles.button}
              onClick={() => handleVote(p.id)}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      </div>
    )
  }

// --- RENDERIZADO PRINCIPAL (MODIFICADO) ---
  if (loading) {
    return <h1>Cargando concurso...</h1>
  }

  // --- LÓGICA DE VISTA MODIFICADA ---
  if (user?.es_admin && adminMode === 'results') {
    // Caso 1: Eres Admin Y vienes a VER RESULTADOS (slug='disfraces')
    return (
      <div style={styles.container}>
        <AdminView />
      </div>
    )
  }

  // Caso 2: Eres Usuario Normal (adminMode es 'results' pero user.es_admin es false)
  // Caso 3: Eres Admin Y vienes a VOTAR (adminMode es 'vote')
  return (
    <div style={styles.container}>
      {currentPhase === 'done' ? (
        <p style={styles.waitingText}>
          ¡Ya votaste! 🎉<br /><br />
          {/* Pequeña mejora para el admin */}
          {user?.es_admin ? 'Puedes ver los resultados en el panel de admin.' : 'Esperando a que los demás terminen...'}
        </p>
      ) : (
        <VotingView />
      )}
    </div>
  )
}

export default DisfracesPage