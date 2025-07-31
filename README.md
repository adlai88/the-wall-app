# The Wall App

A map-based digital bulletin board where communities share ephemeral, image-based content - from event posters and announcements to photos and creative messages - all pinned to real-world locations.

## Features

- 🗺️ Interactive map interface
- 📍 Location-based content discovery
- 🎨 Visual posters and images
- 🌤️ Real-time weather information
- 📱 Mobile-first responsive design
- 🔍 Smart search for content and locations
- ⏰ Ephemeral content that expires (max 30 days)
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
git clone https://github.com/adlai88/the-wall-app.git
cd the-wall-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and configure it:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:
- Get your OpenWeatherMap API key from [https://openweathermap.org/api](https://openweathermap.org/api)
- Set up a Supabase project at [https://supabase.com](https://supabase.com)

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- We use ESLint for JavaScript/TypeScript linting
- 2 spaces for indentation
- Prettier for code formatting
- Component-specific styled-components

## Environment Variables

Required environment variables:
- `OPENWEATHERMAP_API_KEY`: Your OpenWeatherMap API key

Optional environment variables:
- None at the moment

## Screenshots

_Coming soon as our community grows!_

## Deployment

The app can be deployed to any platform that supports Next.js applications. We recommend Vercel for the easiest deployment experience.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bug reports
- Start a discussion for feature requests

## Acknowledgments

- OpenStreetMap for map data
- OpenWeatherMap for weather data
- All our contributors and users