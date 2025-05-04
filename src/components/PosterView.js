import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Sheet from './Sheet';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 400px; // Make space for the sheet
  
  @media (max-width: 768px) {
    padding-right: 0;
    flex-direction: column;
    align-items: stretch;
  }
`;

const ImageSection = styled.div`
  max-width: 800px;
  width: 100%;
  height: calc(100vh - 120px); // Add some padding top and bottom
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    display: none;
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
    max-height: 100%;
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
  
  @media (max-width: 768px) {
    padding: 24px;
    padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 120px); /* Increased from 80px to 120px */
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    -webkit-overflow-scrolling: touch;
  }
`;

const PosterTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const PosterDate = styled.div`
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PosterLocation = styled.div`
  font-size: 15px;
  color: #666;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PosterDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  margin: 0;
`;

export default function PosterView({ poster, onClose }) {
  if (!poster) return null;

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

  return (
    <>
      {/* Desktop: overlay with image on left, details in sheet */}
      <Overlay onClick={onClose}>
        <ImageSection onClick={e => e.stopPropagation()}>
          <ImageWrapper>
            <Image
              src={poster.poster_image}
              alt={poster.title || 'Event Poster'}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </ImageWrapper>
        </ImageSection>
      </Overlay>
      {/* Mobile: details sheet with image at top */}
      <Sheet open={true} onClose={onClose} baseIndex={9100}>
        <DetailsSection>
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
          <div style={{ color: '#888', fontSize: 15, marginBottom: 12 }}>
            {poster.category === 'event' && poster.event_start_date ? (
              <span aria-label={`Event date: ${formatEventDate(poster.event_start_date, poster.event_end_date)}`}>📅 {formatEventDate(poster.event_start_date, poster.event_end_date)}</span>
            ) : (
              <span aria-label={`Displayed until ${formatDate(poster.display_until)}`}>🗓️ Displayed until {formatDate(poster.display_until)}</span>
            )}
          </div>
          <PosterLocation>
            <span>📍</span>
            {poster.location && poster.location.trim() ? (
              poster.location
            ) : poster.coordinates ? (
              (() => {
                // Try to parse coordinates as (lat,lon) or [lat,lon]
                let lat = '', lon = '';
                const match = poster.coordinates.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
                if (match) {
                  lat = match[1];
                  lon = match[2];
                }
                return lat && lon ? `Latitude: ${lat}, Longitude: ${lon}` : 'Location not specified';
              })()
            ) : (
              'Location not specified'
            )}
          </PosterLocation>
          {poster.description && (
            <PosterDescription>{poster.description}</PosterDescription>
          )}
        </DetailsSection>
      </Sheet>
    </>
  );
} 