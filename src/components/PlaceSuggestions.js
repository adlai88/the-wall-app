import styled from 'styled-components';

const SuggestionsContainer = styled.div`
  position: absolute;
  top: ${({ context }) => (context === 'map' ? '60px' : '44px')};
  left: ${({ context }) => (context === 'map' ? '10px' : '0')};
  right: ${({ context }) => (context === 'map' ? 'auto' : '0')};
  width: ${({ context }) => (context === 'map' ? '300px' : '100%')};
  background: white;
  border: 1px solid #222;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  max-height: 320px;
  overflow-y: auto;
  z-index: 2001;
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
  padding: 32px 12px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const LoadingText = styled(NoResults)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export default function PlaceSuggestions({ suggestions, onSelect, searchQuery, isSearching, context }) {
  // Don't show anything if:
  // 1. No search query
  // 2. Suggestions is null (not in search mode)
  // 3. No suggestions array
  if (!searchQuery || !suggestions || !Array.isArray(suggestions)) return null;
  
  if (isSearching) {
    return (
      <SuggestionsContainer context={context}>
        <LoadingText>
          Searching...
        </LoadingText>
      </SuggestionsContainer>
    );
  }
  
  // Only show "No results found" when actively searching
  if (searchQuery.trim() && suggestions.length === 0) {
    return (
      <SuggestionsContainer context={context} $noResults>
        <NoResults>No places found</NoResults>
      </SuggestionsContainer>
    );
  }

  return (
    <SuggestionsContainer context={context}>
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