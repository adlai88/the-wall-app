import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const NavContainer = styled.div`
  height: 60px;
  background-color: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: ${props => props.active ? '#ff5722' : '#666'};
  cursor: pointer;
`;

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props => props.active ? '#ff5722' : '#ddd'};
  border-radius: 50%;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

function BottomNav({ active }) {
  const router = useRouter();
  
  return (
    <NavContainer>
      <NavItem 
        active={active === 'map'} 
        onClick={() => router.push('/')}
      >
        <NavIcon active={active === 'map'}>🗺️</NavIcon>
        <span>Map</span>
      </NavItem>
      <NavItem 
        active={active === 'upcoming'} 
        onClick={() => router.push('/upcoming')}
      >
        <NavIcon active={active === 'upcoming'}>📅</NavIcon>
        <span>Upcoming</span>
      </NavItem>
      <NavItem 
        active={active === 'about'} 
        onClick={() => router.push('/about')}
      >
        <NavIcon active={active === 'about'}>ℹ️</NavIcon>
        <span>About</span>
      </NavItem>
    </NavContainer>
  );
}

export default BottomNav;
