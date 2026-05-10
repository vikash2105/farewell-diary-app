/**
 * AvatarUpload Component
 * Allows users to upload and preview their avatar
 */

import { Camera, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface AvatarUploadProps {
  currentAvatar: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
}

export default function AvatarUpload({ currentAvatar, onUpload, onRemove }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPEG, PNG, WebP, or GIF image');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setError(null);
    try {
      await onUpload(file);
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
      setPreview(currentAvatar);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    
    setUploading(true);
    setError(null);
    try {
      await onRemove();
      setPreview(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Circle */}
      <div className="relative group">
        <div className="
          w-32 h-32 rounded-full 
          bg-primary/10
          flex items-center justify-center
          overflow-hidden
          border-4 border-background
          shadow-xl
          transition-transform duration-300
          group-hover:scale-105
        ">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-16 h-16 text-primary/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Upload/Remove Overlay */}
        <div className="
          absolute inset-0 rounded-full
          bg-black bg-opacity-50
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          cursor-pointer
        ">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="
              bg-background text-foreground
              p-3 rounded-full
              hover:bg-muted
              transition-colors
              disabled:opacity-50
            "
            aria-label="Upload avatar"
          >
            <Camera className="w-5 h-5" />
          </button>

          {preview && onRemove && (
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="
                bg-destructive text-destructive-foreground
                p-3 rounded-full
                hover:opacity-90
                transition-colors
                ml-2
                disabled:opacity-50
              "
              aria-label="Remove avatar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Change Drawing Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-4 text-sm font-bold text-primary hover:opacity-80 disabled:opacity-50"
      >
        Change drawing
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="mt-2 text-center text-xs text-muted-foreground">
        JPEG, PNG, WebP, or GIF. Max 2MB
      </p>
    </div>
  );
}
