
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useParking } from '@/context/ParkingContext';
import { useAuth } from '@/context/AuthContext';
import { ParkingSpot, SafetyAnalysisResult } from '@/types';
import { toast } from '@/components/ui/sonner';
import ImageUpload from './ImageUpload';
import SafetyScore from './SafetyScore';

interface AddParkingSpotFormProps {
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  hourlyRate: string;
  dailyRate: string;
  availableFrom: string;
  availableTo: string;
  amenities: string;
}

const AddParkingSpotForm: React.FC<AddParkingSpotFormProps> = ({ onSuccess }) => {
  const { createParkingSpot, analyzeParkingImage, isLoading } = useParking();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [safetyAnalysis, setSafetyAnalysis] = useState<SafetyAnalysisResult | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      address: '',
      latitude: '',
      longitude: '',
      hourlyRate: '',
      dailyRate: '',
      availableFrom: '08:00',
      availableTo: '20:00',
      amenities: '',
    }
  });

  const handleImageUpload = async (imageUrl: string) => {
    setImages([...images, imageUrl]);
    
    try {
      // Analyze the image for safety
      const analysis = await analyzeParkingImage(imageUrl);
      setSafetyAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a parking spot');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const newSpot: Omit<ParkingSpot, 'id' | 'safetyScore' | 'safetyLabels' | 'createdAt'> = {
        ownerId: user.id,
        title: values.title,
        description: values.description,
        address: values.address,
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        hourlyRate: parseFloat(values.hourlyRate),
        dailyRate: values.dailyRate ? parseFloat(values.dailyRate) : undefined,
        images,
        availableFrom: values.availableFrom,
        availableTo: values.availableTo,
        amenities: values.amenities.split(',').map(item => item.trim()).filter(Boolean),
        isActive: true,
        safetyScore: safetyAnalysis?.score || 0,
        safetyLabels: safetyAnalysis?.labels || [],
      };

      await createParkingSpot(newSpot);
      onSuccess();
    } catch (error) {
      console.error('Error creating parking spot:', error);
      toast.error('Failed to create parking spot');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Add Your Parking Spot</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Secure Indoor Parking Near Downtown" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your parking spot" 
                      className="min-h-24" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Main St, City, State" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="e.g., 37.7749" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="e.g., -122.4194" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="e.g., 5.00" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Rate ($, optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="e.g., 25.00" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available From</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availableTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available To</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Security Cameras, Covered, EV Charging" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <p className="font-medium text-sm">Parking Spot Photos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display uploaded images */}
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Parking spot ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {/* Image upload component */}
                {images.length < 3 && (
                  <ImageUpload onImageUpload={handleImageUpload} />
                )}
              </div>
            </div>
            
            {/* Display safety analysis if available */}
            {safetyAnalysis && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">AI Safety Analysis</h3>
                <SafetyScore score={safetyAnalysis.score} labels={safetyAnalysis.labels} />
              </div>
            )}
          </div>
          
          <Button 
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Parking Spot'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddParkingSpotForm;
