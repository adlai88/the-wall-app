import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';
import { ThemeProvider } from 'styled-components';
import React, { createContext } from 'react';
import { getUserLocation } from '../services/weatherService';

export const UserLocationContext = createContext({ userLocation: null, error: null, loading: true });

function MyApp({ Component, pageProps }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // User location context state
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getUserLocation().then(loc => {
      if (isMounted) {
        setUserLocation(loc);
        setLocationLoading(false);
      }
    }).catch(err => {
      if (isMounted) {
        setLocationError(err.message || 'Location error');
        setLocationLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

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
      <Toaster position="bottom-center" richColors />
      <ThemeProvider theme={{}}>
        <UserLocationContext.Provider value={{ userLocation, error: locationError, loading: locationLoading }}>
          <Component {...pageProps} events={events} setEvents={setEvents} />
        </UserLocationContext.Provider>
      </ThemeProvider>
      {/* Portal container for overlays */}
      <div id="portal-root" style={{ position: 'fixed', zIndex: 99999, pointerEvents: 'none' }} />
    </>
  );
}

export default MyApp; 