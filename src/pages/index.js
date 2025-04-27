import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getEvents } from '../api'
import LoadingView from '../components/LoadingView'
import BottomNav from '../components/BottomNav'

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false
})

const OverlayBg = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.97);
  z-index: 2000;
  overflow-y: auto;
  border: 2px solid black;
  font-family: 'Courier New', monospace;
`;

const FloatingOverlay = styled.div`
  position: absolute;
  top: 120px;
  right: 30px;
  width: 400px;
  max-height: 70vh;
  background: white;
  border: 1px solid #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  z-index: 2100;
  overflow-y: auto;
  box-shadow: 4px 4px 0 #222;
  padding: 24px 24px 24px 24px;
  border-radius: 0;
`;

// --- Upcoming Overlay ---
import UpcomingPostersView from './UpcomingPostersView';
function UpcomingOverlay({ events, onClose }) {
  return (
    <FloatingOverlay>
      <button onClick={onClose} style={{position:'absolute',top:10,right:10}}>Close</button>
      <div style={{marginTop: 40}}>
        <UpcomingPostersView posters={events} />
      </div>
    </FloatingOverlay>
  );
}

// --- About Overlay ---
import AboutInfoPage from './AboutInfoPage';
function AboutOverlay({ onClose }) {
  return (
    <FloatingOverlay>
      <button onClick={onClose} style={{position:'absolute',top:10,right:10}}>Close</button>
      <div style={{marginTop: 40}}>
        <AboutInfoPage />
      </div>
    </FloatingOverlay>
  );
}

export default function Home() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [overlay, setOverlay] = useState(null) // 'upcoming', 'about', or null

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data || []);
      } catch (err) {
        setError(err.message)
      }
    }
    fetchEvents()
  }, [])

  if (error) return <LoadingView message={`Error: ${error}`} />

  return (
    <>
      <MapView events={events} setEvents={setEvents} />
      {overlay === 'upcoming' && (
        <UpcomingOverlay events={events} onClose={() => setOverlay(null)} />
      )}
      {overlay === 'about' && (
        <AboutOverlay onClose={() => setOverlay(null)} />
      )}
    </>
  )
} 