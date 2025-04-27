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
  font-family: inherit;
`

const PosterList = styled.div`
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
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`

const PosterCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #222;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  gap: 15px;
  padding: 15px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`

const PosterImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f5f5f5;
  border: 1px solid #222;
`

const PosterInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const PosterTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
`

const DisplayUntil = styled.div`
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

const PosterLocation = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📍';
  }
`

const NoPosters = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
  background: white;
  border-radius: 12px;
  margin: 20px;
  border: 1px solid #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
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
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const CategoryButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #222;
  background: ${props => props.active ? '#ff5722' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#222'};
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  
  &:hover {
    background: ${props => props.active ? '#f4511e' : '#e0e0e0'};
  }
`

export default function UpcomingPostersView({ posters = [] }) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = ['all', 'general', 'event', 'announcement', 'community', 'other']

  // Filter and sort posters
  const filteredPosters = posters
    .filter(poster => {
      const matchesCategory = selectedCategory === 'all' || poster.category === selectedCategory
      const matchesSearch = (poster.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (poster.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      const dateA = new Date(a.display_until)
      const dateB = new Date(b.display_until)
      return dateA - dateB
    })

  const handlePosterClick = (poster) => {
    setSelectedImage(poster.poster_image)
  }

  const formatDate = (date) => {
    const displayUntil = new Date(date)
    return displayUntil.toLocaleDateString('en-US', {
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

        <PosterList>
          {filteredPosters.length > 0 ? (
            filteredPosters.map(poster => (
              <PosterCard key={poster.id} onClick={() => handlePosterClick(poster)}>
                <PosterImageWrapper>
                  <Image
                    src={poster.poster_image || '/default-poster.jpg'}
                    alt={poster.title || 'Untitled Poster'}
                    layout="fill"
                    objectFit="cover"
                  />
                </PosterImageWrapper>
                <PosterInfo>
                  <div>
                    <PosterTitle>{poster.title || 'Untitled Poster'}</PosterTitle>
                    <DisplayUntil>Display until {formatDate(poster.display_until)}</DisplayUntil>
                    {poster.location && (
                      <PosterLocation>{poster.location}</PosterLocation>
                    )}
                  </div>
                </PosterInfo>
              </PosterCard>
            ))
          ) : (
            <NoPosters>No posters found</NoPosters>
          )}
        </PosterList>
      </Container>

      {selectedImage && (
        <FullImageView
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  )
} 