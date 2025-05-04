import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Sheet from './Sheet';
import ModalCloseButton from './ModalCloseButton';

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
        <DetailsSection style={{ position: 'relative' }}>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
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
          <PosterDate>
            <span>📅</span>
            Displayed until {formatDate(poster.display_until)}
          </PosterDate>
          <PosterLocation>
            <span>📍</span>
            {poster.location || 'Location not specified'}
          </PosterLocation>
          {poster.description && (
            <PosterDescription>{poster.description}</PosterDescription>
          )}
        </DetailsSection>
      </Sheet>
    </>
  );
} 