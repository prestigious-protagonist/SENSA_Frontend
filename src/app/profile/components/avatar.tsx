"use client";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";

export function Avatar({
  defaultImage,
  onImageChange,
}: {
  defaultImage?: string;
  onImageChange: (imageUrl: string) => void;
}) {
  const [hideDefault] = useState(false);
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const currentImage = previewUrl || (!hideDefault ? defaultImage : null);
  useEffect(() => {
    if (!previewUrl && defaultImage) {
      onImageChange(defaultImage);
    } else if (previewUrl) {
      onImageChange(previewUrl);
    }
  }, [previewUrl, defaultImage, onImageChange]);

  return (
    <div className="-mt-12">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        {currentImage && (
          <Image
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            className="z-40 flex items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-200 ease-in-out p-2 hover:bg-black/80 focus:outline-none"
            onClick={handleThumbnailClick}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlus size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload profile picture"
      />
    </div>
  );
}
