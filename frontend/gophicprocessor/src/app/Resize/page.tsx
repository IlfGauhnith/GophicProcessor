"use client";

import Header from "@/components/Header";
import { Box, Flex, Grid, Tabs, Text, Switch, Separator, IconButton } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import ResizeImageJobCard from "@/components/resize/ResizeImageJobCard";
import styles from "../../styles/Resize.module.css"
import { PlusIcon } from "@radix-ui/react-icons";

// Type for uploaded images.
type UploadedImage = {
    file: File;
    previewUrl: string;
    width: number;
    height: number;
};

export default function Resize() {

    // states
    const [resizePercentage, setResizePercentage] = useState(50);
    const [isEditingPercentage, setIsEditingPercentage] = useState(false);
    const [pixelWidth, setPixelWidth] = useState(640);
    const [pixelHeight, setPixelHeight] = useState(480);
    const [keepAspectRatio, setKeepAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(pixelWidth / pixelHeight);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    const clamp = (value: number) => Math.min(99, Math.max(1, value));
    const clampedResizePercentage = clamp(resizePercentage);

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

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = clamp(Number(e.target.value));
        setResizePercentage(newValue);
        setIsEditingPercentage(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        }
    };

    // When width changes, update height if aspect ratio is locked.
    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setPixelWidth(newWidth);
        if (keepAspectRatio && aspectRatio) {
            const newHeight = Math.round(newWidth / aspectRatio);
            setPixelHeight(newHeight);
        }
    };

    // When height changes, update width if aspect ratio is locked.
    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = Number(e.target.value);
        setPixelHeight(newHeight);
        if (keepAspectRatio && aspectRatio) {
            const newWidth = Math.round(newHeight * aspectRatio);
            setPixelWidth(newWidth);
        }
    };

    // When toggling the aspect ratio switch:
    const handleAspectRatioSwitch = (checked: boolean) => {
        setKeepAspectRatio(checked);
        if (checked && pixelHeight > 0) {
            // Update aspect ratio based on current dimensions.
            setAspectRatio(pixelWidth / pixelHeight);
        }
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
                                imageUrl={img.previewUrl}
                                fileName={img.file.name}
                                originalSize={[img.width, img.height]} // You can update these values as needed.
                                targetSize={[img.width, img.height]}
                                algorithmChosen={"Bilinear"}
                            />
                        ))
                    )}
                </Grid>


                {/* Right flex */}
                <Flex
                    id="job-options"
                    className="relative w-1/2 md:w-1/5 h-full flex-col items-start justify-start bg-[#b9a9a5] border-l-1 border-[#757575]"
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

                    <Box className="text-center text-3xl text-[#2E0C1F] font-bold pt-4 pb-4 w-full border-b-1 border-[#757575]">
                        <h1>Options</h1>
                    </Box>

                    <Box id="resize-by-options-box" className="w-full pt-10">
                        <Tabs.Root id="resize-by-options-tabs-root" defaultValue="percentage">
                            <Tabs.List id="resize-by-options-tabs-list" color="gray" className="flex w-full">
                                <Tabs.Trigger
                                    id="resize-by-options-tabs-trigger-percentage"
                                    value="percentage"
                                    style={{ flex: "1 1 0%" }}
                                    className="text-center"
                                >
                                    <Text className="text-lg">By Percentage</Text>
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    id="resize-by-options-tabs-trigger-pixel"
                                    value="pixel"
                                    style={{ flex: "1 1 0%" }}
                                    className="text-center"
                                >
                                    <Text className="text-lg">By Pixel</Text>
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Box>
                                <Tabs.Content value="percentage">
                                    <Flex id="percentage-bar-flex" className="w-full justify-center items-center pl-8 pr-8 flex-col mt-10">
                                        <Box className="mb-2 p-2">
                                            {isEditingPercentage ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="99"
                                                    value={resizePercentage}
                                                    onChange={(e) => setResizePercentage(Number(e.target.value))}
                                                    onBlur={handleInputBlur}
                                                    onKeyDown={handleInputKeyDown}
                                                    className="text-center text-xl font-medium bg-transparent border-0 outline-0 rounded p-1"
                                                    autoFocus
                                                />
                                            ) : (
                                                <Text
                                                    id="percentage-text-indicator"
                                                    className="text-center text-xl font-medium cursor-pointer"
                                                    onClick={() => setIsEditingPercentage(true)}
                                                >
                                                    {clampedResizePercentage}%
                                                </Text>
                                            )}
                                        </Box>
                                        <Box className="w-full">
                                            <Slider.Root
                                                className="relative flex items-center w-full h-6"
                                                value={[resizePercentage]}
                                                min={1}
                                                max={99}
                                                step={1}
                                                onValueChange={(value) => setResizePercentage(value[0])}
                                            >
                                                <Slider.Track className="bg-gray-300 relative grow rounded h-2">
                                                    <Slider.Range className="absolute bg-amber-400 rounded h-full" />
                                                </Slider.Track>
                                                <Slider.Thumb className="block w-3 h-3 bg-[#9C8F8B] rounded-full cursor-pointer flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M12 2L8 8h8L12 2z" />
                                                    </svg>
                                                </Slider.Thumb>
                                            </Slider.Root>
                                        </Box>
                                    </Flex>
                                </Tabs.Content>

                                <Tabs.Content value="pixel">
                                    <Flex id="resize-pixel-flex" className="w-full justify-center items-center pl-8 pr-8 flex-col mt-10">
                                        <Flex id="pixel-width-flex" className="w-full items-center justify-between">
                                            {/* Left column: "Width" */}
                                            <Box className="w-1/3">
                                                <Text className="text-lg font-medium">Width</Text>
                                            </Box>
                                            {/* Center column: Input and (px) group */}
                                            <Box className="w-1/3 flex items-center justify-center space-x-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={pixelWidth}
                                                    onChange={handleWidthChange}
                                                    className="text-center text-xl font-medium bg-transparent border border-gray-500 rounded p-1 w-20"
                                                />
                                                <Text>(px)</Text>
                                            </Box>
                                            {/* Right column: empty */}
                                            <Box className="w-1/3"></Box>
                                        </Flex>
                                        <Flex id="pixel-height-flex" className="w-full items-center justify-between mt-5">
                                            <Box className="w-1/3">
                                                <Text className="text-lg font-medium">Height</Text>
                                            </Box>
                                            <Box className="w-1/3 flex items-center justify-center space-x-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={pixelHeight}
                                                    onChange={handleHeightChange}
                                                    className="text-center text-xl font-medium bg-transparent border border-gray-500 rounded p-1 w-20"
                                                />
                                                <Text>(px)</Text>
                                            </Box>
                                            <Box className="w-1/3"></Box>
                                        </Flex>
                                        <Separator size="4" className="w-full mt-5" />
                                        <Flex id="aspect-ratio-radio-flex" className="mt-8 justify-start w-full">
                                            <Text as="label" size="3">
                                                <Flex gap="4" align="center">
                                                    <Switch
                                                        id="aspect-ratio-switch"
                                                        checked={keepAspectRatio}
                                                        onCheckedChange={handleAspectRatioSwitch}
                                                        variant="soft"
                                                        color="amber"
                                                    />
                                                    Keep aspect ratio
                                                </Flex>
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Tabs.Content>
                            </Box>
                        </Tabs.Root>
                    </Box>
                </Flex>
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
