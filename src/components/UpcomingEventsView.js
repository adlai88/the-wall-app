import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import FullImageView from './FullImageView';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
`;

const Header = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const EventList = styled.div`
  flex: 1;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 15px;
  }
`;

const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const EventImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const EventInfo = styled.div`
  padding: 20px;
`;

const EventTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
`;

const EventDate = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📅';
  }
`;

const EventLocation = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📍';
  }
`;

const NoEvents = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
  background: #f8f8f8;
  border-radius: 12px;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  overflow-x: auto;
  background: white;
  border-bottom: 1px solid #eee;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: ${props => props.active ? '#ff5722' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#f4511e' : '#e0e0e0'};
  }
`;

export default function UpcomingEventsView({ events = [] }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['all', 'music', 'art', 'social', 'food', 'sports', 'tech'];

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

  const handleEventClick = (event) => {
    setSelectedImage(event.poster);
  };

  const formatDate = (date, time) => {
    const eventDate = new Date(`${date} ${time}`);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <Title>Upcoming Events</Title>
      </Header>

      <CategoryFilter>
        {categories.map(category => (
          <CategoryButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </CategoryButton>
        ))}
      </CategoryFilter>

      <EventList>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} onClick={() => handleEventClick(event)}>
              <EventImageWrapper>
                <Image
                  src={event.poster}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </EventImageWrapper>
              <EventInfo>
                <EventTitle>{event.title}</EventTitle>
                <EventDate>{formatDate(event.date, event.time)}</EventDate>
                <EventLocation>{event.location}</EventLocation>
              </EventInfo>
            </EventCard>
          ))
        ) : (
          <NoEvents>
            No upcoming events found
            {searchQuery && ' matching your search'}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </NoEvents>
        )}
      </EventList>

      {selectedImage && (
        <FullImageView 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </Container>
  );
} 