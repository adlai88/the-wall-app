import { getWeather } from '../services/weatherService';

export const testWeatherAPI = async () => {
  console.log('Testing OpenWeatherMap API connection...');
  try {
    const weatherData = await getWeather();
    
    if (!weatherData) {
      console.error('❌ No weather data received. Check if your API key is correct.');
      return false;
    }

    console.log('✅ Weather API connection successful!');
    console.log('Current weather in Shanghai:');
    console.log(`Temperature: ${Math.round(weatherData.main.temp - 273.15)}°C`);
    console.log(`Condition: ${weatherData.weather[0].main} (${weatherData.weather[0].description})`);
    console.log(`Humidity: ${weatherData.main.humidity}%`);
    console.log('Raw response:', weatherData);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing weather API:', error.message);
    if (error.response?.status === 401) {
      console.error('Invalid API key. Please check your REACT_APP_WEATHER_API_KEY in .env.local');
    }
    return false;
  }
}; 