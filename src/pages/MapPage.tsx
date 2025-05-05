import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useParking } from '@/context/ParkingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import ParkingSpotMarker from '@/components/ParkingSpotMarker';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import BookingForm from '@/components/BookingForm';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const MapPage: React.FC = () => {
  const { parkingSpots, fetchParkingSpots, selectedSpot, selectSpot, isLoading } = useParking();
  const { toast } = useToast();

  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSpotDrawerOpen, setIsSpotDrawerOpen] = useState(false);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          setCenter(userPos);
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast({
            title: 'Location Access Denied',
            description: 'Enable location permissions to center the map on your location.',
            variant: 'destructive',
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchParkingSpots();
  }, [fetchParkingSpots]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location, using fallback:", error.message);
          setCenter(defaultCenter);
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setCenter(defaultCenter);
    }
  }, []);

  useEffect(() => {
    if (selectedSpot) {
      setIsSpotDrawerOpen(true);
      setCenter({ lat: selectedSpot.latitude, lng: selectedSpot.longitude });
    }
  }, [selectedSpot]);

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
    setTimeout(() => {
      setIsSearching(false);
      toast({ title: "Spots Found", description: `Found ${parkingSpots.length} parking spots nearby` });
    }, 1500);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

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

      {/* Google Map */}
      <div className="flex-1 relative h-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
        >
          {/* ✅ User Location Marker */}
          {userLocation && isLoaded && (
            <Marker
              position={userLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {parkingSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              onClick={() => handleMarkerClick(spot.id)}
            />
          ))}
        </GoogleMap>
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
                      <span
                        key={i}
                        className={`safety-score-item ${i < Math.round(selectedSpot.safetyScore) ? 'active' : 'inactive'}`}
                      />
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

      <div className="h-16" />
    </div>
  );
};

export default MapPage;
