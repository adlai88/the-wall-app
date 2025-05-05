import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { getEvents } from '../api'
import LoadingView from '../components/LoadingView'
import BottomNav from '../components/BottomNav'
import Sheet from '../components/Sheet'
import { Drawer } from 'vaul'
import AddToHomeScreenDrawer from '../components/AddToHomeScreenDrawer'

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

const CategoryScrollContainer = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  white-space: nowrap;
  max-width: 100%;
  width: 100%;
  margin-top: 2px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: flex-start;
  scrollbar-width: none;
  position: relative;
  padding: 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  pointer-events: none;
  z-index: 1;
`;

const LeftBlur = styled(BlurOverlay)`
  left: 0;
  background: linear-gradient(to right, #fff 70%, rgba(255,255,255,0));
`;
const RightBlur = styled(BlurOverlay)`
  right: 0;
  background: linear-gradient(to left, #fff 70%, rgba(255,255,255,0));
`;

// --- Upcoming Overlay ---
import UpcomingPostersView from './UpcomingPostersView';
function UpcomingOverlayContent({ events, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  // const categories = ['all', 'general', 'event', 'announcement', 'community', 'other'];
  // const scrollRef = useRef();
  // const [showLeftBlur, setShowLeftBlur] = useState(false);
  // const [showRightBlur, setShowRightBlur] = useState(false);

  // Remove the category scroll UI, just render UpcomingPostersView:
  return (
    <div style={{ width: '100%' }}>
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

const ScrollableContent = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  flex: 1;
  overflow: auto;
  -ms-overflow-style: none;  /* Hide scrollbar in IE/Edge */
  scrollbar-width: none;  /* Hide scrollbar in Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Hide scrollbar in Chrome/Safari */
  }
`;

export default function Home() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [overlay, setOverlay] = useState(null) // 'upcoming', 'about', or null
  const [hasMounted, setHasMounted] = useState(false);
  const [showA2HS, setShowA2HS] = useState(false); // Add to Home Screen drawer

  // Helper: detect iOS Safari
  function isIosSafari() {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    const isIOS = /iP(ad|hone|od)/.test(ua);
    const isWebkit = /WebKit/.test(ua);
    const isNotCriOS = !/CriOS/.test(ua);
    const isNotFxiOS = !/FxiOS/.test(ua);
    return isIOS && isWebkit && isNotCriOS && isNotFxiOS;
  }
  // Helper: detect standalone mode
  function isInStandaloneMode() {
    if (typeof window === 'undefined') return false;
    return (
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches
    );
  }

  // Automated drawer logic
  useEffect(() => {
    if (!hasMounted) return;
    if (!isIosSafari()) return;
    if (isInStandaloneMode()) return;
    const dismissed = localStorage.getItem('a2hs_dismissed_until');
    if (dismissed && Date.now() < parseInt(dismissed, 10)) return;
    const timer = setTimeout(() => setShowA2HS(true), 1000);
    return () => clearTimeout(timer);
  }, [hasMounted]);

  // When user closes drawer, remember for 7 days
  const handleA2HSOnClose = () => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('a2hs_dismissed_until', (Date.now() + sevenDays).toString());
    setShowA2HS(false);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    console.log('Overlay state changed:', overlay);
  }, [overlay]);

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
      {/* Existing Implementation */}
      <MapView 
        events={events} 
        setEvents={setEvents} 
        onNav={nav => setOverlay(nav === 'map' ? null : nav)}
      />
      {/* TEMP: Button to trigger Add to Home Screen drawer */}
      {/* <button ...>Add to Home Screen</button> */}
      <AddToHomeScreenDrawer open={showA2HS} onClose={handleA2HSOnClose} />
      {hasMounted && (
        <>
          {/* Upcoming overlay as Drawer */}
          <Drawer.Root key="upcoming-drawer" open={overlay === 'upcoming'} onOpenChange={open => setOverlay(open ? 'upcoming' : null)} forceMount>
            <Drawer.Portal>
              <Drawer.Overlay style={{ background: 'rgba(0,0,0,0.48)', zIndex: 9998, height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, right: 0 }} />
              <Drawer.Content 
                description="Browse upcoming posters and events"
                style={{ 
                  background: '#fff',
                  zIndex: 9999,
                  position: 'fixed',
                  width: '100%',
                  top: 'env(safe-area-inset-top, 0px)',
                  height: 'calc(100vh - env(safe-area-inset-top, 0px))',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
                  padding: '16px 0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Drawer Handle */}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: '16px'
                }}>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    backgroundColor: '#eee',
                    borderRadius: '99999px'
                  }} />
                </div>

                <ScrollableContent>
                  <UpcomingOverlayContent events={events} onClose={() => setOverlay(null)} />
                </ScrollableContent>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          {/* About overlay as Drawer */}
          <Drawer.Root key="about-drawer" open={overlay === 'about'} onOpenChange={open => setOverlay(open ? 'about' : null)} forceMount>
            <Drawer.Portal>
              <Drawer.Overlay style={{ background: 'rgba(0,0,0,0.48)', zIndex: 9998, height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, right: 0 }} />
              <Drawer.Content 
                description="About The Wall App"
                style={{ 
                  background: '#fff',
                  zIndex: 9999,
                  position: 'fixed',
                  width: '100%',
                  top: 'env(safe-area-inset-top, 0px)',
                  height: 'calc(100vh - env(safe-area-inset-top, 0px))',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
                  padding: '16px 0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Drawer Handle */}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: '16px'
                }}>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    backgroundColor: '#eee',
                    borderRadius: '99999px'
                  }} />
                </div>

                <ScrollableContent>
                  <AboutOverlayContent onClose={() => setOverlay(null)} />
                </ScrollableContent>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </>
      )}
    </>
  )
} 