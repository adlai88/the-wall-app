import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomNav from './BottomNav';
import FullImageView from './FullImageView';
import EventCreationModal from './EventCreationModal';
import { useRouter } from 'next/router';
import { getWeather, getWeatherStyle } from '../services/weatherService';
import { testWeatherAPI } from '../utils/testWeatherAPI';
import { submitEvent, getEvents } from '../api';
import { toast } from 'sonner';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapContainerStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px; /* Height of bottom nav */
  z-index: 1;
  
  /* Add safe area padding on mobile */
  @media (max-width: 768px) {
    bottom: calc(60px + env(safe-area-inset-bottom, 0px));
  }

  .leaflet-container {
    width: 100%;
    height: 100%;
    cursor: ${props => props.isPlacingPin ? 'crosshair' : 'grab'};
  }

  .leaflet-tile-pane {
    transition: all 0.5s ease;
  }

  .leaflet-control-zoom {
    right: env(safe-area-inset-right, 16px); /* Match the right margin of MapControlsContainer */
    bottom: 20px;
    left: auto;
    a {
      width: 40px !important;
      height: 40px !important;
      line-height: 40px !important;
      font-size: 18px !important;
    }
  }

  /* Customize the map style */
  .leaflet-control-attribution {
    background: transparent !important;
    color: #666;
    font-size: 10px;
  }

  .leaflet-grab {
    cursor: ${props => props.isPlacingPin ? 'crosshair' : 'grab'};
  }

  .leaflet-dragging .leaflet-grab {
    cursor: ${props => props.isPlacingPin ? 'crosshair' : 'grabbing'};
  }
`;

const SearchBar = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  height: 40px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const SearchIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #999;
  
  &::before {
    content: "🔍";
    font-size: 14px;
  }
`;

const SearchInput = styled.input`
  border: none;
  width: 100%;
  font-size: 14px;
  color: #333;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const MapControlsContainer = styled.div`
  position: absolute;
  right: 10px; /* Fixed margin to match zoom controls */
  bottom: 160px;
  z-index: 400;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  /* Only adjust bottom padding for safe area */
  @media (max-width: 768px) {
    bottom: calc(160px + env(safe-area-inset-bottom, 0px));
  }
`;

const MapControlButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  opacity: ${props => props.isLocating ? 0.6 : 1};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #f8f8f8;
  }

  &:active {
    background-color: #f0f0f0;
  }
`;

const AddEventButton = styled.button`
  width: 60px;
  height: 60px;
  background-color: #ff5722;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 40px; /* Closer to bottom nav but not too close */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  border: none;
  cursor: pointer;
  z-index: 400;
  
  &:hover {
    background-color: #e64a19;
  }

  /* Add safe area padding and adjust position on mobile */
  @media (max-width: 768px) {
    bottom: calc(50px + env(safe-area-inset-bottom, 0px));
  }
`;

// Weather overlay component
const WeatherOverlay = styled.div`
  position: absolute;
  top: 70px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 1000;
  min-width: 150px;
  pointer-events: none;
`;

const AddEventInstructions = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  font-size: 16px;
  pointer-events: none;
  z-index: 1000;
`;

// Add this new styled component near the other styled components
const UserLocationMarker = styled.div`
  width: 20px;
  height: 20px;
  background-color: #4285f4;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #4285f4;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: rgba(66, 133, 244, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
`;

// Create a custom icon for user location
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #4285f4;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 2px #4285f4, 0 0 10px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Map controls component that handles location and zoom
function MapControlsComponent({ setUserLocation }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationClick = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Location services are not supported by your browser');
      return;
    }

    setIsLocating(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
      map.flyTo([latitude, longitude], 16, { duration: 2 });
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please check your location permissions.');
    } finally {
      setIsLocating(false);
    }
  }, [map, setUserLocation]);

  return (
    <MapControlsContainer>
      <MapControlButton 
        onClick={handleLocationClick} 
        title="Find my location"
        className="map-control-button"
        isLocating={isLocating}
      >
        {isLocating ? '⌛' : '📍'}
      </MapControlButton>
    </MapControlsContainer>
  );
}

// Map click handler component
function MapClickHandler({ onLocationSelect, isPlacingPin }) {
  useMapEvents({
    click: (e) => {
      if (isPlacingPin) {
        onLocationSelect([e.latlng.lng, e.latlng.lat]);
      }
    }
  });

  return null;
}

const SIZE_DIMENSIONS = {
  base: 40,    // Base size for far-future events (was 30)
  medium: 50,  // Medium size for upcoming events (was 40)
  large: 60    // Large size for imminent events (was 50)
};

const PIN_SIZES = {
  music: 'L',    // Large for music events
  art: 'M',      // Medium for art exhibitions
  social: 'S',   // Small for social gatherings
  film: 'L',     // Large for film events
  food: 'M'      // Medium for food events
};

// Add this helper function before the MapView component
const parseCoordinates = (coordString) => {
  const match = coordString.match(/^\((-?\d+\.?\d*),(-?\d+\.?\d*)\)$/);
  if (!match) return null;
  return [parseFloat(match[2]), parseFloat(match[1])]; // Return [lng, lat] for Leaflet
};

export default function MapView({ events = [], setEvents }) {
  const router = useRouter();
  const [position, setPosition] = useState([31.2304, 121.4737]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  // Debug events data
  useEffect(() => {
    console.log('Events received:', events);
    console.log('Filtered events:', filteredEvents);
  }, [events, filteredEvents]);
  
  // Update filteredEvents when events prop changes
  useEffect(() => {
    console.log('Event data structure:', events.map(event => ({
      id: event.id,
      coordinates: event.coordinates,
      parsed: parseCoordinates(event.coordinates)
    })));
    setFilteredEvents(events);
  }, [events]);
  
  // Update filtered events when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
    
    setFilteredEvents(filtered);
  }, [searchQuery, events]);
  
  // Test weather API on mount
  useEffect(() => {
    console.log('MapView mounted, testing weather API...');
    testWeatherAPI().catch(error => {
      console.error('Error in testWeatherAPI:', error);
    });
  }, []);
  
  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      console.log('Fetching weather data...');
      try {
        const data = await getWeather();
        console.log('Weather data fetched:', data);
        if (data) {
          setWeatherData(data);
          setWeatherError(null);
        } else {
          setWeatherError('Unable to load weather data');
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError('Unable to load weather data');
      }
    };
    
    fetchWeather();
    // Update weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper function to get color based on event category
  const getCategoryColor = (category) => {
    const colors = {
      music: '#2196F3',
      art: '#9C27B0',
      social: '#FF9800',
      film: '#F44336',
      food: '#4CAF50'
    };
    
    return colors[category] || '#ff5722';
  };

  // Create custom marker icon for each event
  const createMarkerIcon = (event) => {
    const now = new Date();
    const eventStart = new Date(`${event.date} ${event.time}`);
    const daysUntil = Math.ceil((eventStart - now) / (1000 * 60 * 60 * 24));
    
    // Calculate pin size based on time proximity
    let size;
    if (daysUntil <= 1) {
      size = SIZE_DIMENSIONS.large;     // Today or tomorrow
    } else if (daysUntil <= 7) {
      size = SIZE_DIMENSIONS.medium;    // Within a week
    } else {
      size = SIZE_DIMENSIONS.base;      // More than a week away
    }
    
    const borderSize = Math.max(3, size * 0.05); // Increased minimum border size from 2 to 3
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background-image: url(${event.poster});
        background-size: cover;
        background-position: center;
        border-radius: ${size * 0.2}px;
        border: ${borderSize}px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: all 0.3s ease;
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };
  
  // Handle marker click
  const handleMarkerClick = (event) => {
    console.log('Marker clicked for event:', event);
    setSelectedImage(event.poster);
  };
  
  // Handle add event button click
  const handleAddEventClick = () => {
    setIsPlacingPin(true);
  };

  const handleLocationSelect = (coordinates) => {
    setSelectedLocation(coordinates);
    setIsPlacingPin(false);
  };

  const handleEventSubmit = async (eventData) => {
    try {
      // Debug logs
      console.log('Event data received:', eventData);
      console.log('Coordinates:', eventData.coordinates);

      // Parse the coordinates back to array format
      const coordsMatch = eventData.coordinates.match(/^\((-?\d+\.?\d*),(-?\d+\.?\d*)\)$/);
      if (!coordsMatch) {
        throw new Error('Invalid coordinates format');
      }

      // Convert back to array format for the API
      const [_, lat, lng] = coordsMatch;
      const data = await submitEvent({
        ...eventData,
        coordinates: [lng, lat] // API expects [lng, lat] format
      });

      // Show success toast
      toast.success('Event submitted for approval');

      // Refresh events list using getEvents
      try {
        const updatedEvents = await getEvents();
        console.log('Updated events:', updatedEvents);
        
        // Only update if we get valid data
        if (Array.isArray(updatedEvents) && updatedEvents.length > 0) {
          setEvents(updatedEvents);
          setFilteredEvents(updatedEvents);
        } else {
          console.log('Keeping existing events as updatedEvents was empty or invalid');
        }
      } catch (error) {
        console.error('Error fetching updated events:', error);
        // Don't show error toast as the event was submitted successfully
        console.log('Keeping existing events due to refresh error');
      }

      return data;
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error(error.message || 'Failed to create event. Please try again.');
      throw error;
    }
  };

  // Get weather emoji
  const getWeatherEmoji = () => {
    if (!weatherData) return '🌡️';
    const code = weatherData.weather[0].id;
    if (code === 800) return '☀️';
    if (code >= 801 && code <= 804) return '☁️';
    if (code >= 500 && code <= 531) return '🌧️';
    if (code >= 600 && code <= 622) return '🌨️';
    if (code >= 701 && code <= 781) return '🌫️';
    if (code >= 200 && code <= 232) return '⛈️';
    return '🌡️';
  };

  // Get initial user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting initial location:', error);
        }
      );
    }
  }, []);

  return (
    <>
      <MapContainerStyled isPlacingPin={isPlacingPin}>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              style={{
                border: 'none',
                background: 'none',
                padding: '0 10px',
                cursor: 'pointer',
                color: '#999'
              }}
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </SearchBar>

        {isPlacingPin && (
          <AddEventInstructions>
            Click on the map to place your event
          </AddEventInstructions>
        )}

        {weatherError ? (
          <WeatherOverlay style={{ backgroundColor: 'rgba(255, 200, 200, 0.95)' }}>
            ⚠️ {weatherError}
          </WeatherOverlay>
        ) : weatherData && (
          <WeatherOverlay>
            {getWeatherEmoji()}
            {Math.round(weatherData.main.temp)}°C
            {' '}{weatherData.weather[0].description}
          </WeatherOverlay>
        )}
        
        <MapContainer 
          center={position} 
          zoom={12} 
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />
          <ZoomControl position="bottomright" />
          <MapControlsComponent setUserLocation={setUserLocation} />
          <MapClickHandler 
            onLocationSelect={handleLocationSelect}
            isPlacingPin={isPlacingPin}
          />
          
          {userLocation && (
            <Marker
              position={userLocation}
              icon={createUserLocationIcon()}
            >
              <Popup closeButton={false}>You are here</Popup>
            </Marker>
          )}
          
          {filteredEvents.map((event) => {
            const position = parseCoordinates(event.coordinates);
            if (!position) return null;
            
            return (
              <Marker
                key={event.id}
                position={position}
                icon={createMarkerIcon(event)}
                eventHandlers={{
                  click: () => handleMarkerClick(event),
                }}
              />
            );
          })}
        </MapContainer>
        
        {selectedImage && (
          <FullImageView 
            imageUrl={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
        
        {selectedLocation && (
          <EventCreationModal
            coordinates={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            onSubmit={handleEventSubmit}
          />
        )}
        
        <AddEventButton 
          onClick={handleAddEventClick}
          style={{ opacity: isPlacingPin ? 0.5 : 1 }}
        >
          {isPlacingPin ? '×' : '+'}
        </AddEventButton>
      </MapContainerStyled>
      
      <BottomNav active="map" />
    </>
  );
}
