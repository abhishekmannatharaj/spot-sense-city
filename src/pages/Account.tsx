
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const Account: React.FC = () => {
  const { user, logout, updateUserType } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <h1 className="text-2xl font-bold mb-4">Account</h1>
        <p className="text-muted-foreground">Please login to view your account.</p>
      </div>
    );
  }

  const toggleUserType = () => {
    const newType = user.userType === 'vehicle_owner' ? 'space_owner' : 'vehicle_owner';
    updateUserType(newType);
  };

  return (
    <div className="container mx-auto p-4 mb-16">
      <h1 className="text-2xl font-bold mb-6">Account</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name || user.email} />
                <AvatarFallback className="text-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Account Type</h3>
                <div className="flex items-center justify-between">
                  <span>
                    {user.userType === 'vehicle_owner' ? 'Vehicle Owner' : 'Space Owner'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={user.userType !== 'space_owner' ? 'font-medium' : 'text-muted-foreground'}>
                      Find
                    </span>
                    <Switch 
                      checked={user.userType === 'space_owner'} 
                      onCheckedChange={toggleUserType}
                    />
                    <span className={user.userType === 'space_owner' ? 'font-medium' : 'text-muted-foreground'}>
                      Host
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Account Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>
                      {user.createdAt instanceof Date 
                        ? user.createdAt.toLocaleDateString() 
                        : new Date().toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Payment Methods</h3>
                <Button variant="outline" className="w-full">Add Payment Method</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={logout}>Log Out</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email updates about your bookings</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Location Services</p>
                  <p className="text-sm text-muted-foreground">Allow app to access your location</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Help Center
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
