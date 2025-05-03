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
      // Simulated upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      const uploadedImages = Array.from(files).map(file =>
        URL.createObjectURL(file)
      );

      // Just use the first one for this example
      onImageUpload(uploadedImages[0]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
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
          accept="image/*"
          capture="environment" // <-- This hints to use the rear camera
          multiple={multiple}
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
        />


          <input
            type="file"
            className="sr-only"
            accept="image/*"
            capture="environment"
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
              <span className="text-xs text-muted-foreground">Camera or Gallery - JPG, PNG up to 10MB</span>
            </>
          )}
        </Button>
      </label>
    </div>
  );
};

export default ImageUpload;
