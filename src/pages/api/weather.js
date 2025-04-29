import axios from 'axios';
import NodeCache from 'node-cache';

const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const SHANGHAI_COORDS = { lat: 31.2304, lon: 121.4737 };
const TIMEOUT = 30000; // 30 seconds timeout to match weatherService
const CACHE_TTL = 300; // Cache for 5 minutes
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds
const RATE_LIMIT_MAX = 100; // 100 requests per window

// Initialize caches
const cache = new NodeCache({ stdTTL: CACHE_TTL });
const rateLimitCache = new NodeCache({ stdTTL: RATE_LIMIT_WINDOW });

function isRateLimited(ip) {
  const requests = rateLimitCache.get(ip) || 0;
  if (requests >= RATE_LIMIT_MAX) {
    return true;
  }
  rateLimitCache.set(ip, requests + 1);
  return false;
}

export default async function handler(req, res) {
  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check rate limit
  if (isRateLimited(ip)) {
    return res.status(429).json({
      weather: [{ id: 800, description: 'too many requests, please try again later' }],
      main: { temp: '--' }
    });
  }

  const { lat = SHANGHAI_COORDS.lat, lon = SHANGHAI_COORDS.lon } = req.query;

  if (!WEATHER_API_KEY) {
    console.error('Weather API key not configured. Please ensure OPENWEATHERMAP_API_KEY is set in .env.local');
    return res.status(500).json({
      weather: [{ id: 800, description: 'weather service unavailable' }],
      main: { temp: '--' }
    });
  }

  // Check cache first
  const cacheKey = `weather_${lat}_${lon}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await axios.get(url, {
      timeout: TIMEOUT,
    });

    // Cache the successful response
    cache.set(cacheKey, response.data);
    
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