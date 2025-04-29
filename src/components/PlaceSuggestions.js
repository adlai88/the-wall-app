import styled from 'styled-components';

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 120px; // Position below the weather box
  left: 10px;
  width: 300px;
  background: white;
  border: 1px solid #222;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 250px); // Ensure it doesn't extend too far
  overflow-y: auto;
  z-index: 1000;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    left: 8px;
    right: 8px;
    width: auto;
  }

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const SuggestionItem = styled.div`
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PlaceIcon = styled.span`
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const PlaceInfo = styled.div`
  flex: 1;
  min-width: 0; // Enable text truncation
`;

const PlaceName = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #222;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceAddress = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

export default function PlaceSuggestions({ suggestions, onSelect, searchQuery }) {
  // Don't show anything if:
  // 1. No search query
  // 2. Suggestions is null (not in search mode)
  // 3. No suggestions array
  if (!searchQuery || !suggestions || !Array.isArray(suggestions)) return null;
  
  // Only show "No results found" when actively searching
  if (searchQuery.trim() && suggestions.length === 0) {
    return (
      <SuggestionsContainer>
        <NoResults>No places found</NoResults>
      </SuggestionsContainer>
    );
  }

  return (
    <SuggestionsContainer>
      {suggestions.map((place, index) => (
        <SuggestionItem 
          key={index} 
          onClick={() => onSelect(place)}
        >
          <PlaceIcon>📍</PlaceIcon>
          <PlaceInfo>
            <PlaceName>{place.display_name.split(',')[0]}</PlaceName>
            <PlaceAddress>{place.address}</PlaceAddress>
          </PlaceInfo>
        </SuggestionItem>
      ))}
    </SuggestionsContainer>
  );
} 