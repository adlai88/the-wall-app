import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <Loading>Loading map...</Loading>
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

export default function Home({ events = [], setEvents }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (error) return <Loading>Error: {error}</Loading>

  return <MapView events={events} setEvents={setEvents} />
} 