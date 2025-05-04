import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FiMap, FiNavigation, FiList, FiInfo } from 'react-icons/fi';

const NavContainer = styled.div`
  height: 60px;
  background-color: white;
  border-top: 1px solid #222;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  /* Remove isolation property */
  /* Add padding for iOS safe area */
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? 'black' : '#666'};
  cursor: pointer;
  letter-spacing: 0;
  flex: 1;
  max-width: 25%;
`;

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  /* background-color: ${props => props.$active ? 'black' : '#ddd'}; */
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$active ? 'black' : '#222'};
  font-size: 18px;
  font-weight: bold;
`;

const LocationButton = styled(NavItem)`
  color: ${props => props.$isLocating ? '#999' : '#666'};
  cursor: ${props => props.$isLocating ? 'wait' : 'pointer'};
`;

const AddPosterButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: black;
    color: white;
    font-size: 30px;
    font-weight: bold;
    border: 1px solid #222;
    cursor: pointer;
    margin: 0 10px;
    flex-shrink: 0;
    
    &:hover {
      background-color: white;
      color: black;
    }
  }
`;

function BottomNav({ active, onLocationClick, isLocating, onNav, onAddPoster }) {
  const router = useRouter();
  
  return (
    <NavContainer>
      <NavItem 
        $active={active === 'map'} 
        onClick={() => onNav ? onNav('map') : router.push('/')}
      >
        <NavIcon $active={active === 'map'}><FiMap size={18} /></NavIcon>
        <span>Map</span>
      </NavItem>
      <LocationButton
        $isLocating={isLocating}
        onClick={(e) => {
          console.log('LocationButton clicked', onLocationClick);
          if (typeof onLocationClick === 'function') {
            onLocationClick(e);
          }
        }}
        $active={false}
        aria-label="Current Location"
        tabIndex={0}
        role="button"
        style={{ outline: 'none' }}
      >
        <NavIcon $active={false}>
          <FiNavigation />
        </NavIcon>
        <span>Location</span>
      </LocationButton>
      <AddPosterButton onClick={onAddPoster} aria-label="Add Poster">
        +
      </AddPosterButton>
      <NavItem 
        $active={active === 'upcoming'} 
        onClick={() => onNav ? onNav('upcoming') : router.push('/upcoming')}
      >
        <NavIcon $active={active === 'upcoming'}><FiList size={18} /></NavIcon>
        <span>List</span>
      </NavItem>
      <NavItem 
        $active={active === 'about'} 
        onClick={() => onNav ? onNav('about') : router.push('/about')}
      >
        <NavIcon $active={active === 'about'}><FiInfo size={18} /></NavIcon>
        <span>About</span>
      </NavItem>
    </NavContainer>
  );
}

export default BottomNav;
