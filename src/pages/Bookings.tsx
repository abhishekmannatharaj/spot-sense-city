
import React, { useEffect } from 'react';
import { useParking } from '@/context/ParkingContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

const Bookings: React.FC = () => {
  const { myBookings, fetchMyBookings, isLoading } = useParking();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyBookings(user.id);
    }
  }, [fetchMyBookings, user]);

  if (!user) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        <p className="text-muted-foreground">Please login to view your bookings.</p>
      </div>
    );
  }

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeStr;
    }
  };

  return (
    <div className="container mx-auto p-4 mb-16">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexlot-600"></div>
        </div>
      ) : myBookings.length === 0 ? (
        <div className="text-center my-12">
          <p className="text-lg text-muted-foreground mb-4">You haven't made any bookings yet</p>
          <Button asChild>
            <a href="/">Find Parking Spots</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((booking) => {
            const spot = booking.parkingSpotId;
            
            return (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Booking #{booking.id.substring(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {formatDateTime(booking.createdAt.toString())}
                      </p>
                    </div>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}
                    `}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Start Time:</span>
                          <p>{formatDateTime(booking.startTime)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">End Time:</span>
                          <p>{formatDateTime(booking.endTime)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator orientation="vertical" className="hidden sm:block" />
                    <Separator className="sm:hidden" />
                    
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Parking Spot:</span>
                          <p>{spot}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Payment Status:</span>
                          <p className={`
                            ${booking.paymentStatus === 'paid' ? 'text-green-600' : 
                              booking.paymentStatus === 'refunded' ? 'text-amber-600' : 'text-red-600'}
                          `}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t p-4 flex justify-between">
                  <div>
                    <p className="text-sm">Total Price:</p>
                    <p className="font-semibold">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <Button variant="outline">Cancel Booking</Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
