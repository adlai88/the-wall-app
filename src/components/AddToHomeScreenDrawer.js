import React from 'react';
import styled from 'styled-components';
import { Drawer } from 'vaul';
import ModalCloseButton from './ModalCloseButton';
import Image from 'next/image';
import { FiShare, FiPlusSquare } from 'react-icons/fi';

const DrawerContent = styled.div`
  background: #fff;
  width: 100vw;
  max-width: 100vw;
  min-height: 340px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
  padding: 24px 20px 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Handle = styled.div`
  width: 100px;
  height: 6px;
  background-color: #eee;
  border-radius: 99999px;
  margin-bottom: 18px;
`;

const AppIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  background: #fff;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-align: center;
`;

const Description = styled.p`
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 18px;
  text-align: center;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
`;

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const Step = styled.li`
  display: flex;
  align-items: flex-start;
  font-size: 1.13rem;
  margin-bottom: 14px;
  font-weight: 400;
  line-height: 1.5;
  & span.icon {
    margin-right: 10px;
    font-size: 22px;
    color: #222;
    display: flex;
    align-items: center;
    margin-top: 2px;
  }
  & .step-label {
    font-weight: 400;
    margin-left: 4px;
  }
`;

export default function AddToHomeScreenDrawer({ open, onClose }) {
  return (
    <Drawer.Root open={open} onOpenChange={onClose} modal forceMount>
      <Drawer.Portal>
        <Drawer.Overlay style={{ background: 'rgba(0,0,0,0.18)' }} />
        <Drawer.Content style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
          <DrawerContent>
            <Handle />
            <ModalCloseButton onClick={onClose} style={{ position: 'absolute', top: 12, right: 12 }} />
            <AppIcon>
              <Image src="/wallllll_logo.png" alt="App Icon" width={72} height={72} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </AppIcon>
            <Title>Add to Home Screen</Title>
            <Description>To install the app, add the website to your home screen.</Description>
            <Steps>
              <Step>
                <span style={{ fontWeight: 700, marginRight: 10 }}>1.</span>
                <span className="step-label">Tap the share icon</span>
                <span className="icon" style={{ marginLeft: 6 }}><FiShare size={22} color="#222" /></span>
              </Step>
              <Step>
                <span style={{ fontWeight: 700, marginRight: 10 }}>2.</span>
                <span className="step-label">Choose <span style={{ fontWeight: 500 }}>Add to home screen</span></span>
                <span className="icon" style={{ marginLeft: 6 }}><FiPlusSquare size={22} color="#222" /></span>
              </Step>
              <Step>
                <span style={{ fontWeight: 700, marginRight: 10 }}>3.</span>
                <span className="step-label">Open Wallllll app on your home screen</span>
              </Step>
            </Steps>
          </DrawerContent>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
} 