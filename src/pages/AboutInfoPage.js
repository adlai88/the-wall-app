import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: white;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
`;

const AppLogo = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ff5722;
  border-radius: 20px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const AppDescription = styled.div`
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.5;
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
`;

const SectionContent = styled.div`
  color: #666;
  line-height: 1.5;
  font-size: 14px;
`;

const ContactButton = styled.button`
  height: 44px;
  border-radius: 22px;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 15px;
  width: 100%;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #eee;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const VersionInfo = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 30px;
`;

function AboutInfoPage() {
  const router = useRouter();
  
  return (
    <>
      <Container>
        <ContentContainer>
          <AppLogo>TW</AppLogo>
          
          <AppDescription>
            The Wall is a map-based event discovery application for Shanghai that allows users to find events happening around the city without registration or social interactions.
          </AppDescription>
          
          <Section>
            <SectionTitle>How It Works</SectionTitle>
            <SectionContent>
              Browse the map to discover event posters pinned to locations around Shanghai. Tap on pins to view event details. Add your own events by uploading a poster and pinning it to a location.
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>For Event Organizers</SectionTitle>
            <SectionContent>
              Promote your events by adding them to The Wall. Simply upload your event poster, set the location and time, and submit for approval. Your event will be visible to all users after moderation.
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Contact Us</SectionTitle>
            <ContactButton>Send Feedback</ContactButton>
            <ContactButton>Report an Issue</ContactButton>
            
            <SocialLinks>
              <SocialIcon>📱</SocialIcon>
              <SocialIcon>💬</SocialIcon>
              <SocialIcon>📧</SocialIcon>
            </SocialLinks>
          </Section>
          
          <VersionInfo>
            Version 1.0.0 • © 2025 The Wall
          </VersionInfo>
        </ContentContainer>
      </Container>
      
      <BottomNav active="about" />
    </>
  );
}

export default AboutInfoPage;
