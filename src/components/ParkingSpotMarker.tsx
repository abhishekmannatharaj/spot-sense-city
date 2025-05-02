
import React from 'react';
import { Marker, Popup } from 'react-map-gl';
import { ParkingSpot } from '@/types';
import ParkingSpotCard from './ParkingSpotCard';

interface ParkingSpotMarkerProps {
  spot: ParkingSpot;
  onClick: () => void;
  isSelected: boolean;
  onViewDetails: (spotId: string) => void;
}

const ParkingSpotMarker: React.FC<ParkingSpotMarkerProps> = ({ 
  spot, 
  onClick, 
  isSelected,
  onViewDetails
}) => {
  return (
    <>
      <Marker
        longitude={spot.longitude}
        latitude={spot.latitude}
        anchor="bottom"
        onClick={onClick}
      >
        <div 
          className={`
            w-8 h-8 rounded-full flex items-center justify-center 
            ${isSelected ? 'bg-nexlot-600 scale-125' : 'bg-nexlot-400'} 
            text-white cursor-pointer shadow-md hover:shadow-lg transition-all
            ${isSelected ? 'z-20' : 'z-10'}
          `}
        >
          <span className="font-semibold">P</span>
        </div>
      </Marker>

      {isSelected && (
        <Popup
          longitude={spot.longitude}
          latitude={spot.latitude}
          anchor="top"
          closeButton={false}
          className="z-30 w-72"
          maxWidth="300px"
        >
          <div className="p-1">
            <ParkingSpotCard 
              spot={spot} 
              onViewDetails={onViewDetails} 
              compact={true}
            />
          </div>
        </Popup>
      )}
    </>
  );
};

export default ParkingSpotMarker;
