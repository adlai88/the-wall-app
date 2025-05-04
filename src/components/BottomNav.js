import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FiMap, FiNavigation, FiList, FiInfo } from 'react-icons/fi';

const NavContainer = styled.div`
  height: 90px;
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
  /* Add padding for iOS safe area and extra comfort */
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  padding-top: 16px;
`;

const NavItem = styled.div`