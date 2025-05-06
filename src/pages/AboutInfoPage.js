import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const Container = styled.div`
  padding: 0 16px;
  color: #333;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 40px auto 32px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
`;

const Description = styled.p`
  text-align: left;
  line-height: 1.6;
  margin-bottom: 48px;
  color: #666;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const SectionContent = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const ContactSection = styled.div`
  margin-top: 48px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  background: transparent;
  border: 1px solid #eee;
  border-radius: 8px;
  font-family: inherit;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  color: #666;
`;

const QRModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.48);
  border-radius: 16px 16px 0 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QRModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px 24px 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;
`;

const QRImage = styled.img`
  width: 240px;
  height: 240px;
  object-fit: contain;
  margin-bottom: 16px;
`;

const CloseQRButton = styled.button`
  margin-top: 12px;
  padding: 8px 18px;
  background: #eee;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  &:hover { background: #f5f5f5; }
`;

export default function AboutInfoPage() {
  const [showQR, setShowQR] = React.useState(false);
  return (
    <Container>
      <Logo>
        <Image
          src="/wallllll_logo.png"
          alt="The Wall App Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </Logo>
      <Description>
        Wallllll is a global culture map that lets people discover happenings around their city (and the world) without registration or social interactions.
      </Description>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <SectionContent as="ul" style={{ paddingLeft: 20, margin: 0 }}>
          <li>Browse the map to discover posters.</li>
          <li>Tap on posters to view details.</li>
          <li>Add your own poster by pinning an image to a location.</li>
          <li>A poster could be for an event, an announcement, a photo, etc.</li>
          <li>Posters are visible to all users after moderation.</li>
          <li>Posters are displayed on the map for maximum of 30 days before disappearing.</li>
        </SectionContent>
      </Section>

      <ContactSection>
        <Button onClick={() => setShowQR(true)}>
          Donate
        </Button>
      </ContactSection>

      {showQR && (
        <QRModalOverlay onClick={() => setShowQR(false)}>
          <QRModalContent onClick={e => e.stopPropagation()}>
            <QRImage src="/qr-donate.png" alt="Donate QR Code" />
            <div style={{ color: '#333', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>Scan to donate via WeChat</div>
            <CloseQRButton onClick={() => setShowQR(false)}>Close</CloseQRButton>
          </QRModalContent>
        </QRModalOverlay>
      )}
    </Container>
  );
}
