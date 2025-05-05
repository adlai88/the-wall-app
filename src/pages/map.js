import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { getEvents } from '../api';
import LoadingView from '../components/LoadingView';

// Dynamically import MapView with no SSR
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false
});

export default function MapPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        if (mounted) {
          setEvents(data || []);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        if (mounted) {
          setError(error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingView />;
  if (error) return <LoadingView error={error} />;

  return <MapView events={events} setEvents={setEvents} />;
} 