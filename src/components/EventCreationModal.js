import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #ff5722;
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #ff5722;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #ff5722;
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed #ddd;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: ${props => props.$preview ? `url(${props.$preview})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:hover {
    border-color: #ff5722;
  }
`;

const UploadText = styled.div`
  display: ${props => props.$preview ? 'none' : 'block'};
`;

const SubmitButton = styled.button`
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: #f4511e;
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const LocationPreview = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const SuccessMessage = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #f44336;
  color: white;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
`;

function EventCreationModal({ onClose, coordinates, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    location: '',
    category: 'music',
    description: '',
    poster: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format coordinates as (lat,lng) string
      const lat = coordinates[1].toFixed(6);
      const lng = coordinates[0].toFixed(6);
      const formattedCoords = `(${lat},${lng})`;

      await onSubmit({
        ...formData,
        coordinates: formattedCoords
      });
      
      // Close modal immediately
      onClose();
    } catch (error) {
      console.error('Error submitting event:', error);
      setError(error.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, poster: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Create New Event</Title>
        
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        
        <LocationPreview>Location: {coordinates[1].toFixed(4)}°N, {coordinates[0].toFixed(4)}°E</LocationPreview>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Event Title</Label>
            <Input
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Venue Name / Location</Label>
            <Input
              required
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter venue name or address"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Start Date</Label>
            <Input
              required
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Start Time</Label>
            <Input
              required
              type="time"
              value={formData.time}
              onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>End Date</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>End Time</Label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="music">Music</option>
              <option value="art">Art</option>
              <option value="social">Social</option>
              <option value="food">Food</option>
              <option value="sports">Sports</option>
              <option value="tech">Tech</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Description (Optional)</Label>
            <TextArea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional: Describe your event..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Event Poster</Label>
            <ImageUpload 
              onClick={handleImageClick}
              $preview={previewUrl}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <UploadText $preview={previewUrl}>
                Click to upload event poster
              </UploadText>
            </ImageUpload>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default EventCreationModal; 