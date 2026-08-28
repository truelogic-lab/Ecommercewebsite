import React, { useState, useEffect } from 'react';
import { Navigation, X, Check, AlertCircle, Globe } from 'lucide-react';
import './LocationPrompt.css';

interface LocationPromptProps {
  onLocationGranted?: (location: { lat: number; lng: number; address: string }) => void;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({ onLocationGranted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const locationDismissed = localStorage.getItem('locationDismissed');
    const locationSaved = localStorage.getItem('userLocation');
    
    if (consent && !locationDismissed && !locationSaved) {
      setIsVisible(true);
    }
    
    if (locationSaved) {
      try {
        const parsed = JSON.parse(locationSaved);
        setLocation(parsed);
      } catch {
        // Invalid stored location
      }
    }
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 5000);
  };

  const handleAllow = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      showNotification('error', 'Location services not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          let address = '';
          if (data.city || data.locality) {
            address = `${data.city || data.locality || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`;
          } else {
            address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          }
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: address.trim()
          };
          
          setLocation(locationData);
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          setIsVisible(false);
          
          showNotification('success', `Location detected: ${address}`);
          
          if (onLocationGranted) {
            onLocationGranted(locationData);
          }
        } catch {
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          };
          setLocation(locationData);
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          setIsVisible(false);
          
          showNotification('success', 'Location detected successfully');
          
          if (onLocationGranted) {
            onLocationGranted(locationData);
          }
        }
        
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to access your location. ';
        if (err.code === 1) {
          errorMessage += 'Please enable location services in your browser settings.';
        } else if (err.code === 2) {
          errorMessage += 'Location unavailable. Please try again.';
        } else if (err.code === 3) {
          errorMessage += 'Request timed out. Please try again.';
        } else {
          errorMessage += 'Please enable location services.';
        }
        setError(errorMessage);
        setIsLoading(false);
        showNotification('error', 'Location access denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('locationDismissed', 'true');
    showNotification('error', 'Location skipped - manual entry required');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="location-prompt">
        <div className="location-prompt__container">
          <div className="location-prompt__icon-wrapper">
            <Globe size={28} className="location-prompt__icon" strokeWidth={1.5} />
          </div>
          <div className="location-prompt__content">
            <h3 className="location-prompt__title">Enable Location</h3>
            <p className="location-prompt__text">
              Allow us to access your location to provide faster delivery options 
              and show products available in your area.
            </p>
            {error && (
              <div className="location-prompt__error">
                <AlertCircle size={16} strokeWidth={1.5} />
                <span>{error}</span>
              </div>
            )}
            {location && (
              <div className="location-prompt__success">
                <Check size={16} strokeWidth={2} />
                <span>Location detected: {location.address}</span>
              </div>
            )}
            <div className="location-prompt__actions">
              <button 
                className="location-prompt__btn location-prompt__btn--allow"
                onClick={handleAllow}
                disabled={isLoading}
              >
                <Navigation size={18} strokeWidth={1.5} />
                {isLoading ? 'Detecting...' : 'Allow Location'}
              </button>
              <button 
                className="location-prompt__btn location-prompt__btn--dismiss"
                onClick={handleDismiss}
                disabled={isLoading}
              >
                <X size={18} strokeWidth={1.5} />
                Skip
              </button>
            </div>
            <p className="location-prompt__note">
              Your location is only used for delivery purposes and is never shared.
            </p>
          </div>
        </div>
      </div>

      {notification.type && (
        <div className={`location-notification location-notification--${notification.type}`}>
          <div className="location-notification__content">
            {notification.type === 'success' ? (
              <Check size={20} className="location-notification__icon" strokeWidth={2} />
            ) : (
              <AlertCircle size={20} className="location-notification__icon" strokeWidth={2} />
            )}
            <span className="location-notification__message">{notification.message}</span>
            <button 
              className="location-notification__close"
              onClick={() => setNotification({ type: null, message: '' })}
              aria-label="Close notification"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
