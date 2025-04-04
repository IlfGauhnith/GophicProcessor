"use client";

import { Box, Card, Inset, Separator, Text, Flex, Select, IconButton, Spinner } from "@radix-ui/themes";
import Image from "next/image";
import React, { useState } from "react";
import { EnterIcon, DownloadIcon } from "@radix-ui/react-icons";
import { sendJob, pollJobStatus, getJobResult } from "../../service/resizeService";

export type ResizeImageJobCardProps = {
  cardKey: number;
  previewUrl: string;
  file: File;
  fileName: string;
  originalPixelWidth: number;
  originalPixelHeight: number;
  targetPixelWidth: number;
  setTargetPixelWidth: (value: number) => void;
  targetPixelHeight: number;
  setTargetPixelHeight: (value: number) => void;
  onCardClick: (options: {
    lastJobKey: number;
    resizePercentage: number;
    pixelWidth: number;
    pixelHeight: number;
    resizeType: "percentage" | "pixel";
    keepAspectRatio: boolean;
  }) => void;
};

const algorithms = [
  ["Nearest Neighbor", "nearest"],
  ["Bilinear", "bilinear"],
  ["Bicubic", "bicubic"],
  ["Lanczos2", "lanczos2"],
  ["Lanczos3", "lanczos3"],
];

export default function ResizeImageJobCard({
  cardKey,
  previewUrl,
  file,
  fileName,
  originalPixelWidth,
  originalPixelHeight,
  targetPixelWidth,
  setTargetPixelWidth,
  targetPixelHeight,
  setTargetPixelHeight,
  onCardClick,
}: ResizeImageJobCardProps) {

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);
  const [algorithmOptions] = useState(algorithms);
  const [jobStatus, setJobStatus] = useState<"idle" | "processing" | "processed">("idle");
  const [jobAPIuuid, setJobAPIuuid] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCardClick({
      lastJobKey: cardKey,
      resizePercentage: 50,
      pixelWidth: targetPixelWidth,
      pixelHeight: targetPixelHeight,
      resizeType: "percentage",
      keepAspectRatio: true,
    });
  };

  const handleSendJob = async () => {
    
    function stripDataUriPrefix(dataUri: string): string {
      const commaIndex = dataUri.indexOf(',');
      return commaIndex !== -1 ? dataUri.substring(commaIndex + 1) : dataUri;
    }
    
    setJobStatus("processing");

    try {

      let imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      imageBase64 = stripDataUriPrefix(imageBase64);
      
      const algorithm = selectedAlgorithm[1];
      const targetWidth = targetPixelWidth;
      const targetHeight = targetPixelHeight;

      // Send the job to the backend. This function should return a response that includes a job_id.
      const result = await sendJob(imageBase64, algorithm, targetWidth, targetHeight);
      const jobId = result.job_id;


      const uuidFetched = await pollJobStatus(jobId);
      setJobAPIuuid(uuidFetched);

      // Once the job is complete, update the state.
      setJobStatus("processed");
    } catch (error) {
      console.error("Job submission failed", error);
      setJobStatus("idle");
    }
  };
  
  const handleDownloadJob = async () => {
    try {
      if (!jobAPIuuid) {
        throw new Error("No job API uuid available");
      }
      // Call the service function that gets the job result.
      const result = await getJobResult(jobAPIuuid);
      const images = result.images;
      if (images && images.length > 0) {
        const downloadUrl = images[0]; // Get the first image URL
        
        // Fetch the file as a Blob
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch the image for download");
        }
        const blob = await response.blob();
        
        // Create an object URL from the Blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a temporary anchor element and trigger a download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${cardKey}-${fileName}`; // Replace cardKey and fileName appropriately
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Revoke the object URL after a short delay to release memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } else {
        throw new Error("No images found in the job result");
      }
    } catch (error) {
      console.error("Download job failed", error);
    }
  };


  return (
    // Wrap the entire card in a clickable container.
    <Box onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Card size="2" className="h-full w-full">
        <Inset clip="padding-box" side="top" pb="current">
          <Image
            src={previewUrl}
            alt="Uploaded image preview"
            width={100}
            height={50}
            className="block object-cover bg-[var(--gray-5)] w-full h-25"
          />
        </Inset>

        <Flex className="max-w-3/4">
          <Text truncate>{fileName}</Text>
        </Flex>
        <Separator size="4" />

        <Flex align="center" justify="center" gap="2" p="2" m={{ initial: "1", md: "2" }}>
          <Box className="bg-amber-100 p-1 rounded-lg">
            <Text>
              {originalPixelWidth}x{originalPixelHeight}
            </Text>
          </Box>
          <Box>
            <Text>→</Text>
          </Box>
          <Box className="bg-amber-200 p-1 rounded-lg">
            <Text>
              {targetPixelWidth}x{targetPixelHeight}
            </Text>
          </Box>
        </Flex>

        <Flex mb="2">
          <Select.Root
            size="1"
            value={selectedAlgorithm[0]}
            onValueChange={(value) => {
              const selected = algorithmOptions.find((option) => option[0] === value);
              if (selected)
                setSelectedAlgorithm(selected);
            }}
          >
            <Select.Trigger>
              <Text>{selectedAlgorithm}</Text>
            </Select.Trigger>
            <Select.Content>
              {algorithmOptions.map((algorithm) => (
                <Select.Item key={algorithm[0]} value={algorithm[0]}>
                  <Text>{algorithm[0]}</Text>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Separator size="4" />
        <Flex justify="end" p="2">

          {jobStatus === "idle" && (
            <Box>
              <IconButton
                size="2"
                variant="soft"
                className="cursor-pointer"
                color="green"
                onClick={(e) => {
                  e.stopPropagation(); // prevent card's onClick from firing
                  handleSendJob();
                }}
              >
                <EnterIcon width="15" height="15" />
              </IconButton>
            </Box>
          )}

          {jobStatus === "processing" && (
            <Box className="flex justify-center items-center" style={{ width: 40, height: 40 }}>
              <Spinner size="3" />
            </Box>
          )}

          {jobStatus === "processed" && (
            <Box>
              <IconButton
                size="2"
                variant="soft"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation(); // prevent card's onClick from firing
                  handleDownloadJob();
                }}
              >
                <DownloadIcon width="15" height="15" />
              </IconButton>
            </Box>
          )}
        </Flex>
      </Card>
    </Box >
  );
}
