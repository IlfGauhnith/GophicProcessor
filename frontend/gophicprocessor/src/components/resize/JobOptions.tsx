"use client";

import { Box, Flex, Tabs, Text, Switch, Separator } from "@radix-ui/themes";
import * as Slider from "@radix-ui/react-slider";
import React, { useState } from "react";


export type JobOptionsProps = {
    pixelWidth: number;
    setPixelWidth: (value: number) => void;
    pixelHeight: number;
    setPixelHeight: (value: number) => void;
    resizePercentage: number;
    setResizePercentage: (value: number) => void;
    keepAspectRatio: boolean;
    onKeepAspectRatioChange: (value: boolean) => void;
    resizeType: "percentage" | "pixel";
    setResizeType: (value: "percentage" | "pixel") => void;
  } & React.PropsWithChildren;

  export default function JobOptions({
    children,
    resizeType,
    setResizeType,
    pixelWidth,
    setPixelWidth,
    pixelHeight,
    setPixelHeight,
    resizePercentage,
    setResizePercentage,
    keepAspectRatio,
    onKeepAspectRatioChange,
  }: JobOptionsProps) {

    const [isEditingPercentage, setIsEditingPercentage] = useState(false);
    
    const clamp = (value: number) => Math.min(99, Math.max(1, value));
    const clampedResizePercentage = clamp(resizePercentage);
  
    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const newValue = clamp(Number(e.target.value));
      setResizePercentage(newValue);
    };
  
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") e.currentTarget.blur();
    };


    return (
        <Flex
            id="job-options"
            className="relative w-1/2 md:w-1/5 h-full flex-col items-start justify-start bg-[#b9a9a5] border-l-1 border-[#757575]"
        >

            {children}
            <Box className="text-center text-3xl text-[#2E0C1F] font-bold pt-4 pb-4 w-full border-b-1 border-[#757575]">
                <h1>Options</h1>
            </Box>

            <Box id="resize-by-options-box" className="w-full pt-10">
                <Tabs.Root 
                    id="resize-by-options-tabs-root" 
                    defaultValue={resizeType} 
                    onValueChange={(value) => setResizeType(value as "percentage" | "pixel")}
                >
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
                                        <Slider.Thumb className="w-3 h-3 bg-[#9C8F8B] rounded-full cursor-pointer flex items-center justify-center">
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
                                            onChange={(e) => setPixelWidth(Number(e.target.value))}
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
                                            onChange={(e) => setPixelHeight(Number(e.target.value))}
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
                                                onCheckedChange={onKeepAspectRatioChange}
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
    );
}
