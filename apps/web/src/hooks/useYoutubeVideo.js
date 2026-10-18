import { useState, useEffect } from 'react';
import { 
  generateVideoTitle, 
  generateVideoDescription, 
  generateVideoMetadata 
} from '@/utils/youtubeVideoGenerator';

export const useYoutubeVideo = (initialContent = "", initialImage = "") => {
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    thumbnail: initialImage,
    metadata: {
        viewCount: 0,
        uploadTime: null,
        channelName: "",
        channelAvatar: "",
        duration: "0:00"
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate initial metadata on mount
    const meta = generateVideoMetadata();
    setVideoData(prev => ({ ...prev, metadata: meta }));
  }, []);

  const generateVideo = (content) => {
    setLoading(true);
    // Simulate processing time
    setTimeout(() => {
        const title = generateVideoTitle(content);
        const description = generateVideoDescription(content);
        
        setVideoData(prev => ({
            ...prev,
            title,
            description
        }));
        setLoading(false);
    }, 300);
  };

  const updateVideoTitle = (newTitle) => {
    setVideoData(prev => ({ ...prev, title: newTitle }));
  };

  const updateVideoDescription = (newDesc) => {
    setVideoData(prev => ({ ...prev, description: newDesc }));
  };

  const updateVideoThumbnail = (imageUrl) => {
    setVideoData(prev => ({ ...prev, thumbnail: imageUrl }));
  };

  return {
    videoData,
    loading,
    generateVideo,
    updateVideoTitle,
    updateVideoDescription,
    updateVideoThumbnail
  };
};