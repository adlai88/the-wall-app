import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { getEvents } from '../api';
import LoadingView from '../components/LoadingView';

// Dynamically import MapView with no SSR
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => <LoadingView />
});

export default function MapPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return <MapView events={events} setEvents={setEvents} />;
} 