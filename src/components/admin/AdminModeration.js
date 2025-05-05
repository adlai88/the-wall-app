import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { FiCalendar } from 'react-icons/fi';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: #333;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  font-size: 14px;
  color: #ff5722;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const Tabs = styled.div`
  display: flex;
  height: 40px;
  background: white;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${props => props.$active ? '#ff5722' : '#666'};
  border-bottom: ${props => props.$active ? '2px solid #ff5722' : 'none'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? 'transparent' : '#f8f8f8'};
  }
`;

const NotificationBadge = styled.span`
  background-color: #ff5722;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  margin-left: 5px;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f5f5f5;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  gap: 15px;
  max-width: 800px;
  margin: 15px auto;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const EventImageContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  flex-shrink: 0;
`;

const DefaultEventImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
`;

const EventContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const EventTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
`;

const EventDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📅';
  }
`;

const PosterStatus = styled.div`
  font-size: 12px;
  color: ${props => props.$expired ? '#ff5722' : '#4CAF50'};
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '${props => props.$expired ? '⏰' : '✅'}';
  }
`;

const EventLocation = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:before {
    content: '📍';
  }
`;

const EventDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 10px 0;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #ff5722;
  color: white;
  
  &:hover {
    background-color: #f4511e;
  }
`;

const HideButton = styled(ActionButton)`
  background-color: #ff9800;
  color: white;
  
  &:hover {
    background-color: #f57c00;
  }
`;

const UnhideButton = styled(ActionButton)`
  background-color: #2196F3;
  color: white;
  
  &:hover {
    background-color: #1976D2;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #f44336;
  color: white;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const ReApproveButton = styled(ActionButton)`
  background-color: #4CAF50;
  color: white;
  
  &:hover {
    background-color: #388E3C;
  }
`;

const ApproveButton = styled(ActionButton)`
  background-color: #4CAF50;
  color: white;
  
  &:hover {
    background-color: #43A047;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #2196F3;
  color: white;
  
  &:hover {
    background-color: #1E88E5;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 400px;
`;

const EmptyIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: #eee;
  border-radius: 50%;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
`;

const StatusFilter = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 20px;
`;

const StatusButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$active ? '#ff5722' : '#eee'};
  color: ${props => props.$active ? 'white' : '#666'};
  cursor: pointer;
`;

const EventList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const NoEvents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  color: #666;
`;

const CategoryTag = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: ${({ category }) => {
    switch (category) {
      case 'event': return '#ff9800';
      case 'community': return '#4caf50';
      case 'announcement': return '#2196f3';
      case 'general': return '#888';
      case 'other': return '#9c27b0';
      default: return '#bbb';
    }
  }};
  text-transform: capitalize;
`;

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
  if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()
  ) {
    return `${startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })} – ${endDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function AdminModeration() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [filteredPosters, setFilteredPosters] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    router.push('/');
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setLoading(true);
    setFilteredPosters([]);
    setError(null);
  };

  const fetchPosters = async (status) => {
    try {
      let query = supabase
        .from('posters')
        .select('*');

      // Different queries based on tab
      switch (status) {
        case 'pending':
          query = query.eq('moderation_status', 'pending');
          break;
        case 'approved':
          query = query
            .eq('moderation_status', 'approved')
            .eq('status', 'active')
            .eq('hidden', false);
          break;
        case 'hidden':
          query = query
            .eq('moderation_status', 'approved')
            .eq('hidden', true);
          break;
        case 'expired':
          query = query
            .eq('moderation_status', 'approved')
            .eq('hidden', false);
          break;
        case 'rejected':
          query = query.eq('moderation_status', 'rejected');
          break;
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching posters:', err);
      throw err;
    }
  };

  const handleAction = async (posterId, action) => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('posters')
          .delete()
          .eq('id', posterId);
        
        if (error) throw error;
        toast.success('Poster deleted successfully');
      } else if (action === 'hide') {
        const { error } = await supabase
          .from('posters')
          .update({ hidden: true })
          .eq('id', posterId);
        
        if (error) throw error;
        toast.success('Poster hidden from public view');
      } else if (action === 'unhide') {
        const { error } = await supabase
          .from('posters')
          .update({ hidden: false })
          .eq('id', posterId);
        
        if (error) throw error;
        toast.success('Poster is now visible to the public');
      } else if (action === 'approved') {
        const { error } = await supabase
          .from('posters')
          .update({ moderation_status: 'approved', hidden: false })
          .eq('id', posterId);

        if (error) throw error;
        toast.success('Poster approved successfully');
      } else if (action === 'rejected') {
        const { error } = await supabase
          .from('posters')
          .update({ moderation_status: 'rejected' })
          .eq('id', posterId);

        if (error) throw error;
        toast.success('Poster rejected');
      }
      
      // Refresh the posters list and pending count
      const updatedPosters = await fetchPosters(activeTab);
      setFilteredPosters(updatedPosters);
      
      // Update pending count after action
      const pendingPosters = await fetchPosters('pending');
      setPendingCount(pendingPosters.length);
    } catch (err) {
      console.error('Error updating poster:', err);
      setError(err.message);
      toast.error('Failed to update poster. Please try again.');
    }
  };

  useEffect(() => {
    const loadPosters = async () => {
      try {
        // Fetch posters for current tab
        let posters = await fetchPosters(activeTab);

        // --- Frontend filtering for approved/expired tabs ---
        const now = new Date();
        if (activeTab === 'approved') {
          posters = posters.filter(
            poster =>
              poster.status === 'active' &&
              new Date(poster.display_until) >= now
          );
        } else if (activeTab === 'expired') {
          posters = posters.filter(
            poster =>
              poster.status === 'expired' ||
              new Date(poster.display_until) < now
          );
        }
        // ---------------------------------------------------

        setFilteredPosters(posters);

        // Always fetch pending count regardless of active tab
        if (activeTab !== 'pending') {
          const pendingPosters = await fetchPosters('pending');
          setPendingCount(pendingPosters.length);
        } else {
          setPendingCount(posters.length);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadPosters();
  }, [activeTab]);

  const renderPosters = () => {
    if (loading) {
      return (
        <LoadingState>
          <div>Loading posters...</div>
        </LoadingState>
      );
    }
    
    if (error) {
      return (
        <EmptyState>
          <div style={{ color: 'red' }}>{error}</div>
          <button onClick={() => setActiveTab(activeTab)} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#f8f8f8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Try Again
          </button>
        </EmptyState>
      );
    }
    
    if (filteredPosters.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <div>No {activeTab} posters found</div>
          <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
            {activeTab === 'pending' ? 'New submissions will appear here' : `No posters in ${activeTab} state`}
          </div>
        </EmptyState>
      );
    }
    
    return filteredPosters.map(poster => (
      <EventCard key={poster.id}>
        <EventImageContainer>
          {poster.poster_image ? (
            <Image
              src={poster.poster_image}
              alt={poster.title}
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <DefaultEventImage>No Image</DefaultEventImage>
          )}
        </EventImageContainer>
        <EventContent>
          <div>
            <EventTitle>
              {poster.title}
              <CategoryTag category={poster.category}>{poster.category}</CategoryTag>
            </EventTitle>
            <EventDetails style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
              {poster.category === 'event' && poster.event_start_date ? (
                <>
                  <span>{formatEventDate(poster.event_start_date, poster.event_end_date)}</span>
                  <span>Displayed until {formatDate(poster.display_until)}</span>
                </>
              ) : (
                <span>Displayed until {formatDate(poster.display_until)}</span>
              )}
            </EventDetails>
            <PosterStatus $expired={new Date(poster.display_until) < new Date() || poster.status === 'expired'}>
              {new Date(poster.display_until) < new Date() || poster.status === 'expired' ? 'Expired' : 'Active'}
            </PosterStatus>
            <EventLocation>{poster.location}</EventLocation>
            <EventDescription>{poster.description}</EventDescription>
          </div>
          <ActionButtons>
            <DeleteButton onClick={() => handleAction(poster.id, 'delete')}>
              Delete
            </DeleteButton>
            {activeTab === 'pending' ? (
              <>
                <RejectButton onClick={() => handleAction(poster.id, 'rejected')}>
                  Reject
                </RejectButton>
                <ApproveButton onClick={() => handleAction(poster.id, 'approved')}>
                  Approve
                </ApproveButton>
              </>
            ) : activeTab === 'approved' ? (
              <>
                <RejectButton onClick={() => handleAction(poster.id, 'rejected')}>
                  Reject
                </RejectButton>
                {poster.status === 'active' ? (
                  <HideButton onClick={() => handleAction(poster.id, 'hide')}>
                    Hide
                  </HideButton>
                ) : (
                  <UnhideButton onClick={() => handleAction(poster.id, 'unhide')}>
                    Unhide
                  </UnhideButton>
                )}
              </>
            ) : activeTab === 'rejected' && (
              <ReApproveButton onClick={() => handleAction(poster.id, 'approved')}>
                Re-approve
              </ReApproveButton>
            )}
          </ActionButtons>
        </EventContent>
      </EventCard>
    ));
  };

  return (
    <Container>
      <Header>
        <Title>Poster Moderation</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <Tabs>
        <Tab
          $active={activeTab === 'pending'}
          onClick={() => handleTabChange('pending')}
        >
          Pending {pendingCount > 0 && <NotificationBadge>{pendingCount}</NotificationBadge>}
        </Tab>
        <Tab
          $active={activeTab === 'approved'}
          onClick={() => handleTabChange('approved')}
        >
          Approved
        </Tab>
        <Tab
          $active={activeTab === 'hidden'}
          onClick={() => handleTabChange('hidden')}
        >
          Hidden
        </Tab>
        <Tab
          $active={activeTab === 'expired'}
          onClick={() => handleTabChange('expired')}
        >
          Expired
        </Tab>
        <Tab
          $active={activeTab === 'rejected'}
          onClick={() => handleTabChange('rejected')}
        >
          Rejected
        </Tab>
      </Tabs>

      <ContentContainer>
        {renderPosters()}
      </ContentContainer>
    </Container>
  );
}
