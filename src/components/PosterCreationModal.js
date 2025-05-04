import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import ModalCloseButton from './ModalCloseButton';

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
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    margin-top: 0;
    overflow: visible;
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
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
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

const GlobalStyle = createGlobalStyle`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    category: 'general',
    event_start_date: '',
    event_end_date: '',
    link: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [eventDateError, setEventDateError] = useState('');
  const [linkError, setLinkError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEventDateError('');
    setLinkError('');
    
    // User-friendly error for missing image
    if (!formData.poster_image) {
      toast.error('Please upload a poster image before submitting.');
      setIsSubmitting(false);
      return;
    }
    // User-friendly error for missing category
    if (!formData.category) {
      toast.error('Please select a category for your poster.');
      setIsSubmitting(false);
      return;
    }
    // User-friendly error for missing or invalid date
    if (!formData.display_until) {
      toast.error('Please choose a date for how long your poster should be displayed.');
      setIsSubmitting(false);
      return;
    }
    const today = new Date();
    const displayDate = new Date(formData.display_until);
    if (displayDate < today.setHours(0,0,0,0)) {
      toast.error('The display until date must be today or a future date.');
      setIsSubmitting(false);
      return;
    }

    // Event date validation if category is event
    if (formData.category === 'event') {
      if (!formData.event_start_date) {
        setEventDateError('Event start date is required for events.');
        setIsSubmitting(false);
        return;
      }
      if (formData.event_end_date && formData.event_end_date < formData.event_start_date) {
        setEventDateError('Event end date cannot be before start date.');
        setIsSubmitting(false);
        return;
      }
    }

    // Validate link if provided
    if (formData.link && !/^https?:\/\//i.test(formData.link.trim())) {
      setLinkError('Please enter a valid URL (must start with http:// or https://)');
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
          poster_image: formData.poster_image,
          event_start_date: formData.category === 'event' ? formData.event_start_date : null,
          event_end_date: formData.category === 'event' ? (formData.event_end_date || formData.event_start_date) : null,
          link: formData.link || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit poster');
      }

      const data = await response.json();
      await onSubmit(data);
      toast.success('Poster submitted successfully! It will be visible after moderation.');
      onClose();
    } catch (error) {
      console.error('Error submitting poster:', error);
      toast.error(error.message || 'Failed to create poster. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // File type validation
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG and PNG images are supported.');
        return;
      }
      setIsProcessingImage(true);
      // Compress image
      try {
        const options = {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.92
        };
        const compressedFile = await imageCompression(file, options);
        if (compressedFile.size > 4 * 1024 * 1024) { // 4MB limit
          toast.error('Image is too large even after compression. Please choose a smaller image.');
          setIsProcessingImage(false);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          // Only keep the base64 part after the comma
          const base64Data = base64String.split(',')[1];
          setFormData(prev => ({ 
            ...prev, 
            poster_image: {
              data: base64Data,
              type: compressedFile.type,
              name: compressedFile.name
            }
          }));
          setPreviewUrl(base64String);
          setIsProcessingImage(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        toast.error('Failed to compress image. Please try another file.');
        setIsProcessingImage(false);
      }
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
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
          <Title>Pin New Poster</Title>
          <LocationPreview>Location: {coordinates[1].toFixed(4)}°N, {coordinates[0].toFixed(4)}°E</LocationPreview>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit} noValidate>
            <FormGroup>
              <Label>Upload Image <span style={{ color: '#ff3b30' }}>*</span></Label>
              <ImageUpload 
                onClick={handleImageClick}
                $preview={previewUrl}
                style={{ borderColor: !formData.poster_image ? '#ff3b30' : '#e5e5e5' }}
              >
                {isProcessingImage ? (
                  <div style={{ color: '#888', fontSize: 16, textAlign: 'center' }}>
                    <span className="spinner" style={{ display: 'inline-block', marginRight: 8, width: 18, height: 18, border: '2px solid #ccc', borderTop: '2px solid #007aff', borderRadius: '50%', animation: 'spin 1s linear infinite', verticalAlign: 'middle' }}></span>
                    Processing image...
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      required
                    />
                    <UploadText $preview={previewUrl}>
                      Click to upload poster image
                    </UploadText>
                  </>
                )}
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

            {/* Event date fields, only show if category is event */}
            {formData.category === 'event' && (
              <>
                <FormGroup>
                  <Label>Event Start Date <span style={{ color: '#ff3b30' }}>*</span></Label>
                  <Input
                    type="date"
                    value={formData.event_start_date}
                    onChange={e => setFormData(prev => ({ ...prev, event_start_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Event End Date <span style={{ color: '#888' }}>(optional)</span></Label>
                  <Input
                    type="date"
                    value={formData.event_end_date}
                    onChange={e => setFormData(prev => ({ ...prev, event_end_date: e.target.value }))}
                    min={formData.event_start_date || new Date().toISOString().split('T')[0]}
                  />
                </FormGroup>
                {eventDateError && <ErrorMessage>{eventDateError}</ErrorMessage>}
              </>
            )}

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
                <Label>Link <span style={{ color: '#888' }}>(optional)</span></Label>
                <Input
                  type="url"
                  value={formData.link}
                  onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com"
                  pattern="https?://.+"
                  autoComplete="off"
                />
                {linkError && <ErrorMessage>{linkError}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter some details..."
                />
              </FormGroup>
            </div>
          </Form>
        </ModalBody>

        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting || isProcessingImage} onClick={handleSubmit}>
            {isSubmitting ? 'Pinning Poster...' : 'Pin Poster'}
          </SubmitButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
} 