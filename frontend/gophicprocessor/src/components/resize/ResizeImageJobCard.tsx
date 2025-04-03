"use client";

import { Box, Card, Inset, Separator, Text, Flex, Select, IconButton, Spinner } from "@radix-ui/themes";
import Image from "next/image";
import React, { useState } from "react";
import { EnterIcon, DownloadIcon } from "@radix-ui/react-icons"; // Adjust imports if needed

type ResizeImageJobCardProps = {
  imageUrl: string;
  fileName: string;
  originalSize: [number, number]; // [width, height]
  targetSize: [number, number];   // [width, height]
  algorithmChosen: string;
  algorithmOptions?: string[];
};

const algorithms = [
  "Nearest Neighbor",
  "Bilinear",
  "Bicubic",
  "Lanczos2",
  "Lanczos3",
];

export default function ResizeImageJobCard({
  imageUrl,
  fileName,
  originalSize,
  targetSize,
  algorithmChosen,
  algorithmOptions = algorithms,
}: ResizeImageJobCardProps) {

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithmChosen);
  // Manage job state: "idle" | "processing" | "processed"
  const [jobStatus, setJobStatus] = useState<"idle" | "processing" | "processed">("idle");

  const handleSendJob = async () => {
    setJobStatus("processing");
    try {
      // Replace this timeout with your actual API call.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setJobStatus("processed");
    } catch (error) {
      console.error("Job submission failed", error);
      setJobStatus("idle");
    }
  };

  return (
    <Box>
      <Card size="2" className="h-full w-full">
        <Inset clip="padding-box" side="top" pb="current">
          <Image
            src={imageUrl}
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
            <Text>{originalSize[0]}x{originalSize[1]}</Text>
          </Box>
          <Box>
            <Text>→</Text>
          </Box>
          <Box className="bg-amber-200 p-1 rounded-lg">
            <Text>{targetSize[0]}x{targetSize[1]}</Text>
          </Box>
        </Flex>

        <Flex mb="2">
          <Select.Root
            size="1"
            value={selectedAlgorithm}
            onValueChange={(value) => setSelectedAlgorithm(value)}
          >
            <Select.Trigger>
              <Text>{selectedAlgorithm}</Text>
            </Select.Trigger>
            <Select.Content>
              {algorithmOptions.map((algorithm) => (
                <Select.Item key={algorithm} value={algorithm}>
                  <Text>{algorithm}</Text>
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
                onClick={handleSendJob}
              >
                <EnterIcon width="15" height="15" />
              </IconButton>
            </Box>
          )}

          {jobStatus === "processing" && (
            <Box className="flex justify-center content-center">
              <Spinner size="3" />
            </Box>
          )}

          {jobStatus === "processed" && (
            <Box>
              <IconButton size="2" variant="soft" color="blue">
                <DownloadIcon width="15" height="15" />
              </IconButton>
            </Box>
          )}

        </Flex>
      </Card>
    </Box>
  );
}
