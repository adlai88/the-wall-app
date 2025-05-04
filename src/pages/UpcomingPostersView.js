import { useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'
import FullImageView from '../components/FullImageView'
import { FiCalendar } from 'react-icons/fi'

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

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 12px;
  border: ${props => props.hideTableBorder ? 'none' : '1px solid #222'};
  box-shadow: ${props => props.hideTableBorder ? 'none' : '0 2px 4px rgba(0,0,0,0.04)'};
  margin: 0 auto;
  max-width: 700px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const TableHead = styled.thead`
  background: #fafafa;
`;

const TableHeader = styled.th`
  text-align: left;
  font-weight: 600;
  font-size: 15px;
  color: #222;
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 8px;
  vertical-align: middle;
  font-size: 15px;
  color: #222;
  background: #fff;
`;

const Thumb = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Domain = styled.div`
  font-size: 13px;
  color: #666;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const TitleCell = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExternalLink = styled.a`
  color: #222;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  &:hover {
    color: #ff5722;
  }
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    color: #222;
  }
`;

export default function UpcomingPostersView({ posters = [], selectedCategory, setSelectedCategory, hideHeaders = false, hideTableBorder = false }) {
  const router = useRouter()
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

  const formatEventDate = (start, end) => {
    if (!start) return '';
    const startDate = new Date(start);
    if (!end || end === start) {
      return startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const endDate = new Date(end);
    // If same month/year, show as 'Jun 1–3, 2024'
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return `${startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    // Otherwise, show full range
    return `${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} – ${endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  return (
    <>
      <Container style={{ background: '#fff' }}>
        <TableWrapper hideTableBorder={hideTableBorder}>
          <StyledTable>
            {!hideHeaders && (
              <TableHead>
                <TableRow>
                  <TableHeader>Content</TableHeader>
                  <TableHeader>Title</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
            )}
            <tbody>
              {filteredPosters.length > 0 ? (
                filteredPosters.map(poster => (
                  <TableRow key={poster.id} style={{ cursor: 'pointer' }} onClick={() => handlePosterClick(poster)}>
                    <TableCell>
                      <Thumb>
                        <Image
                          src={poster.poster_image || '/default-poster.jpg'}
                          alt={poster.title || 'Untitled Poster'}
                          width={48}
                          height={48}
                          style={{ borderRadius: 6, objectFit: 'cover', width: 48, height: 48 }}
                        />
                      </Thumb>
                    </TableCell>
                    <TableCell>
                      <TitleCell>{poster.title || 'Untitled Poster'}</TitleCell>
                      <div style={{ color: '#888', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {poster.category === 'event' && poster.event_start_date ? (
                          <>
                            <span aria-label={`Event date: ${formatEventDate(poster.event_start_date, poster.event_end_date)}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <FiCalendar style={{ marginRight: 4, fontSize: 15 }} />
                              {formatEventDate(poster.event_start_date, poster.event_end_date)}
                            </span>
                            <span aria-label={`Displayed until ${formatDate(poster.display_until)}`}>Displayed until {formatDate(poster.display_until)}</span>
                          </>
                        ) : (
                          <span aria-label={`Displayed until ${formatDate(poster.display_until)}`}>Displayed until {formatDate(poster.display_until)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionCell>
                        {poster.poster_url && (
                          <ExternalLink href={poster.poster_url} target="_blank" rel="noopener noreferrer" title="Open external link">
                            ↗
                          </ExternalLink>
                        )}
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center', color: '#888', padding: 40 }}>
                    No posters found
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
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