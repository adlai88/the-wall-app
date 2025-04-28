export async function geocodePlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'the-wall-app (your-email@example.com)'
    }
  });
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    display_name: data[0].display_name
  };
} 