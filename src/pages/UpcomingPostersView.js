import { useState, useEffect, useContext, useRef } from 'react'
import Image from 'next/image'
import styled, { createGlobalStyle } from 'styled-components'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'
import PosterView from '../components/PosterView'
import { FiCalendar, FiMapPin, FiClock, FiSearch, FiX } from 'react-icons/fi'
import ReactDOM from 'react-dom'
import { UserLocationContext } from './_app'
import PlaceSuggestions from '../components/PlaceSuggestions'
import { toast } from 'sonner'
import { geocodePlace } from '../utils/geocode'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px)); /* Account for bottom nav + safe area */
  font-family: inherit;
`

const PosterList = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`

const PosterCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #222;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  gap: 15px;
  padding: 15px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`

const PosterImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f5f5f5;
  border: 1px solid #222;
`

const PosterInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const PosterTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
`

const DisplayUntil = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📅';
  }
`

const PosterLocation = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📍';
  }
`

const NoPosters = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
  background: white;
  border-radius: 12px;
  margin: 20px;
  border: 1px solid #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 12px;
  border: ${props => props.hideTableBorder ? 'none' : '1px solid #222'};
  box-shadow: ${props => props.hideTableBorder ? 'none' : '0 2px 4px rgba(0,0,0,0.04)'};
  margin: 0 auto;
  max-width: 700px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const TableHead = styled.thead`
  background: #fafafa;
`;

const TableHeader = styled.th`
  text-align: left;
  font-weight: 600;
  font-size: 15px;
  color: #222;
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 8px;
  vertical-align: middle;
  font-size: 15px;
  color: #222;
  background: #fff;
`;

const Thumb = styled.div`
  width: 48px;
  height: 48px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Domain = styled.div`
  font-size: 13px;
  color: #666;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const TitleCell = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExternalLink = styled.a`
  color: #222;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  &:hover {
    color: #ff5722;
  }
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    color: #222;
  }
`;

const MetaRow = styled.span`
  display: flex;
  align-items: flex-start;
  font-size: 13px;
  color: #888;
  gap: 6px;
  line-height: 1.4;
  margin-bottom: 2px;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #888;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BrowseButton = styled.button`
  margin-top: 18px;
  padding: 10px 22px;
  background: #eee;
  color: #444;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #ddd;
  }
`;

const SearchBar = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 40px;
  background-color: white;
  border: 1px solid #222;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 1000;
  margin-bottom: 15px;
`;

const SearchIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #666;
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

const LocationBanner = styled.div`
  width: 100%;
  background: none;
  padding: 4px 0 0 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
  font-weight: 400;
`;

const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: #ff5722;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 8px;
  margin-left: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CategoryScrollContainer = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  margin: 32px 0 6px 0;
  position: relative;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-left: 12px;
  padding-right: 12px;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 769px) {
    flex-wrap: wrap;
    overflow-x: visible;
    white-space: normal;
    padding-left: 0;
    padding-right: 0;
  }
`;

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  pointer-events: none;
  z-index: 1;
`;

const LeftBlur = styled(BlurOverlay)`
  left: 0;
  background: linear-gradient(to right, #fff 70%, rgba(255,255,255,0));
`;

const RightBlur = styled(BlurOverlay)`
  right: 0;
  background: linear-gradient(to left, #fff 70%, rgba(255,255,255,0));
`;

const NoDrawerOutline = createGlobalStyle`
  [role="dialog"], [role="dialog"] *:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// Helper to parse coordinates from string "(lng,lat)" to [lng, lat]
const parseCoordinates = (coordString) => {
  const match = coordString.match(/^\((-?\d+\.?\d*),(-?\d+\.?\d*)\)$/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
};

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Add a wrapper for the scrollable row and blurs
const CategoryScrollWrapper = styled.div`
  position: relative;
  margin: 32px 0 6px 0;
`;

export default function UpcomingPostersView({ posters = [], selectedCategory, setSelectedCategory, hideHeaders = false, hideTableBorder = false }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPoster, setSelectedPoster] = useState(null)
  const isMobile = useIsMobile();
  const { userLocation, error: geoError, loading: geoLoading } = useContext(UserLocationContext);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const categoryScrollRef = useRef(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(false);

  const categories = ['all', 'general', 'event', 'announcement', 'community', 'other']

  // Filter and sort posters by proximity if userLocation is available
  let filteredPosters = posters;
  const RADIUS_KM = 20; // Show posters within 20km
  
  // Use selected location if available, otherwise use user location
  const filterLocation = selectedLocation || (userLocation ? { lat: userLocation.lat, lon: userLocation.lon } : null);
  
  if (filterLocation) {
    filteredPosters = posters.filter(poster => {
      const coords = parseCoordinates(poster.coordinates || '');
      if (!coords) return false;
      const [lat, lng] = coords;
      const dist = getDistanceFromLatLonInKm(filterLocation.lat, filterLocation.lon, lat, lng);
      return dist <= RADIUS_KM;
    });
  }

  // Apply category and search filters
  filteredPosters = filteredPosters
    .filter(poster => {
      const matchesCategory = selectedCategory === 'all' || poster.category === selectedCategory
      const matchesSearch = (poster.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (poster.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      // Sort by event_start_date (if exists), then by display_until
      const aEvent = a.event_start_date ? new Date(a.event_start_date) : null;
      const bEvent = b.event_start_date ? new Date(b.event_start_date) : null;
      if (aEvent && bEvent) {
        return aEvent - bEvent;
      } else if (aEvent && !bEvent) {
        return -1;
      } else if (!aEvent && bEvent) {
        return 1;
      } else {
        // Neither has event_start_date, sort by display_until
        const dateA = new Date(a.display_until);
        const dateB = new Date(b.display_until);
        return dateA - dateB;
      }
    });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use debounced query for filtering and geocoding
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setPlaceSuggestions([]);
      setIsSearching(false);
      return;
    }

    const query = debouncedSearchQuery.toLowerCase().trim();
    
    // Improved geocoding logic
    if (query.length >= 2) {
      // Common location indicators
      const likelyLocation = 
        query.length > 3 || // Most city names are at least 4 chars
        query.includes(' ') || // Multi-word locations
        query.includes(',') || // Addresses often have commas
        /^[A-Z]/.test(query); // Proper nouns often start with capital letters

      if (likelyLocation) {
        setIsSearching(true);
        geocodePlace(query.trim()).then(results => {
          if (results && results.length > 0) {
            setPlaceSuggestions(results.map(place => ({
              ...place,
              address: place.display_name.split(', ').slice(1).join(', ')
            })));
          } else {
            setPlaceSuggestions([]);
          }
          setIsSearching(false);
        }).catch(err => {
          console.error('Error searching for places:', err);
          setPlaceSuggestions([]);
          setIsSearching(false);
        });
      } else {
        setPlaceSuggestions([]);
        setIsSearching(false);
      }
    } else {
      setPlaceSuggestions([]);
      setIsSearching(false);
    }
  }, [debouncedSearchQuery]);

  // Handle search input changes
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchQuery.toLowerCase().trim();
      
      // If we have place suggestions, use the first one
      if (placeSuggestions && placeSuggestions.length > 0) {
        handlePlaceSelect(placeSuggestions[0]);
        return;
      }
      
      // If no suggestions but query exists, try to search
      if (query.length >= 2) {
        toast.loading('Searching for place...');
        try {
          const results = await geocodePlace(query.trim());
          toast.dismiss();
          if (results && results.length > 0) {
            setPlaceSuggestions(results.map(place => ({
              ...place,
              address: place.display_name.split(', ').slice(1).join(', ')
            })));
            // Automatically select the first result
            handlePlaceSelect(results[0]);
          } else {
            toast.error(`No location found for "${query}"`);
          }
        } catch (err) {
          toast.dismiss();
          toast.error('Error searching for place');
        }
      }
    }
  };

  // Handle place selection from suggestions
  const handlePlaceSelect = (place) => {
    setSearchQuery('');
    setPlaceSuggestions(null);
    setSelectedLocation({
      lat: place.lat,
      lon: place.lon,
      name: place.display_name.split(',')[0]
    });
    toast.success(`Showing posters near ${place.display_name.split(',')[0]}`);
  };

  // Reset location to user's current location
  const handleResetLocation = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setPlaceSuggestions(null);
    toast.success('Showing posters near you');
  };

  const handlePosterClick = (poster) => {
    setSelectedPoster(poster);
  }

  const formatDate = (date) => {
    const displayUntil = new Date(date)
    return displayUntil.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatEventDate = (start, end) => {
    if (!start) return '';
    const startDate = new Date(start);
    if (!end || end === start) {
      return startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const endDate = new Date(end);
    // If same month/year, show as 'Jun 1–3, 2024'
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return `${startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    // Otherwise, show full range
    return `${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} – ${endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  useEffect(() => {
    if (!isMobile) {
      setShowLeftBlur(false);
      setShowRightBlur(false);
      return;
    }
    const el = categoryScrollRef.current;
    if (!el) return;
    const updateBlurs = () => {
      setShowLeftBlur(el.scrollLeft > 2);
      setShowRightBlur(el.scrollLeft + el.offsetWidth < el.scrollWidth - 2);
    };
    updateBlurs();
    el.addEventListener('scroll', updateBlurs);
    window.addEventListener('resize', updateBlurs);
    return () => {
      el.removeEventListener('scroll', updateBlurs);
      window.removeEventListener('resize', updateBlurs);
    };
  }, [isMobile, categories.length]);

  return (
    <>
      <NoDrawerOutline />
      <Container style={{ background: '#fff' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 600, margin: '0 auto' }}>
          <SearchBar>
            <SearchIcon>
              <FiSearch size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search posters and places..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '0 0 0 10px',
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: 16,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  transform: 'translateY(2px)'
                }}
                onClick={() => {
                  setSearchQuery('');
                  setPlaceSuggestions(null);
                  setIsSearching(false);
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </SearchBar>

          <PlaceSuggestions 
            suggestions={placeSuggestions} 
            onSelect={handlePlaceSelect}
            searchQuery={searchQuery}
            isSearching={isSearching}
            context="list"
          />
        </div>

        {(selectedLocation || userLocation) && (
          <LocationBanner>
            <LocationText>
              <FiMapPin size={16} />
              {selectedLocation ? (
                `Showing posters near ${selectedLocation.name}`
              ) : (
                'Showing posters near you'
              )}
            </LocationText>
            <ResetButton onClick={handleResetLocation}>
              Reset
            </ResetButton>
          </LocationBanner>
        )}

        <CategoryScrollWrapper>
          {isMobile && showLeftBlur && <LeftBlur />}
          <CategoryScrollContainer ref={categoryScrollRef}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? '#222' : '#f5f5f5',
                  color: selectedCategory === cat ? 'white' : '#222',
                  border: 'none',
                  borderRadius: 5,
                  padding: '4px 10px',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  outline: selectedCategory === cat ? '2px solid #222' : 'none',
                  boxShadow: selectedCategory === cat ? '0 2px 8px rgba(34,34,34,0.08)' : 'none',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </CategoryScrollContainer>
          {isMobile && showRightBlur && <RightBlur />}
        </CategoryScrollWrapper>

        <TableWrapper hideTableBorder={hideTableBorder}>
          <StyledTable>
            {!hideHeaders && (
              <TableHead>
                <TableRow>
                  <TableHeader>Content</TableHeader>
                  <TableHeader>Title</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
            )}
            <tbody>
              {isSearching ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <NoResultsContainer>
                      Searching...
                    </NoResultsContainer>
                  </TableCell>
                </TableRow>
              ) : filteredPosters.length > 0 ? (
                filteredPosters.map(poster => (
                  <TableRow key={poster.id} style={{ cursor: 'pointer' }} onClick={() => handlePosterClick(poster)}>
                    <TableCell>
                      <Thumb>
                        <Image
                          src={poster.poster_image || '/default-poster.jpg'}
                          alt={poster.title || 'Untitled Poster'}
                          width={48}
                          height={48}
                          style={{ objectFit: 'cover', width: 48, height: 48 }}
                        />
                      </Thumb>
                    </TableCell>
                    <TableCell>
                      <TitleCell>{poster.title || 'Untitled Poster'}</TitleCell>
                      <div style={{ color: '#888', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {poster.category === 'event' && poster.event_start_date ? (
                          <>
                            <MetaRow aria-label={`Event date: ${formatEventDate(poster.event_start_date, poster.event_end_date)}`}>
                              <FiCalendar style={{ marginRight: 6, fontSize: 14, color: '#888', flexShrink: 0, marginTop: 2 }} />
                              {formatEventDate(poster.event_start_date, poster.event_end_date)}
                            </MetaRow>
                          </>
                        ) : null}
                        <MetaRow>
                          <FiMapPin style={{ marginRight: 6, fontSize: 14, color: '#888', flexShrink: 0, marginTop: 2 }} />
                          {poster.location && poster.location.trim() ? (
                            poster.location
                          ) : poster.coordinates ? (
                            (() => {
                              let lat = '', lon = '';
                              const match = poster.coordinates.match(/(-?\d+\.?\d*)[\,\s]+(-?\d+\.?\d*)/);
                              if (match) {
                                lat = match[1];
                                lon = match[2];
                              }
                              return lat && lon ? `Latitude: ${lat}, Longitude: ${lon}` : 'Location not specified';
                            })()
                          ) : (
                            'Location not specified'
                          )}
                        </MetaRow>
                        <MetaRow aria-label={`Displayed until ${formatDate(poster.display_until)}`}>
                          <FiClock style={{ marginRight: 6, fontSize: 14, color: '#888', flexShrink: 0, marginTop: 2 }} />
                          Displayed until {formatDate(poster.display_until)}
                        </MetaRow>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionCell>
                        {poster.poster_url && (
                          <ExternalLink href={poster.poster_url} target="_blank" rel="noopener noreferrer" title="Open external link">
                            ↗
                          </ExternalLink>
                        )}
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <NoResultsContainer>
                      {selectedLocation ? (
                        `No posters found near ${selectedLocation.name}`
                      ) : (
                        'No posters found near you'
                      )}
                      <BrowseButton onClick={() => {
                        setSearchQuery('');
                        setPlaceSuggestions(null);
                        document.querySelector('input[type="text"]')?.focus();
                      }}>
                        Browse other locations
                      </BrowseButton>
                    </NoResultsContainer>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Container>

      {selectedPoster && (
        isMobile
          ? <PosterView poster={selectedPoster} onClose={() => setSelectedPoster(null)} />
          : (typeof window !== 'undefined' && document.getElementById('portal-root')
              ? ReactDOM.createPortal(
                  <PosterView poster={selectedPoster} onClose={() => setSelectedPoster(null)} />, 
                  document.getElementById('portal-root')
                )
              : null)
      )}
    </>
  )
} 