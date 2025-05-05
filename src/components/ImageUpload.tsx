
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Camera, Image } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="h-32 border-dashed flex flex-col gap-2 hover:bg-muted"
          onClick={handleCameraClick}
          disabled={isUploading}
        >
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
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
              <Camera className="h-8 w-8" />
              <span>Take Photo</span>
            </>
          )}
        </Button>

        <Button 
          variant="outline" 
          className="h-32 border-dashed flex flex-col gap-2 hover:bg-muted"
          onClick={handleGalleryClick}
          disabled={isUploading}
        >
          <input
            ref={fileInputRef}
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
              <Image className="h-8 w-8" />
              <span>Gallery</span>
              <span className="text-xs text-muted-foreground">JPG, PNG up to 10MB</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
