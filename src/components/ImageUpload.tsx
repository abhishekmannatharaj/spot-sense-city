
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  multiple?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  multiple = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // In a real app, we would upload to Firebase or another service
      // For this demo, we'll simulate an upload and return a placeholder URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll use unsplash images
      const placeholderImages = [
        'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=500&auto=format',
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&auto=format',
        'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=500&auto=format'
      ];
      
      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      const imageUrl = placeholderImages[randomIndex];
      
      onImageUpload(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className={`${className}`}>
      <label className="block">
        <Button 
          variant="outline" 
          className="w-full h-32 border-dashed flex flex-col gap-2 hover:bg-muted"
          disabled={isUploading}
        >
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-nexlot-400"></div>
              <span className="ml-2">Uploading...</span>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Upload image</span>
              <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB</span>
            </>
          )}
        </Button>
      </label>
    </div>
  );
};

export default ImageUpload;
