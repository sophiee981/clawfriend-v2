"use client";

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
    // Add #t=0.1 to URL to get first frame as thumbnail (if no poster provided)
    const videoUrl = !poster && !url.includes('#t=') ? `${url}#t=0.1` : url;
    
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
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                    poster={poster}
                    itemProp="contentUrl"
                    itemType="https://schema.org/VideoObject"
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};
