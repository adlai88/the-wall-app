import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

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

const RejectButton = styled(ActionButton)`
  background-color: #f8f8f8;
  color: #666;
  
  &:hover {
    background-color: #eee;
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
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('moderation_status', status);
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching posters:', err);
      throw err;
    }
  };

  const handleAction = async (posterId, action) => {
    try {
      const { error } = await supabase
        .from('posters')
        .update({ moderation_status: action })
        .eq('id', posterId);

      if (error) throw error;
      
      // Refresh the posters list and pending count
      const updatedPosters = await fetchPosters(activeTab);
      setFilteredPosters(updatedPosters);
      
      // Update pending count after action
      const pendingPosters = await fetchPosters('pending');
      setPendingCount(pendingPosters.length);
    } catch (err) {
      console.error('Error updating poster:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadPosters = async () => {
      try {
        // Fetch posters for current tab
        const posters = await fetchPosters(activeTab);
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
            <EventTitle>{poster.title}</EventTitle>
            <EventDetails>Display until: {new Date(poster.display_until).toLocaleDateString()}</EventDetails>
            <EventLocation>{poster.location}</EventLocation>
            <EventDescription>{poster.description}</EventDescription>
          </div>
          {activeTab === 'pending' && (
            <ActionButtons>
              <RejectButton onClick={() => handleAction(poster.id, 'rejected')}>
                Reject
              </RejectButton>
              <EditButton onClick={() => router.push(`/admin/posters/${poster.id}/edit`)}>
                Edit
              </EditButton>
              <ApproveButton onClick={() => handleAction(poster.id, 'approved')}>
                Approve
              </ApproveButton>
            </ActionButtons>
          )}
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
