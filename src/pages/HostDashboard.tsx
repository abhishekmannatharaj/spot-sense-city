
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParking } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import AddParkingSpotForm from '@/components/AddParkingSpotForm';

const HostDashboard: React.FC = () => {
  const { user, updateUserType } = useAuth();
  const { parkingSpots, isLoading } = useParking();
  const [addSpotDialogOpen, setAddSpotDialogOpen] = useState(false);
  
  // Filter spots owned by the current user
  const mySpots = user 
    ? parkingSpots.filter(spot => spot.ownerId === user.id)
    : [];
  
  const becomeHost = () => {
    updateUserType('space_owner');
  };
  
  const handleViewDetails = (spotId: string) => {
    // Navigation to spot details would go here
    console.log('View details for spot:', spotId);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <h1 className="text-2xl font-bold mb-4">Host Dashboard</h1>
        <p className="text-muted-foreground">Please login to access the host dashboard.</p>
      </div>
    );
  }
  
  if (user.userType !== 'space_owner') {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <Card className="max-w-md w-full p-6">
          <h1 className="text-2xl font-bold mb-4">Become a Host</h1>
          <p className="text-muted-foreground mb-6">
            Earn extra income by renting out your unused parking spots. It's easy to get started!
          </p>
          <Button onClick={becomeHost} className="w-full">Become a Host</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Host Dashboard</h1>
        <Button onClick={() => setAddSpotDialogOpen(true)}>Add Parking Spot</Button>
      </div>
      
      <Tabs defaultValue="spots">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="spots" className="flex-1">My Parking Spots</TabsTrigger>
          <TabsTrigger value="earnings" className="flex-1">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spots">
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexlot-600"></div>
            </div>
          ) : mySpots.length === 0 ? (
            <div className="text-center my-12">
              <p className="text-lg text-muted-foreground mb-4">You haven't added any parking spots yet</p>
              <Button onClick={() => setAddSpotDialogOpen(true)}>Add Your First Spot</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySpots.map(spot => (
                <ParkingSpotCard
                  key={spot.id}
                  spot={spot}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="earnings">
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold mb-4">Earnings Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-muted">
                  <CardContent className="p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="text-2xl font-bold">$0.00</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardContent className="p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">Total Earnings</span>
                    <span className="text-2xl font-bold">$0.00</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardContent className="p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">Pending Payout</span>
                    <span className="text-2xl font-bold">$0.00</span>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-muted-foreground text-center">
                No earnings yet. Add parking spots and start earning!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Parking Spot Dialog */}
      <Dialog open={addSpotDialogOpen} onOpenChange={setAddSpotDialogOpen}>
        <DialogContent className="max-w-3xl max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New Parking Spot</DialogTitle>
          </DialogHeader>
          <AddParkingSpotForm onSuccess={() => setAddSpotDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostDashboard;
