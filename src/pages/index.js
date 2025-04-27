import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getEvents } from '../api'
import LoadingView from '../components/LoadingView'
import BottomNav from '../components/BottomNav'
import Sheet from '../components/Sheet'

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
  top: 0;
  right: 0;
  width: 400px;
  max-height: 70vh;
  background: white;
  border: 1px solid #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  z-index: 2100;
  overflow-y: auto;
  padding: 0 8px 0 8px;
  border-radius: 0;

  @media (max-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    padding: 0;
    border: none;
  }
`;

const OverlayHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 8px 0 8px;
  min-height: 44px;
  box-sizing: border-box;
`;

const BadgeScroll = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  width: 100%;
  margin-top: 2px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: flex-start;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const CloseButton = styled.button`
  height: 36px;
  width: 36px;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  border-radius: 6px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  margin-bottom: 2px;
  &:hover {
    background: #f5f5f5;
    color: #222;
  }
`;

const CategoryButton = styled.button`
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  background: ${props => props.active ? '#ff5722' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#222'};
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  &:hover {
    background: ${props => props.active ? '#f4511e' : '#e0e0e0'};
  }
`;

// --- Upcoming Overlay ---
import UpcomingPostersView from './UpcomingPostersView';
function UpcomingOverlayContent({ events, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'general', 'event', 'announcement', 'community', 'other'];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: '#fff', borderBottom: '1px solid #eee', padding: '0 8px' }}>
        {/* Close button removed, handled by Sheet */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%', width: '100%', marginTop: 2, marginBottom: 4, alignItems: 'center', justifyContent: 'flex-start', scrollbarWidth: 'none' }}>
          {categories.map(category => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </CategoryButton>
          ))}
        </div>
      </div>
      <div style={{marginTop: 0, background: '#fff'}}>
        <UpcomingPostersView posters={events} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} hideHeaders hideTableBorder />
      </div>
    </div>
  );
}

// --- About Overlay ---
import AboutInfoPage from './AboutInfoPage';
function AboutOverlayContent({ onClose }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: '#fff', padding: '0 8px' }}>
        {/* Close button handled by Sheet */}
      </div>
      <div style={{marginTop: 0, background: '#fff'}}>
        <AboutInfoPage />
      </div>
    </div>
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
      <MapView 
        events={events} 
        setEvents={setEvents} 
        onNav={nav => setOverlay(nav === 'map' ? null : nav)}
      />
      <Sheet open={overlay === 'upcoming'} onClose={() => setOverlay(null)}>
        <UpcomingOverlayContent events={events} onClose={() => setOverlay(null)} />
      </Sheet>
      <Sheet open={overlay === 'about'} onClose={() => setOverlay(null)}>
        <AboutOverlayContent onClose={() => setOverlay(null)} />
      </Sheet>
    </>
  )
} 