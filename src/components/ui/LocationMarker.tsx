// LocationMarker.tsx
import { Marker } from '@react-google-maps/api';
interface LocationMarkerProps {
  position: google.maps.LatLngLiteral;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position }) => {
  return (
    <Marker
      position={position}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      }}
    />
  );
};

export default LocationMarker;
