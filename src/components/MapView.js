import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
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

export default function MapView({ events }) {
  const router = useRouter();
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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
      
      <MapContainer
        center={userLocation || [31.2304, 121.4737]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {events?.map((event) => (
          <Marker
            key={event.id}
            position={event.coordinates}
            eventHandlers={{
              click: () => handleEventClick(event.id),
            }}
          >
            <Popup>
              <h3>{event.title}</h3>
              <p>{event.date} at {event.time}</p>
              <p>{event.location}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
} 