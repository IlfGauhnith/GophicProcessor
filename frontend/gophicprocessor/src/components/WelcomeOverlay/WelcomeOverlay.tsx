"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid"; // or an icon library of your choice
import MarkdownText from "@/components/MarkdownText";

export type WelcomeStep = {
    title: string;
    titleColor: string;
    subtitle?: string;
    text: string;
    textColor: string;
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    bgColor: string;
};

export type WelcomeOverlayProps = {
    steps: WelcomeStep[];
    onClose: () => void;
};

export default function WelcomeOverlay({ steps, onClose }: WelcomeOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            onClose();
        }
    };
    const { title, titleColor, subtitle, text, textColor, imageUrl, bgColor, imageWidth, imageHeight } = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                style={{ backgroundColor: bgColor }}
                id="modal-content"
                className="relative rounded-lg shadow-xl max-w-11/12 w-full sm:max-w-4xl md:max-w-6xl p-8 z-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 rounded-full cursor-pointer transform-gpu transition-transform hover:scale-120"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Text content */}
                    <div className="flex-1 p-4">
                        <h3 className="text-2xl font-bold" style={{ color: titleColor }}>{title}</h3>
                        {subtitle && (<p className="mt-2 text-lg" style={{ color: textColor }}>{subtitle}<br /><br /><br /></p>)}
                        <MarkdownText text={text} className="mt-2 text-lg" style={{ color: textColor }} />
                    </div>
                    {/* Right: Image */}
                    <div className="flex-1 p-4 flex items-center justify-center">
                        <Image
                            priority={true}
                            src={imageUrl}
                            alt={title}
                            width={imageWidth}
                            height={imageHeight}
                            className="object-cover rounded h-auto"
                        />
                    </div>
                </div>

                {/* Navigation Button */}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-2" /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                    >
                        Next <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}
