import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

// Dynamically import UpcomingPostersView
const UpcomingPostersView = dynamic(() => import('./UpcomingPostersView'), {
  ssr: false
})

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`

export default function UpcomingPosters() {
  const [posters, setPosters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch('/api/posters')
        if (!response.ok) throw new Error('Failed to fetch posters')
        const data = await response.json()
        setPosters(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosters()
  }, [])

  if (loading) return <Loading>Loading posters...</Loading>
  if (error) return <Loading>Error: {error}</Loading>

  return <UpcomingPostersView posters={posters} />
} 