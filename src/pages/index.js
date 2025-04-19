import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getEvents } from '../api'
import LoadingView from '../components/LoadingView'

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => <LoadingView />
})

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
  background-color: #f5f5f5;
`

export default function Home() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events in Home component...');
        const data = await getEvents()
        console.log('Events received in Home:', data);
        setEvents(data || []); // Ensure we set an array even if data is null
      } catch (err) {
        console.error('Error fetching events in Home:', err);
        setError(err.message)
      }
    }

    fetchEvents()
  }, [])

  // Debug when events state changes
  useEffect(() => {
    console.log('Events state updated in Home:', events);
  }, [events]);

  if (error) return <Loading>Error: {error}</Loading>

  return <MapView events={events} setEvents={setEvents} />
} 