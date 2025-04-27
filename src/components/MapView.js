import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomNav from './BottomNav';
import FullImageView from './FullImageView';
import PosterCreationModal from './PosterCreationModal';
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
    cursor: ${props => props.isPlacingPin ? `crosshair`  : 'grab'};
  }

  .leaflet-tile-pane {
    transition: all 0.5s ease;
  }

  .leaflet-control-zoom {
    right: env(safe-area-inset-right, 16px);
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

  /* Custom cursor styles */
  .leaflet-grab {
    cursor: ${props => props.isPlacingPin ? 'crosshair' : 'grab'};
  }

  .leaflet-dragging .leaflet-grab {
    cursor: ${props => props.isPlacingPin ? 'crosshair' : 'grabbing'};
  }

  /* Add custom cursor with color */
  ${props => props.isPlacingPin && `
    .leaflet-container,
    .leaflet-grab,
    .leaflet-dragging .leaflet-grab {
      cursor: crosshair !important;
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ff5722' stroke-width='2'%3E%3Cline x1='12' y1='2' x2='12' y2='22'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3C/svg%3E") 12 12, crosshair !important;
    }
  `}
`;

const SearchBar = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 300px;
  height: 40px;
  background-color: white;
  border: 1px solid #222;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 1000;
`;

const SearchIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: black;
  font-weight: bold;
  
  &::before {
    content: "🔍";
    font-size: 14px;
  }
`;

const SearchInput = styled.input`
  border: none;
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  color: black;
  background: transparent;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #999;
    font-weight: normal;
  }
`;

const AppTips = styled.div`
  position: absolute;
  top: 60px;
  left: 10px;
  background-color: white;
  border: 1px solid #222;
  padding: 8px 12px;
  z-index: 1000;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0;
  width: 300px;
`;

const TipItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  color: black;
`;

const TipIcon = styled.span`
  font-size: 14px;
`;

const MapControlsContainer = styled.div.attrs({
  className: 'leaflet-control'
})`
  position: absolute;
  right: 10px;
  bottom: 160px;
  z-index: 1000;
  background: white;
  border-radius: 4px;

  /* Only adjust bottom padding for safe area */
  @media (max-width: 768px) {
    bottom: calc(160px + env(safe-area-inset-bottom, 0px));
  }
`;

const MapControlButton = styled.a.attrs({
  className: 'leaflet-control-zoom-in',
  href: '#',
  role: 'button',
  'aria-label': 'Find my location'
})`
  width: 42px !important;
  height: 42px !important;
  line-height: 42px !important;
  text-align: center !important;
  text-decoration: none !important;
  color: #333 !important;
  font-size: 18px !important;
  display: block !important;
  background-color: #fff !important;
  border: 1px solid #222 !important;
  border-radius: 4px !important;
  opacity: ${props => props.isLocating ? 0.6 : 1};
  margin: 0 !important;
  padding: 0 !important;

  &:hover {
    background-color: #f8f8f8 !important;
  }

  &:active {
    background-color: #f0f0f0 !important;
  }
`;

const PinPosterButton = styled.button`
  width: 60px;
  height: 60px;
  background-color: black;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  font-weight: bold;
  border: 1px solid #222;
  cursor: pointer;
  z-index: 400;
  
  &:hover {
    background-color: white;
    color: black;
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
  background-color: white;
  padding: 8px 12px;
  border: 1px solid #222;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;
  min-width: 150px;
  pointer-events: none;
`;

const AddEventInstructions = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  color: black;
  padding: 15px 25px;
  border: 1px solid #222;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  pointer-events: none;
  z-index: 1000;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Add this new styled component near the other styled components
const UserLocationMarker = styled.div`
  width: 20px;
  height: 20px;
  background-color: #4285f4;
  border-radius: 50%;
  border: 1px solid white;
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
        border: 1px solid white;
        box-shadow: 0 0 0 2px #4285f4, 0 0 10px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

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
  return [parseFloat(match[1]), parseFloat(match[2])]; // Return [lat, lng] for Leaflet
};

const MAX_MARKER_WIDTH = 60;
const MAX_MARKER_HEIGHT = 60;

// --- LocationFlyToHandler ---
function LocationFlyToHandler({ flyToRequest, setFlyToRequest, setUserLocation, setIsLocating }) {
  const map = useMap();
  useEffect(() => {
    if (flyToRequest) {
      console.log('LocationFlyToHandler triggered');
      if (!navigator.geolocation) {
        alert('Location services are not supported by your browser');
        setIsLocating(false);
        setFlyToRequest(false);
        return;
      }
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          map.flyTo([latitude, longitude], 16, { duration: 2 });
          setIsLocating(false);
          setFlyToRequest(false);
        },
        (error) => {
          alert('Unable to get your location. Please check your location permissions.');
          setIsLocating(false);
          setFlyToRequest(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [flyToRequest, map, setUserLocation, setIsLocating, setFlyToRequest]);
  return null;
}

export default function MapView({ events = [], setEvents, onNav }) {
  const router = useRouter();
  const [position, setPosition] = useState([31.2304, 121.4737]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosters, setFilteredPosters] = useState(events);
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [imageSizes, setImageSizes] = useState({}); // { [posterId]: { width, height } }
  const [locationFlyToRequest, setLocationFlyToRequest] = useState(false);
  const mapRef = useRef(null);
  
  // Update filtered posters when events prop changes
  useEffect(() => {
    setFilteredPosters(events);
  }, [events]);
  
  // Update filtered posters when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosters(events);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = events.filter(poster => 
      (poster.title || '').toLowerCase().includes(query) ||
      (poster.location || '').toLowerCase().includes(query) ||
      (poster.description || '').toLowerCase().includes(query) ||
      poster.category.toLowerCase().includes(query)
    );
    
    setFilteredPosters(filtered);
  }, [searchQuery, events]);
  
  // Fetch posters periodically
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch('/api/posters');
        const posters = await response.json();
        if (Array.isArray(posters)) {
          setEvents(posters); // Update parent state
        }
      } catch (error) {
        console.error('Error fetching posters:', error);
      }
    };

    // Fetch immediately
    fetchPosters();

    // Then fetch every 30 seconds
    const interval = setInterval(fetchPosters, 30000);
    
    return () => clearInterval(interval);
  }, [setEvents]);
  
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

  // Load image sizes for posters with images
  useEffect(() => {
    const newSizes = {};
    let changed = false;
    events.forEach((poster) => {
      if (poster.poster_image && !imageSizes[poster.id]) {
        const img = new window.Image();
        img.onload = function () {
          let width = img.naturalWidth;
          let height = img.naturalHeight;
          // Fit within max dimensions, preserving aspect ratio
          const ratio = Math.min(
            MAX_MARKER_WIDTH / width,
            MAX_MARKER_HEIGHT / height,
            1
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
          setImageSizes((prev) => ({ ...prev, [poster.id]: { width, height } }));
        };
        img.src = poster.poster_image;
      }
    });
    // eslint-disable-next-line
  }, [events]);

  // Helper function to get color based on category
  const getCategoryColor = (category) => {
    const colors = {
      general: '#ff5722',
      event: '#2196F3',
      announcement: '#9C27B0',
      community: '#4CAF50',
      other: '#FF9800'
    };
    
    return colors[category] || '#ff5722';
  };

  // Create custom marker icon for each poster
  const createMarkerIcon = (poster) => {
    const now = new Date();
    const displayUntil = new Date(poster.display_until);
    const daysUntil = Math.ceil((displayUntil - now) / (1000 * 60 * 60 * 24));
    let baseSize;
    if (daysUntil <= 3) {
      baseSize = SIZE_DIMENSIONS.large;
    } else if (daysUntil <= 7) {
      baseSize = SIZE_DIMENSIONS.medium;
    } else {
      baseSize = SIZE_DIMENSIONS.base;
    }
    const borderSize = 1;
    const categoryColor = getCategoryColor(poster.category);

    // If we have image size, use it for the icon size
    const imgSize = imageSizes[poster.id];
    if (poster.poster_image && imgSize) {
      const imgStyle = 'width: 100%; height: 100%; display: block; box-sizing: border-box; vertical-align: bottom; margin: 0; padding: 0; object-fit: fill;';
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            border: ${borderSize}px solid black;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            width: ${imgSize.width}px;
            height: ${imgSize.height}px;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          ">
            <img 
              src="${poster.poster_image}" 
              style="${imgStyle}"
              onerror="this.style.display='none'; this.parentElement.style.backgroundColor='${categoryColor}';"
            />
          </div>
        `,
        iconSize: [imgSize.width, imgSize.height],
        iconAnchor: [imgSize.width / 2, imgSize.height / 2],
      });
    }
    // Fallback: brutalist square
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          position: relative;
          width: ${baseSize}px;
          height: ${baseSize}px;
          border: ${borderSize}px solid black;
          background-color: ${categoryColor};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          font-size: ${baseSize * 0.3}px;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">
          ${poster.category.charAt(0).toUpperCase()}
        </div>
      `,
      iconSize: [baseSize, baseSize],
      iconAnchor: [baseSize / 2, baseSize / 2],
    });
  };
  
  // Handle marker click
  const handleMarkerClick = (poster) => {
    console.log('Marker clicked for poster:', poster);
    setSelectedImage(poster.poster_image);
  };
  
  // Handle pin poster button click
  const handlePinPosterClick = () => {
    setIsPlacingPin(true);
  };

  const handleLocationSelect = (coordinates) => {
    setSelectedLocation(coordinates);
    setIsPlacingPin(false);
  };

  const handleEventSubmit = async (posterData) => {
    try {
      // No need to parse coordinates or show toast here
      // PosterCreationModal handles all of that
      const data = await posterData;
      
      // Refresh posters list
      try {
        const response = await fetch('/api/posters');
        const updatedPosters = await response.json();
        
        if (Array.isArray(updatedPosters)) {
          setEvents(updatedPosters);
          setFilteredPosters(updatedPosters);
        }
      } catch (error) {
        console.error('Error fetching updated posters:', error);
      }

      return data;
    } catch (error) {
      console.error('Error handling poster submission:', error);
      // Don't show toast here, let PosterCreationModal handle errors
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

  const handleMapClick = (e) => {
    if (isPlacingPin) {
      setSelectedCoordinates([e.latlng.lat, e.latlng.lng]);
      setIsModalOpen(true);
      setIsPlacingPin(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCoordinates(null);
  };

  const handleLocationClick = useCallback(() => {
    console.log('Location button clicked');
    setLocationFlyToRequest(true);
  }, []);

  return (
    <>
      <MapContainerStyled isPlacingPin={isPlacingPin}>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search posters and places..."
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
            Click on the map to place your poster
          </AddEventInstructions>
        )}

        {weatherData && (
          <AppTips>
            <TipItem>
              <TipIcon>{getWeatherEmoji()}</TipIcon>
              <span>{Math.round(weatherData.main.temp)}°C</span>
            </TipItem>
            <TipItem>
              <TipIcon>-</TipIcon>
              <span>Click [+] to add event</span>
            </TipItem>
            <TipItem>
              <TipIcon>-</TipIcon>
              <span>Drag to move map</span>
            </TipItem>
          </AppTips>
        )}
        
        <MapContainer 
          center={position} 
          zoom={12} 
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />
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
          
          {filteredPosters.map((poster) => {
            const position = parseCoordinates(poster.coordinates);
            if (!position) return null;
            
            return (
              <Marker
                key={poster.id}
                position={position}
                icon={createMarkerIcon(poster)}
                eventHandlers={{
                  click: () => handleMarkerClick(poster),
                }}
              />
            );
          })}
          <LocationFlyToHandler
            flyToRequest={locationFlyToRequest}
            setFlyToRequest={setLocationFlyToRequest}
            setUserLocation={setUserLocation}
            setIsLocating={setIsLocating}
          />
        </MapContainer>
        
        {selectedImage && (
          <FullImageView 
            imageUrl={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
        
        {selectedLocation && (
          <PosterCreationModal
            onClose={() => {
              setIsModalOpen(false);
              setSelectedLocation(null);
            }}
            coordinates={selectedLocation}
            onSubmit={handleEventSubmit}
          />
        )}
        
        {isPlacingPin && (
          <PinPosterButton onClick={() => setIsPlacingPin(false)}>
            ×
          </PinPosterButton>
        )}
        {!isPlacingPin && (
          <PinPosterButton onClick={handlePinPosterClick}>
            +
          </PinPosterButton>
        )}
      </MapContainerStyled>
      
      <BottomNav 
        active="map" 
        onLocationClick={handleLocationClick}
        isLocating={isLocating}
        onNav={onNav}
      />
    </>
  );
}
