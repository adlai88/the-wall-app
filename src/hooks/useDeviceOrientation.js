import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState('unknown');

  // Check if device orientation is supported
  useEffect(() => {
    const isSupported = window.DeviceOrientationEvent !== undefined;
    setIsSupported(isSupported);
  }, []);

  // Request permission on iOS devices
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    // Check if we need to request permission (iOS 13+)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        setPermissionState(permission);
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        return false;
      }
    }
    
    // For non-iOS devices, assume permission is granted
    return true;
  }, [isSupported]);

  // Debounced handler for orientation changes
  const handleOrientation = useCallback(
    debounce((event) => {
      // Use beta (front/back tilt) and gamma (left/right tilt) for the effect
      // Limit the range to prevent extreme tilts
      const beta = Math.max(Math.min(event.beta || 0, 45), -45);
      const gamma = Math.max(Math.min(event.gamma || 0, 45), -45);
      
      setOrientation({ beta, gamma });
    }, 16), // ~60fps
    []
  );

  // Set up orientation listener
  useEffect(() => {
    if (!isSupported) return;

    const setupOrientation = async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    setupOrientation();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isSupported, requestPermission, handleOrientation]);

  return {
    orientation,
    isSupported,
    permissionState,
    requestPermission
  };
};

export default useDeviceOrientation; 