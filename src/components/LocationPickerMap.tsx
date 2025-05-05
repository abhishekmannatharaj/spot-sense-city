
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyAy71IIAH6wSCX4heLACwywNPzueSpCvk0';

// Default to Bangalore center
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

interface LocationPickerMapProps {
  onLocationSelected: (location: { latitude: number; longitude: number; address: string }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ 
  onLocationSelected,
  initialLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{lat: number; lng: number} | null>(
    initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : null
  );

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: initialLocation 
        ? { lat: initialLocation.latitude, lng: initialLocation.longitude } 
        : DEFAULT_CENTER,
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    googleMapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();

    // Add initial marker if location is provided
    if (initialLocation) {
      const position = { lat: initialLocation.latitude, lng: initialLocation.longitude };
      addMarker(position);
      getAddressFromLatLng(position);
    }

    // Add click event handler to the map
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const position = event.latLng?.toJSON();
      if (position) {
        addMarker(position);
        getAddressFromLatLng(position);
        setSelectedLocation(position);
      }
    });

    setMapLoaded(true);
  };

  // Add marker to the map
  const addMarker = (position: { lat: number; lng: number }) => {
    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new google.maps.Marker({
      position,
      map: googleMapRef.current,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });

    // Add drag end event to update location when marker is dragged
    markerRef.current.addListener('dragend', () => {
      const position = markerRef.current?.getPosition()?.toJSON();
      if (position) {
        getAddressFromLatLng(position);
        setSelectedLocation(position);
      }
    });
  };

  // Get address from latitude and longitude
  const getAddressFromLatLng = (position: { lat: number; lng: number }) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress('Unknown location');
      }
    });
  };

  // Handle selection confirmation
  const handleConfirmLocation = () => {
    if (selectedLocation && address) {
      onLocationSelected({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[300px] rounded-md overflow-hidden shadow-sm border">
        <div ref={mapRef} className="w-full h-full"></div>

        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexlot-600 mb-2 mx-auto"></div>
              <p className="text-sm font-medium">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {selectedLocation ? 'Selected location:' : 'Click on the map to select a location'}
        </p>
        {address && (
          <p className="text-sm font-medium p-2 bg-muted rounded-md">{address}</p>
        )}
      </div>

      <Button 
        type="button"
        onClick={handleConfirmLocation}
        disabled={!selectedLocation}
        className="w-full"
      >
        Confirm Location
      </Button>
    </div>
  );
};

export default LocationPickerMap;
