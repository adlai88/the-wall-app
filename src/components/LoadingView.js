import styled from 'styled-components'

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
  background-color: #f5f5f5;
`

export default function LoadingView({ error }) {
  return (
    <LoadingContainer>
      {error ? `Error: ${error}` : 'Loading map...'}
    </LoadingContainer>
  )
} 