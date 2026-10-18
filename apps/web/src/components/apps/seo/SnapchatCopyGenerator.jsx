import React, { useState, useEffect } from 'react';
import AdCopyGenerator from '@/components/apps/seo/AdCopyGenerator';
import SnapchatMobilePreview from '@/components/apps/seo/SnapchatMobilePreview';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileImage as ImageIcon, RefreshCw, X } from 'lucide-react';
import { useSnapchatImage } from '@/hooks/useSnapchatImage';

const SnapchatCopyGenerator = ({ platform, currentCopy, onCopyUpdate, ...props }) => {
  const { image, setImage, loading: imgLoading } = useSnapchatImage(props.currentImage?.imageUrl);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Sync props image if it changes externally
  useEffect(() => {
    if (props.currentImage?.imageUrl && props.currentImage.imageUrl !== image.imageUrl) {
        setImage(props.currentImage.imageUrl);
    }
  }, [props.currentImage, setImage]);

  const handleImageSubmit = (e) => {
      e.preventDefault();
      if (tempImageUrl) {
          setImage(tempImageUrl);
          setShowUrlInput(false);
          // Propagate up if needed, though local preview uses hook state
          if (props.refreshImage) {
             // We can use the refreshImage callback to conceptually "update" the parent state 
             // even though it's technically a refresh trigger. 
             // Ideally we'd have onImageUpdate prop. 
          }
      }
  };

  const copyContent = typeof currentCopy === 'string' ? currentCopy : currentCopy?.content;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
        {/* Editor Side */}
        <div className="flex flex-col gap-6 h-full">
            <AdCopyGenerator 
                platform="snapchat" 
                currentCopy={currentCopy}
                onCopyUpdate={onCopyUpdate}
                {...props}
            />
            
            {/* Image Manager Section */}
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-slate-700">Snapchat Creative Asset</Label>
                        {!showUrlInput && (
                            <Button variant="outline" size="sm" onClick={() => setShowUrlInput(true)}>
                                <ImageIcon className="w-4 h-4 mr-2" /> Change Image
                            </Button>
                        )}
                    </div>

                    {showUrlInput && (
                        <form onSubmit={handleImageSubmit} className="flex gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                            <Input 
                                placeholder="Paste image URL here..." 
                                value={tempImageUrl}
                                onChange={(e) => setTempImageUrl(e.target.value)}
                                className="text-sm"
                            />
                            <Button type="submit" size="sm">Set</Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => setShowUrlInput(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </form>
                    )}

                    <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-32 flex items-center justify-center">
                        {image.imageUrl ? (
                            <img src={image.imageUrl} alt="Ad Creative" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-slate-400 flex flex-col items-center">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-xs">No image selected</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">
                        Recommended: 1080x1920px (9:16)
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Preview Side */}
        <div className="h-full min-h-[700px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                Snapchat Preview
                {imgLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
            </h3>
            
            <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-8 flex items-center justify-center">
                <div className="scale-[0.85] sm:scale-90 md:scale-100 transition-transform origin-center">
                    <SnapchatMobilePreview 
                        image={image} 
                        content={copyContent} 
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default SnapchatCopyGenerator;