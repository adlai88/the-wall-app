import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <>
      <Head>
        <title>The Wall App</title>
        <meta name="description" content="Discover and share events in your city" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-right" richColors />
      <Component {...pageProps} events={events} setEvents={setEvents} />
    </>
  );
}

export default MyApp; 