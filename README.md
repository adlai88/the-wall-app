# The Wall App

A map-based event discovery application that allows users to find events happening around their city without registration or social interactions.

## Features

- 🗺️ Interactive map interface
- 📍 Location-based event discovery
- 🎨 Visual event posters
- 🌤️ Real-time weather information
- 📱 Mobile-first responsive design
- 🔍 Smart search for both events and locations
- ⚡ Fast and efficient with caching and rate limiting

## Tech Stack

- Next.js
- React
- Styled Components
- Leaflet Maps
- OpenWeatherMap API
- Node-Cache
- Supabase

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- OpenWeatherMap API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/the-wall-app.git
cd the-wall-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
OPENWEATHERMAP_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## Environment Variables

- `OPENWEATHERMAP_API_KEY`: Your OpenWeatherMap API key

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenStreetMap for map data
- OpenWeatherMap for weather data
- All our contributors and users

## Support

If you find a bug or want to request a feature, please create an issue.