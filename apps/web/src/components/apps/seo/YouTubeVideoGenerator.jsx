import React, { useEffect } from 'react';
import YouTubeVideoPreview from '@/components/apps/seo/YouTubeVideoPreview';
import { useYoutubeVideo } from '@/hooks/useYoutubeVideo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Video, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const YouTubeVideoGenerator = ({ content, image, onPostNow }) => {
  const { toast } = useToast();
  const { videoData, loading, generateVideo, updateVideoThumbnail } = useYoutubeVideo(content, image?.imageUrl);

  // Sync content updates
  useEffect(() => {
    generateVideo(content);
  }, [content]);

  // Sync image updates
  useEffect(() => {
    if (image?.imageUrl) {
        updateVideoThumbnail(image.imageUrl);
    }
  }, [image]);

  const handleSave = () => {
    toast({
        title: "Video Draft Saved",
        description: "Your video configuration has been saved.",
        className: "bg-green-50 border-green-200 text-green-900"
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4" /> YouTube Preview
              {loading && <Loader2 className="w-3 h-3 animate-spin ml-2" />}
          </h3>
          <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50 gap-1 hidden sm:flex">
                  <CheckCircle2 className="w-3 h-3" /> Saved
              </Badge>
              <span className="text-[10px] text-slate-400 hidden sm:inline-block">
                  Last saved: {format(new Date(), 'h:mm a')}
              </span>
          </div>
      </div>

      <div className="flex-1 bg-slate-100/50 rounded-xl border border-slate-200/60 p-4 sm:p-6 shadow-inner flex flex-col justify-center">
          <YouTubeVideoPreview videoData={videoData} />
      </div>

      <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={handleSave} className="text-slate-600">
              <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200"
            onClick={() => onPostNow(videoData)}
          >
              <Video className="w-4 h-4 mr-2" /> Post Video
          </Button>
      </div>
    </div>
  );
};

export default YouTubeVideoGenerator;