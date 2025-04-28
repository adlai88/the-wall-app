import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'sonner';

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
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
  }
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  font-family: inherit;
  box-shadow: none;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    margin-top: 0;
  }
`;

const ModalHeader = styled.div`
  padding: 20px 20px 10px;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1001;
  padding-top: max(20px, env(safe-area-inset-top, 20px));
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  @media (max-width: 768px) {
    padding: 15px 15px 10px;
    padding-top: max(20px, env(safe-area-inset-top, 20px));
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  @media (max-width: 768px) {
    padding: 15px;
    padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: max(15px, env(safe-area-inset-top, 15px));
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  z-index: 1002;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  &:hover {
    color: #222;
    background: #f5f5f5;
    border-radius: 50%;
  }
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  @media (max-width: 768px) {
    margin: 0 0 15px 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 16px;
  background: #fafbfc;
  color: #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  &:focus {
    outline: none;
    border-color: #007aff;
    background: #fff;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  background: #fafbfc;
  color: #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  &:focus {
    outline: none;
    border-color: #007aff;
    background: #fff;
  }
`;

const ImageUpload = styled.div`
  border: 1px dashed #e5e5e5;
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
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  &:hover {
    border-color: #007aff;
    background: #f5f5f5;
  }
`;

const UploadText = styled.div`
  display: ${props => props.$preview ? 'none' : 'block'};
  color: #888;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const ButtonContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  @media (max-width: 768px) {
    position: fixed;
    bottom: calc(60px + env(safe-area-inset-bottom, 0px));
    left: 0;
    right: 0;
    padding: 15px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
    z-index: 1001;
    border-radius: 0;
    background: #fff;
  }
`;

const SubmitButton = styled.button`
  background: #fff;
  color: #222;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  transition: background 0.15s;
  &:hover {
    background: #f5f5f5;
    color: #007aff;
    border-color: #007aff;
  }
  &:disabled {
    background: #f5f5f5;
    color: #bbb;
    border-color: #e5e5e5;
    cursor: not-allowed;
  }
`;

const LocationPreview = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const ErrorMessage = styled.div`
  background-color: #f44336;
  color: white;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 16px;
  background: #fafbfc;
  color: #222;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  &:focus {
    outline: none;
    border-color: #007aff;
    background: #fff;
  }
`;

export default function PosterCreationModal({ onClose, coordinates, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    poster_image: null,
    display_until: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Default to 30 days from now
      return date.toISOString().split('T')[0];
    })(),
    category: 'general'
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.poster_image) {
      toast.error('Please upload a poster image');
      setIsSubmitting(false);
      return;
    }

    try {
      const lat = coordinates[1].toFixed(6);
      const lng = coordinates[0].toFixed(6);
      const formattedCoords = `(${lat},${lng})`;

      const response = await fetch('/api/posters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          coordinates: formattedCoords,
          category: formData.category,
          display_until: formData.display_until,
          poster_image: formData.poster_image
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit poster');
      }

      const data = await response.json();
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting poster:', error);
      toast.error(error.message || 'Failed to create poster. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ 
          ...prev, 
          poster_image: {
            data: base64String,
            type: file.type,
            name: file.name
          }
        }));
        setPreviewUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
        <ModalHeader>
          <CloseButton onClick={onClose}>×</CloseButton>
          <Title>Pin New Poster</Title>
          <LocationPreview>Location: {coordinates[1].toFixed(4)}°N, {coordinates[0].toFixed(4)}°E</LocationPreview>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Upload Image <span style={{ color: '#ff3b30' }}>*</span></Label>
              <ImageUpload 
                onClick={handleImageClick}
                $preview={previewUrl}
                style={{ borderColor: !formData.poster_image ? '#ff3b30' : '#e5e5e5' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                  required
                />
                <UploadText $preview={previewUrl}>
                  Click to upload poster image
                </UploadText>
              </ImageUpload>
            </FormGroup>

            <FormGroup>
              <Label>Category <span style={{ color: '#ff3b30' }}>*</span></Label>
              <Select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="general">General</option>
                <option value="event">Event</option>
                <option value="announcement">Announcement</option>
                <option value="community">Community</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Display Until <span style={{ color: '#ff3b30' }}>*</span></Label>
              <Input
                type="date"
                value={formData.display_until}
                onChange={e => setFormData(prev => ({ ...prev, display_until: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </FormGroup>

            <div style={{ borderTop: '1px solid #e5e5e5', margin: '20px 0', paddingTop: '20px' }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Optional Details</div>

              <FormGroup>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter poster title"
                />
              </FormGroup>

              <FormGroup>
                <Label>Location Name</Label>
                <Input
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location name or address"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your poster..."
                />
              </FormGroup>
            </div>
          </Form>
        </ModalBody>

        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Pinning Poster...' : 'Pin Poster'}
          </SubmitButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
} 