export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { lat, lon } = req.query

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing coordinates' })
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('OpenWeather API key not found');
    return res.status(500).json({ error: 'Weather API key not configured' });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeather API error:', errorText);
      return res.status(response.status).json({ error: 'Weather API request failed', details: errorText });
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching weather:', error)
    return res.status(500).json({ error: 'Error fetching weather data' })
  }
} 