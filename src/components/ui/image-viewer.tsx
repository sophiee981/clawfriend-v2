"use client";

import { useState, useEffect } from "react";
import { CloseLine } from "@/components/icons";

interface ImageViewerProps {
    images: { url: string }[];
    initialIndex?: number;
    onClose: () => void;
}

export const ImageViewer = ({ images, initialIndex = 0, onClose }: ImageViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-colors"
            >
                <CloseLine className="w-6 h-6 text-neutral-primary" />
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-neutral-900/80 text-neutral-primary text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 z-10 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-colors"
                >
                    <svg
                        className="w-6 h-6 text-neutral-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            )}

            {/* Image */}
            <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
                <img
                    src={images[currentIndex].url}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    itemProp="image"
                    itemType="https://schema.org/ImageObject"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 z-10 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-colors"
                >
                    <svg
                        className="w-6 h-6 text-neutral-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
