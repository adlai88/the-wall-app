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
        Wallllll is a map app that allows users to find happenings around their city without registration or social interactions.
      </Description>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <SectionContent as="ul" style={{ paddingLeft: 20, margin: 0 }}>
          <li>Browse the map to discover posters pinned to locations.</li>
          <li>Tap on pins to view details.</li>
          <li>Add your own poster by uploading an image and pinning it to a location.</li>
          <li>Posters are displayed on the map for a maximum of 30 days before disappearing.</li>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>For Event Organizers</SectionTitle>
        <SectionContent>
          Promote your events by adding them to Wallllll. Simply upload your event poster, set the location and time, and submit for approval. Your event will be visible to all users after moderation.
        </SectionContent>
      </Section>

      <ContactSection>
        <Button onClick={() => window.open('mailto:feedback@example.com')}>
          Send Feedback
        </Button>
        <Button onClick={() => window.open('mailto:report@example.com')}>
          Make a Donation
        </Button>
        <IconContainer>
          <span>📱</span>
          <span>💬</span>
          <span>📍</span>
        </IconContainer>
      </ContactSection>
    </Container>
  );
}
