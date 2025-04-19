import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

// Dynamically import AdminModeration with proper loading state
const AdminModeration = dynamic(() => import('../../components/admin/AdminModeration.js'), {
  ssr: false,
  loading: () => (
    <LoadingContainer>
      <Loading>Loading admin panel...</Loading>
    </LoadingContainer>
  )
})

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`

const Loading = styled.div`
  font-size: 1.2rem;
  color: #666;
`

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: white;
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

  if (loading) {
    return (
      <LoadingContainer>
        <Loading>Loading admin panel...</Loading>
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <LoadingContainer>
        <Loading>Error: {error}</Loading>
      </LoadingContainer>
    )
  }

  return (
    <AdminContainer>
      <h1>Event Moderation</h1>
      <AdminModeration events={events} onEventAction={handleEventAction} />
    </AdminContainer>
  )
} 