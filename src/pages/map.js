import dynamic from 'next/dynamic';
import LoadingView from '../components/LoadingView';

// Dynamically import MapView with no SSR
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false
});

export default function MapPage() {
  return <MapView />;
} 