import React from 'react';
import styled from 'styled-components';
import ModalCloseButton from './ModalCloseButton';

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

  /* Add safe area padding on mobile */
  @media (max-width: 768px) {
    bottom: env(safe-area-inset-bottom, 0px);
  }
`;

const Image = styled.img`
  max-width: 95%;
  max-height: calc(100% - 40px); /* Add some padding from container edges */
  object-fit: contain;

  /* Add safe area padding on mobile */
  @media (max-width: 768px) {
    max-height: calc(100vh - 80px - env(safe-area-inset-bottom, 0px));
  }
`;

const CloseIcon = styled.span`
  display: block;
  transform: translateY(-1px); /* Optical alignment */
`;
