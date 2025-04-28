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
    display: none; // Hide on mobile, sheet will take full width
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
`;

const DetailsSection = styled.div`
  width: 100%;
  background: white;
  padding: 32px;
  overflow-y: auto;
  height: 100%;
  
  @media (max-width: 768px) {
    padding: 24px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
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

  return (
    <>
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
      
      <Sheet open={true} onClose={onClose} baseIndex={9100}>
        <DetailsSection>
          <PosterTitle>{poster.title || 'Untitled Poster'}</PosterTitle>
          
          <PosterDate>
            <span>📅</span>
            {new Date(poster.display_until).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
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