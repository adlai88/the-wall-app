import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false });

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
`;

const Header = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: #f8f8f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #eee;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const NextButton = styled.button`
  color: #ff5722;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: #eee;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  width: ${props => `${props.progress}%`};
  background-color: #ff5722;
  transition: width 0.3s ease;
`;

const FormContainer = styled.div`
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

const FormSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const UploadArea = styled.div`
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
  background-image: ${props => props.preview ? `url(${props.preview})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:hover {
    border-color: #ff5722;
  }
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const FieldLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 10px;
  background-color: #f8f8f8;
  
  &:focus {
    outline: none;
    border-color: #ff5722;
  }
`;

const TextareaField = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f8f8f8;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #ff5722;
  }
`;

const DateTimeSelector = styled.div`
  display: flex;
  gap: 10px;
`;

const ErrorMessage = styled.div`
  color: #ff3d00;
  font-size: 14px;
  margin-top: 5px;
`;

export default function EventSubmissionFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    coordinates: [121.4737, 31.2304],
    poster: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (coordinates, locationName) => {
    setFormData(prev => ({
      ...prev,
      coordinates,
      location: locationName
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      
      // In a real app, you would upload to a storage service here
      setFormData(prev => ({
        ...prev,
        poster: preview
      }));
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description;
      case 2:
        return formData.date && formData.time && formData.location;
      case 3:
        return formData.poster;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit event');
      }

      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FormSection>
            <SectionTitle>Event Details</SectionTitle>
            <FormField>
              <FieldLabel>Event Title</FieldLabel>
              <InputField
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </FormField>
            <FormField>
              <FieldLabel>Description</FieldLabel>
              <TextareaField
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event"
              />
            </FormField>
          </FormSection>
        );

      case 2:
        return (
          <FormSection>
            <SectionTitle>Date & Location</SectionTitle>
            <DateTimeSelector>
              <FormField>
                <FieldLabel>Date</FieldLabel>
                <InputField
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </FormField>
              <FormField>
                <FieldLabel>Time</FieldLabel>
                <InputField
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </FormField>
            </DateTimeSelector>
            <FormField>
              <FieldLabel>Location</FieldLabel>
              <InputField
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location name"
              />
            </FormField>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              initialCoordinates={formData.coordinates}
            />
          </FormSection>
        );

      case 3:
        return (
          <FormSection>
            <SectionTitle>Event Image</SectionTitle>
            <UploadArea
              preview={formData.poster}
              onClick={() => document.getElementById('posterUpload').click()}
            >
              {!formData.poster && (
                <>
                  <div>Click to upload event image</div>
                  <div>or drag and drop</div>
                </>
              )}
              <input
                id="posterUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </UploadArea>
          </FormSection>
        );
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>←</BackButton>
        <Title>Add New Event</Title>
        <NextButton
          onClick={handleNext}
          disabled={!isStepValid() || loading}
        >
          {step === 3 ? (loading ? 'Submitting...' : 'Submit') : 'Next'}
        </NextButton>
      </Header>

      <ProgressBar>
        <ProgressIndicator progress={(step / 3) * 100} />
      </ProgressBar>

      <FormContainer>
        {renderStepContent()}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
    </Container>
  );
} 