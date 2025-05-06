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

export default function AboutInfoPage() {
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
        <Button onClick={() => window.open('mailto:feedback@example.com')}>
          Send Feedback
        </Button>
        <Button onClick={() => window.open('mailto:report@example.com')}>
          Make a Donation
        </Button>
      </ContactSection>
    </Container>
  );
}
