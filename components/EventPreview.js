import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import FullImageView from './FullImageView';

const PreviewContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 120px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  display: flex;
  overflow: hidden;
  z-index: 1000;
  cursor: pointer;
`;

const PreviewImage = styled.div`
  width: 40%;
  background-color: #eee;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const PreviewContent = styled.div`
  width: 60%;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const PreviewTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
`;

const PreviewDate = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

const PreviewLocation = styled.div`
  font-size: 12px;
  color: #666;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

function EventPreview({ event, onClick, onClose }) {
  const navigate = useNavigate();
  const [showFullImage, setShowFullImage] = useState(false);
  
  const handleClick = (e) => {
    e.stopPropagation();
    setShowFullImage(true);
  };
  
  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) onClose();
  };
  
  return (
    <>
      <PreviewContainer onClick={handleClick}>
        <PreviewImage image={event.poster} />
        <PreviewContent>
          <PreviewTitle>{event.title}</PreviewTitle>
          <PreviewDate>{event.date} • {event.time}</PreviewDate>
          <PreviewLocation>{event.location}</PreviewLocation>
        </PreviewContent>
        <CloseButton onClick={handleClose}>×</CloseButton>
      </PreviewContainer>
      {showFullImage && (
        <FullImageView 
          imageUrl={event.poster} 
          onClose={() => setShowFullImage(false)} 
        />
      )}
    </>
  );
}

export default EventPreview;
