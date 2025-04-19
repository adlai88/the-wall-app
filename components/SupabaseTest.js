import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

const TestContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
`;

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('test').select('*').limit(1);
        if (error) throw error;
        setConnectionStatus('connected');
        toast.success('Successfully connected to Supabase!');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus('error');
        setError(error.message);
        toast.error('Failed to connect to Supabase. Please check your connection.');
      }
    };

    checkConnection();
  }, []);

  return (
    <TestContainer>
      <h2>Supabase Connection Test</h2>
      <p>Status: {connectionStatus}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </TestContainer>
  );
};

export default SupabaseTest; 