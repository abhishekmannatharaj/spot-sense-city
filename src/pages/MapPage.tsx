
import React, { useEffect, useState, useRef } from 'react';
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

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyAy71IIAH6wSCX4heLACwywNPzueSpCvk0';

// Bangalore coordinates
const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 };

const MapPage: React.FC = () => {
  const { parkingSpots, fetchParkingSpots, selectedSpot, selectSpot, isLoading } = useParking();
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState(false);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  
  useEffect(() => {
    fetchParkingSpots();
  }, [fetchParkingSpots]);

  useEffect(() => {
    if (selectedSpot) {
      setIsSpotDrawerOpen(true);
    }
  }, [selectedSpot]);

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize Google Map
  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: BANGALORE_CENTER,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    googleMapRef.current = map;
    setMapLoaded(true);
  };

  // Add parking spot markers to map
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current.clear();
    
    // Add new markers
    parkingSpots.forEach((spot) => {
      const marker = new google.maps.Marker({
        position: { lat: spot.latitude, lng: spot.longitude },
        map: googleMapRef.current,
        title: spot.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: selectedSpot?.id === spot.id ? '#4f46e5' : '#ef4444',
          fillOpacity: 0.7,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        }
      });
      
      marker.addListener('click', () => {
        selectSpot(spot.id);
      });
      
      markersRef.current.set(spot.id, marker);
    });
  }, [parkingSpots, selectedSpot, mapLoaded, selectSpot]);

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

  const handleSearch = () => {
    setIsSearching(true);
    // In a real app, we would search for spots near the current location
    setTimeout(() => {
      setIsSearching(false);
      toast({ title: "Spots Found", description: `Found ${parkingSpots.length} parking spots nearby in Bangalore` });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Search bar */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search for parking spots in Bangalore..." 
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

      {/* Google Map */}
      <div className="h-[60vh] sticky top-0 z-0 shadow-md">
        <div ref={mapRef} className="w-full h-full"></div>

        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexlot-600 mb-4 mx-auto"></div>
              <p className="text-lg font-semibold">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* List of parking spots */}
      <div className="bg-white flex-1 px-4 pt-4 pb-20">
        <h2 className="font-semibold text-xl mb-4">Parking Spots in Bangalore</h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexlot-600"></div>
            </div>
          ) : parkingSpots.length === 0 ? (
            <p className="text-center text-muted-foreground">No parking spots found nearby</p>
          ) : (
            parkingSpots.map(spot => (
              <ParkingSpotCard 
                key={spot.id}
                spot={spot}
                onViewDetails={handleViewDetails}
                onBook={() => {
                  selectSpot(spot.id);
                  startBooking();
                }}
              />
            ))
          )}
        </div>
      </div>
      
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
