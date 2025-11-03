import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 37.7749, // San Francisco
  lng: -122.4194,
};

export const LocationPicker = ({ onLocationSelect, initialLocation }: LocationPickerProps) => {
  const [center, setCenter] = useState(initialLocation || defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Get address details from lat/lng
  const getAddressFromLatLng = useCallback(
    async (lat: number, lng: number) => {
      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({
          location: { lat, lng },
        });

        if (response.results[0]) {
          const addressComponents = response.results[0].address_components;
          const formattedAddress = response.results[0].formatted_address;

          // Extract address components
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';

          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes('locality')) {
              city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
            if (types.includes('country')) {
              country = component.short_name;
            }
            if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: formattedAddress,
            city,
            state,
            country,
            postalCode,
          });

          setSearchValue(formattedAddress);
        }
      } catch (error) {
        console.error('Error getting address:', error);
      }
    },
    [onLocationSelect]
  );

  // Handle map click
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        setCenter({ lat, lng });
        getAddressFromLatLng(lat, lng);
      }
    },
    [getAddressFromLatLng]
  );

  // Handle autocomplete place selection
  const handlePlaceSelect = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPosition = { lat, lng };

        setMarkerPosition(newPosition);
        setCenter(newPosition);
        getAddressFromLatLng(lat, lng);
      }
    }
  }, [getAddressFromLatLng]);

  // Get current location
  const handleGetCurrentLocation = useCallback(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newPosition = { lat, lng };

          setMarkerPosition(newPosition);
          setCenter(newPosition);
          getAddressFromLatLng(lat, lng);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      console.error('Geolocation not supported');
      setIsLoading(false);
    }
  }, [getAddressFromLatLng]);

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Google Maps API Key Required</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please add your Google Maps API key to the .env file:
        </p>
        <code className="mt-2 block rounded bg-gray-100 px-3 py-2 text-xs text-gray-700">
          VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
        </code>
        <p className="mt-4 text-xs text-gray-500">
          Get your API key from{' '}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
        {/* Search Box */}
        <div className="flex gap-2">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceSelect}
            className="flex-1"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for a location..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </Autocomplete>

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="hidden sm:inline">Getting...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Use My Location</span>
              </>
            )}
          </button>
        </div>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>

      {/* Instruction */}
      <p className="text-sm text-gray-600">
        <strong>Tip:</strong> Search for a location, click "Use My Location", or click anywhere on
        the map to set the event venue.
      </p>
    </div>
  );
};
