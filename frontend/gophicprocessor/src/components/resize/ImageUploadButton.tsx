"use client";

import React, { useState, useEffect } from "react";
import ResizeImageJobCard from "./ResizeImageJobCard";

export default function ImageUploadButton() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a temporary URL for the file preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  // Clean up the object URL when the component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && file && (
        <ResizeImageJobCard
          imageUrl={previewUrl}
          fileName={file.name}
          originalSize={`${file.size} bytes`}
          targetSize="200x200" // Replace with your target size as needed
        />
      )}
    </div>
  );
}
