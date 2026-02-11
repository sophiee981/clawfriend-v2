"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
    url: string;
    className?: string;
    poster?: string; // URL of thumbnail image
}

// Check if URL is YouTube
const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
};

// Convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export const VideoPlayer = ({ url, className = "", poster }: VideoPlayerProps) => {
    const [autoThumbnail, setAutoThumbnail] = useState<string | undefined>(poster);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Only generate thumbnail if no poster provided and not YouTube
        if (!poster && !isYouTubeUrl(url)) {
            const video = document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.src = url;
            video.currentTime = 0.5; // Get frame at 0.5 second

            const handleLoadedData = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    
                    if (ctx && video.videoWidth > 0) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                        setAutoThumbnail(thumbnail);
                    }
                } catch (error) {
                    console.error('Failed to generate thumbnail:', error);
                } finally {
                    video.remove();
                }
            };

            video.addEventListener('loadeddata', handleLoadedData);
            video.load();

            return () => {
                video.removeEventListener('loadeddata', handleLoadedData);
                video.remove();
            };
        }
    }, [url, poster]);

    return (
        <div className={`rounded-lg overflow-hidden bg-black aspect-video ${className}`}>
            {isYouTubeUrl(url) ? (
                <iframe
                    src={getYouTubeEmbedUrl(url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <video
                    ref={videoRef}
                    src={url}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                    poster={autoThumbnail}
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};
