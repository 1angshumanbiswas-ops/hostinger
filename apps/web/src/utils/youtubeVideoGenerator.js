export const formatViewCount = (count) => {
  if (!count) return '0 views';
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M views';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K views';
  }
  return count + ' views';
};

export const formatUploadTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return '1 week ago'; // Simplified for demo
};

export const generateVideoTitle = (content) => {
  if (!content) return "New Video Title";
  // Assume first line is title if it's short, otherwise generate generic
  const lines = content.split('\n');
  const firstLine = lines[0].trim();
  if (firstLine.length > 0 && firstLine.length < 100) {
      return firstLine;
  }
  return "Exciting New Job Opportunity! 🚀";
};

export const generateVideoDescription = (content) => {
  if (!content) return "Check out this amazing opportunity!";
  const lines = content.split('\n');
  if (lines.length > 1) {
      return lines.slice(1).join('\n').trim();
  }
  // If only one line (which was used as title), or content is long block
  if (lines[0].length >= 100) return content;
  return content;
};

export const generateVideoMetadata = (data) => {
  // Simulate metadata generation
  return {
    viewCount: Math.floor(Math.random() * 50000) + 1000,
    uploadTime: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
    channelName: "TechCorp Careers",
    channelAvatar: "https://ui-avatars.com/api/?name=TC&background=0D8ABC&color=fff",
    duration: "4:20"
  };
};