import axios from 'axios';

const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const SHANGHAI_COORDS = { lat: 31.2304, lon: 121.4737 };

export default async function handler(req, res) {
  const { lat = SHANGHAI_COORDS.lat, lon = SHANGHAI_COORDS.lon } = req.query;

  if (!WEATHER_API_KEY) {
    console.error('Weather API key not configured. Please ensure OPENWEATHERMAP_API_KEY is set in .env.local');
    return res.status(500).json({
      weather: [{ id: 800, description: 'weather service unavailable' }],
      main: { temp: '--' }
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await axios.get(url, {
      timeout: 10000, // 10 seconds timeout
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    
    // Return a graceful fallback instead of an error
    res.status(200).json({
      weather: [{ id: 800, description: 'weather unavailable' }],
      main: { temp: '--' }
    });
  }
} 