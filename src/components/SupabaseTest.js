import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const TestContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
`;

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').limit(1);
        if (error) throw error;
        setConnectionStatus('✅ Connected to Supabase');
      } catch (err) {
        setConnectionStatus('❌ Connection failed');
        setError(err.message);
      }
    };

    testConnection();
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