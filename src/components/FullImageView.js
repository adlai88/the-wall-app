import React from 'react';
import styled from 'styled-components';

const FullImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Image = styled.img`
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

function FullImageView({ imageUrl, onClose }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <FullImageContainer onClick={handleClick}>
      <Image src={imageUrl} alt="Event" onClick={(e) => e.stopPropagation()} />
      <CloseButton onClick={handleClick}>×</CloseButton>
    </FullImageContainer>
  );
}

export default FullImageView; 