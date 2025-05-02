
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useParking } from '@/context/ParkingContext';
import { useAuth } from '@/context/AuthContext';
import { ParkingSpot } from '@/types';
import { toast } from '@/components/ui/sonner';
import { Card } from '@/components/ui/card';

interface BookingFormProps {
  spot: ParkingSpot;
  onSuccess: () => void;
  onCancel: () => void;
}

interface BookingFormValues {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ spot, onSuccess, onCancel }) => {
  const { bookParkingSpot, isLoading } = useParking();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const form = useForm<BookingFormValues>({
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      startTime: spot.availableFrom,
      endDate: new Date().toISOString().split('T')[0],
      endTime: spot.availableTo,
    }
  });

  const calculatePrice = (formValues: BookingFormValues) => {
    const start = new Date(`${formValues.startDate}T${formValues.startTime}`);
    const end = new Date(`${formValues.endDate}T${formValues.endTime}`);
    const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return spot.hourlyRate * durationHrs;
  };

  const totalPrice = calculatePrice(form.watch());

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) {
      toast.error('You must be logged in to book a spot');
      return;
    }

    try {
      setIsProcessing(true);
      const startDateTime = `${values.startDate}T${values.startTime}`;
      const endDateTime = `${values.endDate}T${values.endTime}`;
      
      await bookParkingSpot(spot.id, startDateTime, endDateTime, user.id);
      onSuccess();
      toast.success('Booking completed successfully');
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to complete booking');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Book this spot</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      disabled={isLoading || isProcessing}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      disabled={isLoading || isProcessing}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      disabled={isLoading || isProcessing}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      disabled={isLoading || isProcessing}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span>Rate:</span>
              <span>${spot.hourlyRate.toFixed(2)}/hour</span>
            </div>
            <div className="flex items-center justify-between font-semibold mt-2">
              <span>Total:</span>
              <span>${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading || isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isProcessing}
              className="relative"
            >
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
              Complete Booking
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default BookingForm;
