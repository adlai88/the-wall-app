import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import styled from 'styled-components';

const MapWrapper = styled.div`
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10px;
`;

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker position={position}>
    </Marker>
  ) : null;
};

export default function MapPicker({ onLocationSelect, initialCoordinates }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (initialCoordinates) {
      setPosition({ lat: initialCoordinates[1], lng: initialCoordinates[0] });
    }
  }, [initialCoordinates]);

  useEffect(() => {
    if (position) {
      // Reverse geocode the coordinates to get the location name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
        .then(res => res.json())
        .then(data => {
          const locationName = data.display_name.split(',')[0];
          onLocationSelect([position.lng, position.lat], locationName);
        })
        .catch(error => {
          console.error('Error getting location name:', error);
          onLocationSelect([position.lng, position.lat], 'Selected Location');
        });
    }
  }, [position, onLocationSelect]);

  return (
    <MapWrapper>
      <MapContainer
        center={position || [31.2304, 121.4737]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </MapWrapper>
  );
} 