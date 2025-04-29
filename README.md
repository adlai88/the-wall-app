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

## Testing

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:watch  # Run tests in watch mode
```

## Deployment

The app can be deployed to any platform that supports Next.js applications. We recommend Vercel for the easiest deployment experience.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bug reports
- Start a discussion for feature requests
- Check out our [Code of Conduct](CODE_OF_CONDUCT.md)

## Acknowledgments

- OpenStreetMap for map data
- OpenWeatherMap for weather data
- All our contributors and users

## Project Status

The Wall App is under active development. Check our [Projects](https://github.com/yourusername/the-wall-app/projects) page for current progress.