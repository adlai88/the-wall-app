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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  /* Ensure proper touch target size on mobile */
  @media (max-width: 768px) {
    top: env(safe-area-inset-top, 20px);
    right: env(safe-area-inset-right, 20px);
  }
`;

const CloseIcon = styled.span`
  display: block;
  transform: translateY(-1px); /* Optical alignment */
`;

function FullImageView({ imageUrl, onClose }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <FullImageContainer onClick={handleClick}>
      <Image src={imageUrl} alt="Event" onClick={(e) => e.stopPropagation()} />
      <CloseButton onClick={handleClick}>
        <CloseIcon>×</CloseIcon>
      </CloseButton>
    </FullImageContainer>
  );
}

export default FullImageView; 