import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

// Dynamically import UpcomingEventsView
const UpcomingEventsView = dynamic(() => import('./UpcomingEventsView'), {
  ssr: false,
  loading: () => <Loading>Loading events...</Loading>
})

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`

export default function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <Loading>Loading events...</Loading>
  if (error) return <Loading>Error: {error}</Loading>

  return <UpcomingEventsView events={events} />
} 