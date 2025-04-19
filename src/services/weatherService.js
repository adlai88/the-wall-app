import axios from 'axios';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
console.log('API Key loaded:', WEATHER_API_KEY ? 'Yes' : 'No');
console.log('API Key value:', WEATHER_API_KEY === 'your_openweathermap_api_key_here' ? 'Default value not changed' : 'Custom value set');

const SHANGHAI_COORDS = { lat: 31.2304, lon: 121.4737 };

export const getWeather = async (lat = 31.2304, lon = 121.4737) => {
  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      console.error('Weather API response not ok:', await response.text());
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const getWeatherStyle = (weatherData) => {
  if (!weatherData) return null;
  
  const code = weatherData.weather[0].id;
  const styles = {
    // Clear
    800: {
      filter: 'brightness(1.1)',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    // Clouds
    801: { filter: 'brightness(0.95)' },
    802: { filter: 'brightness(0.9)' },
    803: { filter: 'brightness(0.85)' },
    804: { filter: 'brightness(0.8)' },
    // Rain
    500: { filter: 'saturate(0.8) brightness(0.9)' },
    501: { filter: 'saturate(0.7) brightness(0.85)' },
    502: { filter: 'saturate(0.6) brightness(0.8)' },
    // Snow
    600: { filter: 'brightness(1.1) contrast(0.9)' },
    // Mist
    701: { filter: 'brightness(0.9) contrast(0.9)' },
    // Thunderstorm
    200: { filter: 'brightness(0.7) contrast(1.1)' },
  };
  
  return styles[code] || null;
}; 