import { MarkerF } from '@react-google-maps/api';
import React from 'react';

interface LocationMarkerProps {
  lat: number;
  lng: number;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ lat, lng }) => {
  return (
    <MarkerF
      position={{ lat, lng }}
      icon={{
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
      }}
    />
  );
};

export default LocationMarker;
