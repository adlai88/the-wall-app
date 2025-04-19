import React from 'react';
import styled from 'styled-components';

const ConfigContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
`;

const ConfigTest = () => {
  return (
    <ConfigContainer>
      <h2>Configuration Test</h2>
      <p>Supabase URL: {process.env.REACT_APP_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</p>
      <p>Supabase Anon Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}</p>
      <p>OpenWeather API Key: {process.env.REACT_APP_OPENWEATHER_API_KEY ? '✅ Configured' : '❌ Missing'}</p>
    </ConfigContainer>
  );
};

export default ConfigTest; 