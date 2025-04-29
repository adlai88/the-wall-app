import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0 16px;
  color: #333;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: #ff5722;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 32px;
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
      <Logo>TW</Logo>
      <Description>
        Wallllll is a map-based event discovery application that allows users to find happenings around their city without registration or social interactions.
      </Description>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <SectionContent>
          Browse the map to discover posters pinned to locations. Tap on pins to view details. Add your own poster by uploading an image and pinning it to a location.
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
