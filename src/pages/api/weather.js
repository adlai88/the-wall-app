const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const SHANGHAI_COORDS = { lat: 31.2304, lon: 121.4737 };

async function fetchWithTimeout(url, options = {}) {
  const { timeout = 5000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

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
    
    const response = await fetchWithTimeout(url, { timeout: 5000 });
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    // Return a graceful fallback instead of an error
    res.status(200).json({
      weather: [{ id: 800, description: 'weather unavailable' }],
      main: { temp: '--' }
    });
  }
} 