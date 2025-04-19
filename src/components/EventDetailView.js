import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Image from 'next/image';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
`;

const Header = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: #f8f8f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #eee;
  }
`;

const EventPoster = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  background-color: #eee;
`;

const TimeIndicator = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  z-index: 10;
`;

const EventDetails = styled.div`
  padding: 20px;
`;

const EventTitle = styled.h1`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const EventDate = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #666;
`;

const EventLocation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #666;
`;

const EventDescription = styled.div`
  margin-bottom: 20px;
  color: #333;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: none;
  cursor: pointer;
`;

const DirectionsButton = styled(ActionButton)`
  background-color: #f8f8f8;
  color: #333;
  
  &:hover {
    background-color: #eee;
  }
`;

const ShareButton = styled(ActionButton)`
  background-color: #ff5722;
  color: white;
  
  &:hover {
    background-color: #e64a19;
  }
`;

export default function EventDetailView({ eventId }) {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then(res => res.json())
        .then(data => {
          setEvent(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching event:', error);
          setLoading(false);
        });
    }
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const getTimeProximity = () => {
    const eventDate = new Date(event.date + ' ' + event.time);
    const now = new Date();
    const diffHours = Math.round((eventDate - now) / (1000 * 60 * 60));
    
    if (diffHours < 24) return 'Starting soon!';
    if (diffHours < 48) return 'Tomorrow';
    return event.date;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleDirections = () => {
    const [lng, lat] = event.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>←</BackButton>
        <div>{event.title}</div>
      </Header>

      <EventPoster>
        <TimeIndicator>{getTimeProximity()}</TimeIndicator>
        <Image
          src={event.poster}
          alt={event.title}
          layout="fill"
          objectFit="cover"
          priority
        />
      </EventPoster>

      <EventDetails>
        <EventTitle>{event.title}</EventTitle>
        <EventDate>📅 {event.date} at {event.time}</EventDate>
        <EventLocation>📍 {event.location}</EventLocation>
        <EventDescription>{event.description}</EventDescription>
      </EventDetails>

      <ActionButtons>
        <DirectionsButton onClick={handleDirections}>
          Get Directions
        </DirectionsButton>
        <ShareButton onClick={handleShare}>
          Share Event
        </ShareButton>
      </ActionButtons>
    </Container>
  );
} 