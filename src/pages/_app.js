import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';
import { ThemeProvider } from 'styled-components';

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
        <title>Wallllll</title>
        <meta name="description" content="Discover and share happenings in your city" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-right" richColors />
      <ThemeProvider theme={{}}>
        <Component {...pageProps} events={events} setEvents={setEvents} />
      </ThemeProvider>
      {/* Portal container for overlays */}
      <div id="portal-root" style={{ position: 'fixed', zIndex: 99999, pointerEvents: 'none' }} />
    </>
  );
}

export default MyApp; 