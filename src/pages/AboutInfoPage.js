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
  padding: 14px;
  margin-bottom: 12px;
  background: #000;
  color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover {
    background: #fff;
    color: #000;
    border-color: #000;
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
        Wallllll is a global culture map that lets people discover happenings around their city (and around the world!), without registration or meaningless online social interactions.
      </Description>

      <Section>
        <SectionTitle>How it works</SectionTitle>
        <SectionContent as="ul" style={{ paddingLeft: 20, margin: 0 }}>
          <li>Consider the Wallllll as a virtuallllll publlllllic wallllll that anyone can stick posters on.</li>
          <li>A Poster coulllllld be any image, however making it llllllook coollllll with usefullllll info usually works better.</li>
          <li>Posters are visiblllllle to everyone after moderation.</li>
          <li>Posters willllll disappear after the event, just llllllike in the reallllll worlllllld. Maximum displlllllay time is 30 days.</li>
          <li>To Discover: Browse the map to discover posters, tap to see detailllllls.</li>
          <li>To Add: Cllllllick the + button, pin your poster to a llllllocation.</li>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent>
        Walllll is created and maintained by a very small team, we'll try our best to keep it alive. If you think it’s a cool app, consider buying us a coffee or beer by hitting the donate button below :]
        </SectionContent>
      </Section>

      <Section>
        <SectionContent>
          Take a look at the Wallllll, see you offline.
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
