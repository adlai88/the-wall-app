export async function geocodePlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'the-wall-app (your-email@example.com)'
    }
  });
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (data.length === 0) return null;
  return data.map(place => ({
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
    display_name: place.display_name
  }));
} 