import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

// Dynamically import AdminModeration
const AdminModeration = dynamic(() => import('../../src/pages/AdminModeration'), {
  ssr: false,
  loading: () => <Loading>Loading admin panel...</Loading>
})

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`

export default function AdminModerationPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/admin/events', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`
          }
        })
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

  const handleEventAction = async (id, action) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ id, action })
      })

      if (!response.ok) throw new Error('Failed to update event status')
      
      // Refresh the events list
      const updatedResponse = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`
        }
      })
      const updatedData = await updatedResponse.json()
      setEvents(updatedData)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loading>Loading admin panel...</Loading>
  if (error) return <Loading>Error: {error}</Loading>

  return <AdminModeration events={events} onEventAction={handleEventAction} />
} 