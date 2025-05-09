import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Drawer } from 'vaul';
import { FiX } from 'react-icons/fi';
import PosterView from './PosterView';
import Masonry from 'react-masonry-css';
import ReactDOM from 'react-dom';

// Helper hook to detect mobile (copied from UpcomingPostersView.js)
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

const DrawerContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Handle = styled.div`
  width: 100px;
  height: 6px;
  background-color: #eee;
  border-radius: 99999px;
  margin: 4px auto 16px auto;
`;

const MasonryGrid = styled(Masonry)`
  display: flex;
  padding-left: 0px;
  padding-right: 16px;
  padding-top: 0px;
  padding-bottom: 96px;
  width: auto;
  flex: 1;
  overflow-y: auto;
  margin-top: 0;
  margin-bottom: 96px;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    padding-left: 0px;
    padding-right: 12px;
    padding-top: 0px;
    padding-bottom: 32px;
    margin-top: 0;
  }

  & > div {
    padding-left: 16px;
    background-clip: padding-box;
    overflow: visible;
    @media (max-width: 768px) {
      padding-left: 12px;
    }
  }
`;

const GridItem = styled.div`
  background: white;
  border: 1px solid #222;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 16px;
  border-radius: 2px;
  box-shadow: none;
  
  &:hover {
    transform: scale(0.98);
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`;

const CityFilterContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 0 16px 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 768px) {
    padding-left: 12px;
    padding-bottom: 12px;
    padding-right: 0;
  }
`;

const CityFilter = styled.button`
  padding: 6px 12px;
  background: ${props => props.active ? '#222' : 'white'};
  color: ${props => props.active ? 'white' : '#222'};
  border: 1px solid #222;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#222' : '#f5f5f5'};
  }
`;

export default function GridView({ open, onClose, posters = [] }) {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Infinite scroll: number of posters to show
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  
  // Extract unique cities from posters
  useEffect(() => {
    const uniqueCities = [...new Set(posters.map(poster => poster.city))].filter(Boolean);
    setCities(uniqueCities);
  }, [posters]);
  
  // Filter posters by selected city
  let filteredPosters = selectedCity
    ? posters.filter(poster => poster.city === selectedCity)
    : posters;

  // Sort posters by most recent first (descending by created_at)
  filteredPosters = filteredPosters.slice().sort((a, b) => {
    // Fallback to id if no created_at
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return (b.id || 0) - (a.id || 0);
  });

  // Only show up to visibleCount posters
  const postersToShow = filteredPosters.slice(0, visibleCount);
  
  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 6,
    1600: 5,
    1200: 4,
    900: 3,
    600: 2,
    0: 2 // minimum 2 columns for all widths
  };
  
  const isMobile = useIsMobile();
  
  // Reset selectedPoster when drawer is closed or opened
  useEffect(() => {
    if (!open) {
      setSelectedPoster(null);
    }
  }, [open]);

  // Infinite scroll: load more when sentinel is visible
  useEffect(() => {
    if (!open) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setTimeout(() => {
            setVisibleCount(prev => {
              const next = prev + 10;
              loadingRef.current = false;
              return next;
            });
          }, 100); // Small delay for smoothness
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, filteredPosters.length]);

  // Wrap onClose to also clear selectedPoster
  const handleClose = () => {
    setSelectedPoster(null);
    if (onClose) onClose();
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleClose} modal forceMount>
      <Drawer.Portal>
        <Drawer.Overlay style={{ background: 'rgba(0,0,0,0.48)', zIndex: 9998, height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, right: 0 }} />
        <Drawer.Content 
          style={{ 
            position: 'fixed', 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 99999, 
            background: '#fff',
            width: '100%',
            height: 'calc(100% - 4vh)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
            padding: '16px 0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <DrawerContent>
            <Handle />
            
            <CityFilterContainer>
              <CityFilter
                active={!selectedCity}
                onClick={() => setSelectedCity(null)}
              >
                All Cities
              </CityFilter>
              {cities.map(city => (
                <CityFilter
                  key={city}
                  active={selectedCity === city}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </CityFilter>
              ))}
            </CityFilterContainer>
            
            <MasonryGrid
              breakpointCols={breakpointColumnsObj}
              className="masonry-grid"
              columnClassName="masonry-grid_column"
            >
              {postersToShow.map(poster => (
                <GridItem
                  key={poster.id}
                  onClick={() => setSelectedPoster(poster)}
                >
                  <img
                    src={poster.poster_image}
                    alt={poster.title || 'Poster'}
                    loading="lazy"
                  />
                </GridItem>
              ))}
              {/* Sentinel for infinite scroll */}
              {visibleCount < filteredPosters.length && (
                <div ref={sentinelRef} style={{ height: 1, width: '100%' }} />
              )}
            </MasonryGrid>

            {/* PosterView overlay using portal or inline on mobile */}
            {selectedPoster && (
              isMobile
                ? <PosterView poster={selectedPoster} onClose={() => setSelectedPoster(null)} context="list" />
                : (typeof window !== 'undefined' && document.getElementById('portal-root')
                    ? ReactDOM.createPortal(
                        <PosterView poster={selectedPoster} onClose={() => setSelectedPoster(null)} context="grid" />, 
                        document.getElementById('portal-root')
                      )
                    : null)
            )}
          </DrawerContent>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
} 