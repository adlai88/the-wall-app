import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import BottomNav from './BottomNav';
import FullImageView from './FullImageView';
import EventCreationModal from './EventCreationModal';
import { useRouter } from 'next/router';
import { getWeather, getWeatherStyle } from '../services/weatherService';
import { testWeatherAPI } from '../utils/testWeatherAPI';
import { submitEvent, getEvents } from '../api';
import { toast } from 'sonner';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components
const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const DynamicPopup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const MapWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
`;

const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

export default function MapView({ events = [], setEvents }) {
  const router = useRouter();
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLeafletInitialized, setIsLeafletInitialized] = useState(false);

  // Initialize Leaflet only on client side
  useEffect(() => {
    if (!isLeafletInitialized) {
      import('leaflet/dist/leaflet.css');
      import('leaflet').then((L) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
          iconUrl: require('leaflet/dist/images/marker-icon.png').default,
          shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
        });
        setIsLeafletInitialized(true);
      });
    }
  }, [isLeafletInitialized]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  if (!isLeafletInitialized) {
    return <div>Loading map...</div>;
  }

  return (
    <MapWrapper>
      <MapControls>
        <Link href="/submit">
          <button>+ Add Event</button>
        </Link>
        <Link href="/upcoming">
          <button>Upcoming Events</button>
        </Link>
      </MapControls>
      
      <DynamicMapContainer
        center={userLocation || [31.2304, 121.4737]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <DynamicTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {events?.map((event) => (
          <DynamicMarker
            key={event.id}
            position={event.coordinates}
            eventHandlers={{
              click: () => handleEventClick(event.id),
            }}
          >
            <DynamicPopup>
              <h3>{event.title}</h3>
              <p>{event.date} at {event.time}</p>
              <p>{event.location}</p>
            </DynamicPopup>
          </DynamicMarker>
        ))}
      </DynamicMapContainer>
    </MapWrapper>
  );
} 