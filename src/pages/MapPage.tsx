
import React, { useEffect, useState, useRef } from 'react';
import Map, { ViewStateChangeEvent, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParking } from '@/context/ParkingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import ParkingSpotMarker from '@/components/ParkingSpotMarker';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import BookingForm from '@/components/BookingForm';

// In a real app, you would get this from an environment variable
// For demo purposes, we're using a placeholder
const MAPBOX_TOKEN = 'your-mapbox-token-here'; // Users will need to provide this

const MapPage: React.FC = () => {
  const { parkingSpots, fetchParkingSpots, selectedSpot, selectSpot, isLoading } = useParking();
  const { toast } = useToast();
  const [viewState, setViewState] = useState({
    longitude: -122.4194,
    latitude: 37.7749,
    zoom: 13
  });
  const [isUsingMapbox, setIsUsingMapbox] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState(false);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  
  const mapRef = useRef(null);
  
  useEffect(() => {
    fetchParkingSpots();
  }, [fetchParkingSpots]);

  useEffect(() => {
    if (selectedSpot) {
      setIsSpotDrawerOpen(true);
    }
  }, [selectedSpot]);

  const handleViewStateChange = (event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  };

  const handleMarkerClick = (spotId: string) => {
    selectSpot(spotId);
  };
  
  const handleViewDetails = (spotId: string) => {
    selectSpot(spotId);
    setIsSpotDrawerOpen(true);
  };
  
  const startBooking = () => {
    setIsSpotDrawerOpen(false);
    setIsBookingDrawerOpen(true);
  };
  
  const handleBookingSuccess = () => {
    setIsBookingDrawerOpen(false);
    toast({ title: "Success", description: "Parking spot booked successfully!" });
  };

  const handleBookingCancel = () => {
    setIsBookingDrawerOpen(false);
    setIsSpotDrawerOpen(true);
  };

  const enableMapbox = () => {
    if (mapboxToken.trim() === '') {
      toast({ 
        title: "Missing Token", 
        description: "Please enter your Mapbox token",
        variant: "destructive"
      });
      return;
    }
    setIsUsingMapbox(true);
    toast({ title: "Success", description: "Mapbox enabled!" });
  };

  const handleSearch = () => {
    setIsSearching(true);
    // In a real app, we would search for spots near the current location
    setTimeout(() => {
      setIsSearching(false);
      toast({ title: "Spots Found", description: `Found ${parkingSpots.length} parking spots nearby` });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Search bar */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search for parking spots..." 
            className="bg-white shadow-md"
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="whitespace-nowrap"
          >
            {isSearching ? (
              <>
                <span className="animate-spin mr-2">⟳</span> 
                Searching
              </>
            ) : (
              'Find Spots'
            )}
          </Button>
        </div>
      </div>

      {/* Map placeholder or Mapbox map */}
      {!isUsingMapbox ? (
        <div className="flex flex-col h-full">
          <div className="flex-1 bg-gray-100 flex items-center justify-center flex-col p-4">
            <Card className="w-full max-w-md p-4">
              <h2 className="text-lg font-semibold mb-4">Enter your Mapbox token</h2>
              <p className="text-sm text-muted-foreground mb-4">
                To use the map functionality, you need to provide a Mapbox token. 
                You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-nexlot-600 hover:underline">Mapbox.com</a>.
              </p>
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91..." 
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="mb-4"
              />
              <Button onClick={enableMapbox} className="w-full">Enable Map</Button>
            </Card>
            
            {/* Mock parking spot list for non-map view */}
            <div className="w-full max-w-md mt-4 space-y-4">
              <h3 className="font-semibold text-lg">Available Parking Spots</h3>
              {parkingSpots.map(spot => (
                <ParkingSpotCard 
                  key={spot.id}
                  spot={spot}
                  onViewDetails={handleViewDetails}
                  onBook={() => {
                    selectSpot(spot.id);
                    startBooking();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative h-full">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={handleViewStateChange}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxToken || MAPBOX_TOKEN}
          >
            {parkingSpots.map((spot) => (
              <ParkingSpotMarker
                key={spot.id}
                spot={spot}
                onClick={() => handleMarkerClick(spot.id)}
                isSelected={selectedSpot?.id === spot.id}
                onViewDetails={handleViewDetails}
              />
            ))}
          </Map>
        </div>
      )}
      
      {/* Spot details drawer */}
      <Drawer open={isSpotDrawerOpen} onOpenChange={setIsSpotDrawerOpen}>
        <div className="p-4 max-h-[70vh] overflow-auto">
          {selectedSpot && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedSpot.images[0]} 
                  alt={selectedSpot.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-semibold text-xl">${selectedSpot.hourlyRate.toFixed(2)}/hr</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold">{selectedSpot.title}</h2>
                <p className="text-muted-foreground mb-2">{selectedSpot.address}</p>
                
                <div className="flex items-center my-2">
                  <span className="text-sm font-medium">Safety Score:</span>
                  <div className="ml-2 safety-score">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className={`safety-score-item ${i < Math.round(selectedSpot.safetyScore) ? 'active' : 'inactive'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">{selectedSpot.safetyScore.toFixed(1)}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedSpot.safetyLabels.map((label, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-nexlot-50 text-nexlot-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm mb-4">{selectedSpot.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Hours:</span>
                    <span>{selectedSpot.availableFrom} - {selectedSpot.availableTo}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span>{selectedSpot.dailyRate ? `$${selectedSpot.dailyRate.toFixed(2)}` : 'N/A'}</span>
                  </div>
                </div>
                
                {selectedSpot.amenities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpot.amenities.map((amenity, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full mt-2" 
                  onClick={startBooking}
                >
                  Book This Spot
                </Button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
      
      {/* Booking drawer */}
      <Drawer open={isBookingDrawerOpen} onOpenChange={setIsBookingDrawerOpen}>
        <div className="p-4">
          {selectedSpot && (
            <BookingForm
              spot={selectedSpot}
              onSuccess={handleBookingSuccess}
              onCancel={handleBookingCancel}
            />
          )}
        </div>
      </Drawer>
      
      {/* Bottom padding to account for mobile nav */}
      <div className="h-16" />
    </div>
  );
};

export default MapPage;
