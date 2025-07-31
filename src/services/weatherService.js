import axios from 'axios';

const SHANGHAI_COORDS = { lat: 31.2304, lon: 121.4737 };

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const TIMEOUT = 30000; // Increased to 30 seconds

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  try {
    const response = await axios.get(url, {
      timeout: TIMEOUT,
    });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await wait(RETRY_DELAY);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(SHANGHAI_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      () => {
        // If error getting location, fallback to Shanghai
        resolve(SHANGHAI_COORDS);
      },
      { timeout: 5000 }
    );
  });
}

export async function getWeather() {
  try {
    // Get user's location first
    const coords = await getUserLocation();
    
    // Add coordinates to the weather API request
    const response = await fetchWithRetry(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`);
    return response;
  } catch (error) {
    console.error('Weather service error:', error.message);
    // Return a minimal weather object instead of throwing
    return {
      weather: [{ id: 800, description: 'weather unavailable' }],
      main: { temp: '--' }
    };
  }
}

export function getWeatherStyle(weatherId) {
  if (!weatherId) return {};
  
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId === 800) return { filter: 'brightness(100%)' }; // Clear sky
  if (weatherId >= 801 && weatherId <= 804) return { filter: 'brightness(95%)' }; // Clouds
  if (weatherId >= 500 && weatherId <= 531) return { filter: 'brightness(85%)' }; // Rain
  if (weatherId >= 600 && weatherId <= 622) return { filter: 'brightness(100%)' }; // Snow
  if (weatherId >= 701 && weatherId <= 781) return { filter: 'brightness(90%)' }; // Atmosphere
  if (weatherId >= 200 && weatherId <= 232) return { filter: 'brightness(80%)' }; // Thunderstorm
  
  return {};
} 