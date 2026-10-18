export const PLATFORM_THEMES = {
  facebook: {
    name: "Office Collaboration",
    searchTerms: ["office collaboration", "diverse team meeting", "modern workspace", "corporate training", "team success"],
    description: "Engaging visuals of teams working together in modern office environments.",
    sourcePreference: ["Unsplash", "Pexels"],
    fallbackImages: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
    ]
  },
  instagram: {
    name: "Lifestyle & Career",
    searchTerms: ["creative workspace", "remote work lifestyle", "laptop coffee", "stylish office", "career goals"],
    description: "Aesthetic, high-quality images focusing on lifestyle, creativity, and modern work culture.",
    sourcePreference: ["Unsplash", "Pixabay"],
    fallbackImages: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80"
    ]
  },
  whatsapp: {
    name: "Job & Recruitment",
    searchTerms: ["we are hiring", "job interview", "hiring concept", "resume", "business handshake"],
    description: "Direct and clear imagery related to hiring, interviews, and professional connections.",
    sourcePreference: ["Pexels", "Pixabay"],
    fallbackImages: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
    ]
  },
  linkedin: {
    name: "Corporate Professional",
    searchTerms: ["professional headshot", "corporate building", "business strategy", "leadership", "conference room"],
    description: "Polished, professional visuals suitable for a corporate network.",
    sourcePreference: ["Unsplash", "Pexels"],
    fallbackImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
    ]
  }
};

export const getThemeForPlatform = (platform) => {
  const key = platform?.toLowerCase();
  return PLATFORM_THEMES[key] || PLATFORM_THEMES.linkedin; // Default to LinkedIn theme
};

export const getDateBasedSeed = (platform) => {
  const date = new Date().toISOString().split('T')[0];
  return `${platform}-${date}`;
};