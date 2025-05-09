import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Sheet from './Sheet';
import { FiCalendar, FiClock, FiMapPin, FiLink } from 'react-icons/fi';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.32);
  z-index: 9000;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 0;
  pointer-events: auto;
  cursor: pointer;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
`;

const ImageSection = styled.div`
  max-width: 800px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
  padding: 40px;
  box-sizing: border-box;
  padding-top: 32px;
  @media (max-width: 768px) {
    display: none;
    padding: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 9200;
  background: none;
  border: none;
  font-size: 28px;
  color: #888;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 10px;
  transition: background 0.15s;
  &:hover {
    background: #f5f5f5;
    color: #222;
  }
`;

const MobileImage = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    position: relative;
    background: #eee;
    margin-bottom: 16px;
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      display: block;
      width: 100%;
      height: auto;
      max-height: 60vh;
      object-fit: contain;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
    max-height: calc(100vh - 120px);
    object-fit: contain;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    height: 100%;
  }
`;

const DetailsSection = styled.div`
  width: 100%;
  background: white;
  padding: 32px;
  flex: 1 1 auto;
  text-align: left;
  @media (max-width: 768px) {
    padding: 24px;
    padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 120px); /* Increased from 80px to 120px */
    border-top-left-radius: ${props => props.context === 'list' ? '16px' : '0'};
    border-top-right-radius: ${props => props.context === 'list' ? '16px' : '0'};
    -webkit-overflow-scrolling: touch;
  }
`;

const PosterTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #888;
  font-family: inherit;
  margin-bottom: 8px;
  gap: 8px;
`;

const PosterLocation = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-family: inherit;
  text-align: left;
  gap: 8px;
  padding-left: 0;
`;

const LinkRow = styled.div`
  font-size: 15px;
  color: #888;
  font-family: inherit;
  display: flex;
  align-items: center;
  text-align: left;
  margin: 0 0 8px 0;
  gap: 8px;
`;

const PosterDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  font-family: inherit;
  margin: 0;
  margin-bottom: 1em;
  text-align: left;
`;

const DesktopSidebarWrapper = styled.div`
  position: relative;
  width: 400px;
  max-width: 100vw;
  background: white;
  padding: 32px;
  flex: 1 1 auto;
  height: 100vh;
  overflow-y: auto;
  box-shadow: -2px 0 12px rgba(0,0,0,0.08);
  z-index: 9101;
`;

const MetaSection = styled.div`
  margin-bottom: 42px;
`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function PosterView({ poster, onClose, context = 'map' }) {
  const isMobile = useIsMobile();
  if (!poster || isMobile === null) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // If the display date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // If the display date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventDate = (start, end) => {
    if (!start) return '';
    const startDate = new Date(start);
    if (!end || end === start) {
      return startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const endDate = new Date(end);
    // If same month/year, show as 'June 1–3, 2024'
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return `${startDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    // Otherwise, show full range
    return `${startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} – ${endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  // Handler to close only if clicking on the overlay, not the sidebar or image
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Only render Overlay for desktop or for mobile if not context 'list'
  if (isMobile && context === 'list') {
    // Only render the Sheet (no Overlay)
    return (
      <Sheet open={true} onClose={onClose} baseIndex={9100} context={context}>
        <DetailsSection context={context}>
          <MobileImage>
            <Image
              src={poster.poster_image}
              alt={poster.title || 'Event Poster'}
              width={800}
              height={1200}
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '60vh', 
                objectFit: 'contain'
              }}
              priority
            />
          </MobileImage>
          <PosterTitle>{poster.title || 'Untitled Poster'}</PosterTitle>
          {/* Meta info section */}
          <MetaSection>
            <MetaRow>
              {poster.category === 'event' && poster.event_start_date ? (
                <>
                  <FiCalendar style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                  {formatEventDate(poster.event_start_date, poster.event_end_date)}
                </>
              ) : (
                <>
                  <FiClock style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                  Displayed until {formatDate(poster.display_until)}
                </>
              )}
            </MetaRow>
            <PosterLocation>
              <FiMapPin style={{ fontSize: 16, color: '#888', verticalAlign: 'middle', flexShrink: 0 }} />
              <span style={{ paddingLeft: 0 }}>{poster.location && poster.location.trim() ? poster.location : poster.coordinates ? (() => {
                let lat = '', lon = '';
                const match = poster.coordinates.match(/(-?\d+\.?\d*)[\,\s]+(-?\d+\.?\d*)/);
                if (match) {
                  lat = match[1];
                  lon = match[2];
                }
                return lat && lon ? `Latitude: ${lat}, Longitude: ${lon}` : 'Location not specified';
              })() : 'Location not specified'}</span>
            </PosterLocation>
            {poster.link && (
              <LinkRow>
                <FiLink style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                <a
                  href={poster.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#888', textDecoration: 'underline', fontWeight: 500, fontFamily: 'inherit', fontSize: 15 }}
                  title={poster.link}
                >
                  Link
                </a>
              </LinkRow>
            )}
          </MetaSection>
          {poster.description && (
              Array.isArray(poster.description)
                ? poster.description.map((para, idx) => (
                    <PosterDescription key={idx}>{para}</PosterDescription>
                  ))
                : poster.description.split(/\n{2,}/).map((para, idx) => (
                    <PosterDescription key={idx}>
                      {para.split(/\n/).map((line, i, arr) =>
                        i < arr.length - 1 ? [line, <br key={i} />] : line
                      )}
                    </PosterDescription>
                  ))
          )}
        </DetailsSection>
      </Sheet>
    );
  }

  // Default: render Overlay (desktop, or mobile map context)
  return (
    <>
      {/* Desktop: overlay with image on left, details in sidebar */}
      <Overlay onClick={handleOverlayClick}>
        <ImageSection onClick={handleOverlayClick} style={{ cursor: 'pointer' }}>
          <ImageWrapper onClick={handleOverlayClick} style={{ cursor: 'pointer' }}>
            <div className="poster-image-container" onClick={handleOverlayClick} style={{ cursor: 'pointer' }}>
              <img
                src={poster.poster_image}
                alt={poster.title || 'Poster'}
                className="poster-image"
                onClick={e => e.stopPropagation()}
                style={{ cursor: 'default' }}
              />
            </div>
          </ImageWrapper>
        </ImageSection>
        {!isMobile && (
          <DesktopSidebarWrapper onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
            <CloseButton onClick={onClose} aria-label="Close">×</CloseButton>
            <PosterTitle>{poster.title || 'Untitled Poster'}</PosterTitle>
            {/* Meta info section */}
            <MetaSection>
              <MetaRow>
                {poster.category === 'event' && poster.event_start_date ? (
                  <>
                    <FiCalendar style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                    {formatEventDate(poster.event_start_date, poster.event_end_date)}
                  </>
                ) : (
                  <>
                    <FiClock style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                    Displayed until {formatDate(poster.display_until)}
                  </>
                )}
              </MetaRow>
              <PosterLocation>
                <FiMapPin style={{ fontSize: 16, color: '#888', verticalAlign: 'middle', flexShrink: 0 }} />
                <span style={{ paddingLeft: 0 }}>{poster.location && poster.location.trim() ? poster.location : poster.coordinates ? (() => {
                  let lat = '', lon = '';
                  const match = poster.coordinates.match(/(-?\d+\.?\d*)[\,\s]+(-?\d+\.?\d*)/);
                  if (match) {
                    lat = match[1];
                    lon = match[2];
                  }
                  return lat && lon ? `Latitude: ${lat}, Longitude: ${lon}` : 'Location not specified';
                })() : 'Location not specified'}</span>
              </PosterLocation>
              {poster.link && (
                <LinkRow>
                  <FiLink style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                  <a
                    href={poster.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#888', textDecoration: 'underline', fontWeight: 500, fontFamily: 'inherit', fontSize: 15 }}
                    title={poster.link}
                  >
                    Link
                  </a>
                </LinkRow>
              )}
            </MetaSection>
            {poster.description && (
              Array.isArray(poster.description)
                ? poster.description.map((para, idx) => (
                    <PosterDescription key={idx}>{para}</PosterDescription>
                  ))
                : poster.description.split(/\n{2,}/).map((para, idx) => (
                    <PosterDescription key={idx}>
                      {para.split(/\n/).map((line, i, arr) =>
                        i < arr.length - 1 ? [line, <br key={i} />] : line
                      )}
                    </PosterDescription>
                  ))
            )}
          </DesktopSidebarWrapper>
        )}
      </Overlay>
      {/* Mobile: details sheet with image at top */}
      {isMobile && (
      <Sheet open={true} onClose={onClose} baseIndex={9100} context={context}>
        <DetailsSection context={context}>
          <MobileImage>
            <Image
              src={poster.poster_image}
              alt={poster.title || 'Event Poster'}
              width={800}
              height={1200}
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '60vh', 
                objectFit: 'contain'
              }}
              priority
            />
          </MobileImage>
          <PosterTitle>{poster.title || 'Untitled Poster'}</PosterTitle>
          {/* Meta info section */}
          <MetaSection>
            <MetaRow>
              {poster.category === 'event' && poster.event_start_date ? (
                <>
                  <FiCalendar style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                  {formatEventDate(poster.event_start_date, poster.event_end_date)}
                </>
              ) : (
                <>
                  <FiClock style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                  Displayed until {formatDate(poster.display_until)}
                </>
              )}
            </MetaRow>
            <PosterLocation>
              <FiMapPin style={{ fontSize: 16, color: '#888', verticalAlign: 'middle', flexShrink: 0 }} />
              <span style={{ paddingLeft: 0 }}>{poster.location && poster.location.trim() ? poster.location : poster.coordinates ? (() => {
                let lat = '', lon = '';
                const match = poster.coordinates.match(/(-?\d+\.?\d*)[\,\s]+(-?\d+\.?\d*)/);
                if (match) {
                  lat = match[1];
                  lon = match[2];
                }
                return lat && lon ? `Latitude: ${lat}, Longitude: ${lon}` : 'Location not specified';
              })() : 'Location not specified'}</span>
            </PosterLocation>
            {poster.link && (
              <LinkRow>
                <FiLink style={{ fontSize: 16, color: '#888', verticalAlign: 'middle' }} />
                <a
                  href={poster.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#888', textDecoration: 'underline', fontWeight: 500, fontFamily: 'inherit', fontSize: 15 }}
                  title={poster.link}
                >
                  Link
                </a>
              </LinkRow>
            )}
          </MetaSection>
          {poster.description && (
              Array.isArray(poster.description)
                ? poster.description.map((para, idx) => (
                    <PosterDescription key={idx}>{para}</PosterDescription>
                  ))
                : poster.description.split(/\n{2,}/).map((para, idx) => (
                    <PosterDescription key={idx}>
                      {para.split(/\n/).map((line, i, arr) =>
                        i < arr.length - 1 ? [line, <br key={i} />] : line
                      )}
                    </PosterDescription>
                  ))
          )}
        </DetailsSection>
      </Sheet>
      )}
    </>
  );
} 