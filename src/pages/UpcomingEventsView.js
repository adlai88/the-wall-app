import { useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'
import FullImageView from '../components/FullImageView'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px)); /* Account for bottom nav + safe area */
`

const EventList = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
`

const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  gap: 15px;
  padding: 15px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`

const EventImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f5f5f5;
`

const EventInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const EventTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
`

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
`

const EventLocation = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📍';
  }
`

const NoEvents = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
  background: white;
  border-radius: 12px;
  margin: 20px;
`

const CategoryFilter = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  overflow-x: auto;
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 1;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  
  &::-webkit-scrollbar {
    display: none;
  }
`

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
`

export default function UpcomingEventsView({ events = [] }) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = ['all', 'music', 'art', 'social', 'food', 'sports', 'tech']

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA - dateB
    })

  const handleEventClick = (event) => {
    setSelectedImage(event.poster)
  }

  const formatDate = (date, time) => {
    const eventDate = new Date(`${date} ${time}`)
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <Container>
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
                    src={event.poster || '/default-event.jpg'}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </EventImageWrapper>
                <EventInfo>
                  <div>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDate>{formatDate(event.date, event.time)}</EventDate>
                    <EventLocation>{event.location}</EventLocation>
                  </div>
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
      <BottomNav />
    </>
  )
} 