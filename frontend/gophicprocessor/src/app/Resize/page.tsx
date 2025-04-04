"use client";

import Header from "@/components/Header";
import { Box, Flex, Grid, Tabs, Text, Switch, Separator, IconButton } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import ResizeImageJobCard from "@/components/resize/ResizeImageJobCard";
import styles from "../../styles/Resize.module.css"
import { PlusIcon } from "@radix-ui/react-icons";
import JobOptions from "@/components/resize/JobOptions";

// Type for uploaded images.
type UploadedImage = {
    file: File;
    previewUrl: string;
    width: number;
    height: number;
};

export default function Resize() {
    // Global job options state.
    const [jobOptions, setJobOptions] = useState({
        lastJobKey: 0,
        resizeType: "percentage" as "percentage" | "pixel",
        resizePercentage: 50,
        pixelWidth: 640,
        pixelHeight: 480,
        keepAspectRatio: true,
    });

    // When updating width:
    const updatePixelWidth = (newWidth: number) => {
        setJobOptions((prev) => {
          const jobOptionsPrev = prev;

          let newHeight = jobOptionsPrev.pixelHeight;
          if (jobOptionsPrev.keepAspectRatio && jobOptionsPrev.pixelWidth) {
            const ratio = jobOptionsPrev.pixelHeight / jobOptionsPrev.pixelWidth;
            newHeight = Math.round(newWidth * ratio);
          }
      
          setPixelWidthMapping((prevMapping) => {
            const newMap = new Map(prevMapping);
            newMap.set(jobOptionsPrev.lastJobKey, newWidth);
            return newMap;
          });

          setPixelHeightMapping((prevMapping) => {
            const newMap = new Map(prevMapping);
            newMap.set(jobOptionsPrev.lastJobKey, newHeight);
            return newMap;
          });
      
          return { ...jobOptionsPrev, pixelWidth: newWidth, pixelHeight: newHeight };
        });
      };

    // When updating height:
    const updatePixelHeight = (newHeight: number) => {
        setJobOptions((prev) => {
            const jobOptionsPrev = prev;
  
            let newWidth = jobOptionsPrev.pixelWidth;
            if (jobOptionsPrev.keepAspectRatio && jobOptionsPrev.pixelHeight) {
              const ratio = jobOptionsPrev.pixelWidth / jobOptionsPrev.pixelHeight;
              newWidth = Math.round(newHeight * ratio);
            }
        
            setPixelWidthMapping((prevMapping) => {
              const newMap = new Map(prevMapping);
              newMap.set(jobOptionsPrev.lastJobKey, newWidth);
              return newMap;
            });
  
            setPixelHeightMapping((prevMapping) => {
              const newMap = new Map(prevMapping);
              newMap.set(jobOptionsPrev.lastJobKey, newHeight);
              return newMap;
            });
        
            return { ...jobOptionsPrev, pixelWidth: newWidth, pixelHeight: newHeight };
          });
    };

    // states
    const [currentOptionsResizePercentage, setCurrentOptionsResizePercentage] = useState(50);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    const [pixelWidthMapping, setPixelWidthMapping] = useState(new Map<number, number>());
    const [pixelHeightMapping, setPixelHeightMapping] = useState(new Map<number, number>());
    const [resizePercentageMapping, setResizePercentageMapping] = useState(new Map<number, number>());
    const [resizeTypeMapping, setResizeTypeMapping] = useState(new Map<number, string>());
    const [keepAspectRatioMapping, setKeepAspectRatioMapping] = useState(new Map<number, boolean>());

    const clamp = (value: number) => Math.min(99, Math.max(1, value));
    const clampedResizePercentage = clamp(currentOptionsResizePercentage);

    const handleCardClick = (options: {
        lastJobKey: number;
        resizePercentage: number;
        pixelWidth: number;
        pixelHeight: number;
        resizeType: "percentage" | "pixel";
        keepAspectRatio: boolean;
    }) => {
        setJobOptions(options);
    };

    // Reference for the hidden file input.
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: UploadedImage[] = await Promise.all(
                Array.from(files).map((file) => {
                    const previewUrl = URL.createObjectURL(file);
                    return new Promise<UploadedImage>((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            resolve({
                                file,
                                previewUrl,
                                width: img.naturalWidth,
                                height: img.naturalHeight,
                            });
                        };
                        img.onerror = () => {
                            // Fallback values if the image fails to load.
                            resolve({
                                file,
                                previewUrl,
                                width: 0,
                                height: 0,
                            });
                        };
                        img.src = previewUrl;
                    });
                })
            );
            setUploadedImages((prev) => [...prev, ...newImages]);
        }
    };

    // When the upload button is clicked, trigger the hidden file input.
    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <main className="h-screen flex flex-col bg-cover bg-center bg-[#9C8F8B]">
            <Header />
            <Flex id="main-flex" className="tw-center flex-1 w-full">
                {/* Left grid */}
                <Grid
                    id="job-cards-grid"
                    gap="4"
                    p="4"
                    columns="1"
                    rows="1"
                    className={`
                    w-1/2 
                    md:w-4/5
                    ${styles.mdGridOverride} /* override grid layout for md and larger devices */
                    h-full
                    `}
                >
                    {uploadedImages.length === 0 ? (
                        <Text>No images uploaded</Text>
                    ) : (
                        uploadedImages.map((img, index) => (
                            <ResizeImageJobCard
                                key={index}
                                cardKey={index}
                                previewUrl={img.previewUrl}
                                fileName={img.file.name}
                                originalPixelWidth={img.width}
                                originalPixelHeight={img.height}

                                targetPixelWidth={pixelWidthMapping.get(index) ?? img.width}
                                setTargetPixelWidth={
                                    (value) => setJobOptions((prev) => {
                                        setPixelWidthMapping((prev) => {
                                            const newMap = new Map(prev);
                                            newMap.set(index, value);
                                            return newMap;
                                        });
                                        return { ...prev, pixelWidth: value }
                                    })
                                }

                                targetPixelHeight={pixelHeightMapping.get(index) ?? img.height}
                                setTargetPixelHeight={
                                    (value) => setJobOptions((prev) => {
                                        setPixelHeightMapping((prev) => {
                                            const newMap = new Map(prev);
                                            newMap.set(index, value);
                                            return newMap;
                                        });
                                        return { ...prev, pixelHeight: value }
                                    })
                                }

                                algorithmChosen={"Bilinear"}
                                onCardClick={handleCardClick}
                            />
                        ))
                    )}
                </Grid>


                {/* Right flex */}
                <JobOptions
                    pixelWidth={jobOptions.pixelWidth}
                    setPixelWidth={(value) =>
                        updatePixelWidth(value)
                    }
                    pixelHeight={jobOptions.pixelHeight}
                    setPixelHeight={(value) =>
                        updatePixelHeight(value)
                    }
                    resizePercentage={jobOptions.resizePercentage}
                    setResizePercentage={(value) =>
                        setJobOptions((prev) => ({ ...prev, resizePercentage: value }))
                    }
                    keepAspectRatio={jobOptions.keepAspectRatio}
                    onKeepAspectRatioChange={(value) =>
                        setJobOptions((prev) => ({ ...prev, keepAspectRatio: value }))
                    }
                    resizeType={jobOptions.resizeType}
                    setResizeType={(value) => setJobOptions((prev) => ({ ...prev, resizeType: value }))}
                >
                    <IconButton
                        id="upload-image-button"
                        variant="solid"
                        color="amber"
                        radius="full"
                        size="3"
                        /* necessary inline styling to override radix ui styles */
                        style={{ position: "absolute", transform: "translate(-60px, 30px)", cursor: "pointer" }}
                        onClick={handleUploadButtonClick}
                    >
                        <PlusIcon width="25" height="25" color="black"></PlusIcon>
                    </IconButton>
                </JobOptions>
            </Flex>
            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFiles}
            />
        </main>
    );
}
