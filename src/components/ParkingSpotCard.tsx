
import React from 'react';
import { ParkingSpot } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SafetyScore from './SafetyScore';
import { cn } from '@/lib/utils';

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
  // Determine if spot is "fast filling" (red shade) or "available" (green shade)
  // For demo purposes, using spot id to determine status
  const isFastFilling = spot.id === 'spot_1'; // Red shade for spot_1
  const isHighlyAvailable = spot.id === 'spot_3'; // Green shade for spot_3
  
  const cardClass = cn(
    `overflow-hidden ${compact ? 'w-full' : 'w-full'} hover:shadow-lg transition-all duration-200`,
    {
      'border-red-500 border-2': isFastFilling,
      'border-green-500 border-2': isHighlyAvailable,
    }
  );

  return (
    <Card className={cardClass}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={spot.images[0] || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500'} 
          alt={spot.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-semibold text-lg">₹{spot.hourlyRate.toFixed(2)}/hr</p>
        </div>
        {isFastFilling && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
            Fast Filling
          </div>
        )}
        {isHighlyAvailable && (
          <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-semibold">
            Available
          </div>
        )}
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
