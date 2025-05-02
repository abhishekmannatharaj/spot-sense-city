
import React from 'react';
import { ParkingSpot } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SafetyScore from './SafetyScore';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onViewDetails: (spotId: string) => void;
  onBook?: (spotId: string) => void;
  compact?: boolean;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ 
  spot, 
  onViewDetails, 
  onBook,
  compact = false 
}) => {
  return (
    <Card className={`overflow-hidden ${compact ? 'w-full' : 'w-full'} hover:shadow-lg transition-all duration-200`}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={spot.images[0] || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500'} 
          alt={spot.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-semibold text-lg">${spot.hourlyRate.toFixed(2)}/hr</p>
        </div>
      </div>
      
      <CardContent className={`${compact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-lg'} mb-1 line-clamp-1`}>{spot.title}</h3>
        {!compact && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{spot.address}</p>}
        
        <SafetyScore score={spot.safetyScore} labels={compact ? undefined : spot.safetyLabels} />
      </CardContent>
      
      <CardFooter className={`flex gap-2 ${compact ? 'p-3 pt-0' : 'px-4 pb-4'}`}>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="flex-1"
          onClick={() => onViewDetails(spot.id)}
        >
          Details
        </Button>
        
        {onBook && (
          <Button 
            variant="default" 
            size={compact ? "sm" : "default"}
            className="flex-1" 
            onClick={() => onBook(spot.id)}
          >
            Book
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ParkingSpotCard;
