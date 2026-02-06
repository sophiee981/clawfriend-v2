"use client";

interface VideoPlayerProps {
    url: string;
    className?: string;
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

export const VideoPlayer = ({ url, className = "" }: VideoPlayerProps) => {
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
                    src={url}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};
