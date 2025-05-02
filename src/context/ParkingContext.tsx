
import { createContext, useContext, useState, ReactNode } from 'react';
import { ParkingSpot, Booking, SafetyAnalysisResult } from '@/types';
import { toast } from '@/components/ui/sonner';

interface ParkingContextType {
  parkingSpots: ParkingSpot[];
  myBookings: Booking[];
  selectedSpot: ParkingSpot | null;
  isLoading: boolean;
  fetchParkingSpots: () => Promise<void>;
  fetchMyBookings: (userId: string) => Promise<void>;
  selectSpot: (spotId: string | null) => void;
  createParkingSpot: (spot: Omit<ParkingSpot, 'id' | 'safetyScore' | 'safetyLabels' | 'createdAt'>) => Promise<void>;
  updateParkingSpot: (spotId: string, updates: Partial<ParkingSpot>) => Promise<void>;
  deleteParkingSpot: (spotId: string) => Promise<void>;
  bookParkingSpot: (spotId: string, startTime: string, endTime: string, userId: string) => Promise<void>;
  analyzeParkingImage: (imageUrl: string) => Promise<SafetyAnalysisResult>;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

// Mock data for parking spots
const mockParkingSpots: ParkingSpot[] = [
  {
    id: 'spot_1',
    ownerId: 'owner_1',
    title: 'Secure Indoor Parking - Downtown',
    description: 'Indoor parking spot in a secure building with 24/7 access and security cameras.',
    address: '123 Main St, Downtown City',
    latitude: 37.7749,
    longitude: -122.4194,
    hourlyRate: 4.50,
    dailyRate: 25,
    images: ['https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    safetyScore: 4.8,
    safetyLabels: ['Well-lit', 'Indoor', 'Secured'],
    availableFrom: '08:00',
    availableTo: '20:00',
    amenities: ['Security Cameras', 'Covered', 'EV Charging'],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'spot_2',
    ownerId: 'owner_2',
    title: 'Driveway Parking Near City Center',
    description: 'Private driveway parking spot in a residential area, 10 min walk to city center.',
    address: '456 Oak Ave, Midtown',
    latitude: 37.7850,
    longitude: -122.4320,
    hourlyRate: 3,
    dailyRate: 18,
    images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    safetyScore: 3.9,
    safetyLabels: ['Residential', 'Outdoor'],
    availableFrom: '09:00',
    availableTo: '22:00',
    amenities: ['Residential Area'],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'spot_3',
    ownerId: 'owner_3',
    title: 'Premium Garage Near Stadium',
    description: 'Private garage spot perfect for game days, just 5 minutes walk to the stadium.',
    address: '789 Stadium Way',
    latitude: 37.7790,
    longitude: -122.4100,
    hourlyRate: 7,
    dailyRate: 40,
    images: ['https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    safetyScore: 4.5,
    safetyLabels: ['Well-lit', 'Garage', 'Secured'],
    availableFrom: '07:00',
    availableTo: '23:59',
    amenities: ['Gated', 'EV Charging'],
    isActive: true,
    createdAt: new Date(),
  },
];

// Mock data for bookings
const mockBookings: Booking[] = [];

interface ParkingProviderProps {
  children: ReactNode;
}

export const ParkingProvider = ({ children }: ParkingProviderProps) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(mockParkingSpots);
  const [myBookings, setMyBookings] = useState<Booking[]>(mockBookings);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParkingSpots = async () => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch from an API
      setParkingSpots(mockParkingSpots);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      toast.error('Failed to load parking spots');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyBookings = async (userId: string) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch from an API with the userId
      const userBookings = mockBookings.filter(booking => booking.userId === userId);
      setMyBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load your bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const selectSpot = (spotId: string | null) => {
    if (!spotId) {
      setSelectedSpot(null);
      return;
    }
    
    const spot = parkingSpots.find(s => s.id === spotId);
    setSelectedSpot(spot || null);
  };

  const createParkingSpot = async (spotData: Omit<ParkingSpot, 'id' | 'safetyScore' | 'safetyLabels' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would send this data to an API
      const newSpot: ParkingSpot = {
        ...spotData,
        id: `spot_${Math.random().toString(36).substr(2, 9)}`,
        safetyScore: 0, // Will be updated after image analysis
        safetyLabels: [],
        createdAt: new Date(),
      };
      
      setParkingSpots([...parkingSpots, newSpot]);
      toast.success('Parking spot created successfully');
    } catch (error) {
      console.error('Error creating parking spot:', error);
      toast.error('Failed to create parking spot');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateParkingSpot = async (spotId: string, updates: Partial<ParkingSpot>) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const updatedSpots = parkingSpots.map(spot => 
        spot.id === spotId ? { ...spot, ...updates } : spot
      );
      
      setParkingSpots(updatedSpots);
      
      // Update selected spot if it's the one being updated
      if (selectedSpot && selectedSpot.id === spotId) {
        setSelectedSpot({ ...selectedSpot, ...updates });
      }
      
      toast.success('Parking spot updated successfully');
    } catch (error) {
      console.error('Error updating parking spot:', error);
      toast.error('Failed to update parking spot');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteParkingSpot = async (spotId: string) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const filteredSpots = parkingSpots.filter(spot => spot.id !== spotId);
      setParkingSpots(filteredSpots);
      
      // Clear selected spot if it's the one being deleted
      if (selectedSpot && selectedSpot.id === spotId) {
        setSelectedSpot(null);
      }
      
      toast.success('Parking spot deleted successfully');
    } catch (error) {
      console.error('Error deleting parking spot:', error);
      toast.error('Failed to delete parking spot');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const bookParkingSpot = async (spotId: string, startTime: string, endTime: string, userId: string) => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const spotToBook = parkingSpots.find(spot => spot.id === spotId);
      if (!spotToBook) {
        throw new Error('Parking spot not found');
      }
      
      // Calculate duration in hours (simplified)
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Calculate price (simplified)
      const totalPrice = spotToBook.hourlyRate * durationHrs;
      
      const newBooking: Booking = {
        id: `booking_${Math.random().toString(36).substr(2, 9)}`,
        parkingSpotId: spotId,
        userId,
        startTime,
        endTime,
        totalPrice,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date(),
      };
      
      setMyBookings([...myBookings, newBooking]);
      toast.success('Parking spot booked successfully');
    } catch (error) {
      console.error('Error booking parking spot:', error);
      toast.error('Failed to book parking spot');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeParkingImage = async (imageUrl: string): Promise<SafetyAnalysisResult> => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would send this to an AI API
      // For now, return mock data
      const mockAnalysis: SafetyAnalysisResult = {
        score: (Math.random() * 3) + 2, // Random score between 2-5
        labels: ['Well-lit', 'Residential'],
      };
      
      if (mockAnalysis.score > 4) {
        mockAnalysis.labels.push('Secured');
      }
      
      if (Math.random() > 0.5) {
        mockAnalysis.labels.push('Indoor');
      } else {
        mockAnalysis.labels.push('Outdoor');
      }
      
      toast.success('Image analyzed successfully');
      return mockAnalysis;
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParkingContext.Provider
      value={{
        parkingSpots,
        myBookings,
        selectedSpot,
        isLoading,
        fetchParkingSpots,
        fetchMyBookings,
        selectSpot,
        createParkingSpot,
        updateParkingSpot,
        deleteParkingSpot,
        bookParkingSpot,
        analyzeParkingImage,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};
