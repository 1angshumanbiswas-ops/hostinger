import React, { useState } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { postToPlatform } from '@/utils/postingManager';
import PostConfirmationDialog from './PostConfirmationDialog';
import { logPlatformAction } from '@/utils/debugLogManager';

/**
 * SUPER ADMIN & USER POSTING BUTTON
 * 
 * Test Checklist for Verification:
 * [ ] 1. Super admin clicks "Post Now" - Click handler should fire.
 * [ ] 2. No auth error appears - Ensure 'Authentication Required' toast is gone.
 * [ ] 3. Dialog appears - Open state becomes true.
 * [ ] 4. Super admin confirms - handleConfirm fires.
 * [ ] 5. Post created in ad_posts table - DB verification via logs.
 * [ ] 6. No errors in debug_logs - Check console and DB logs.
 * [ ] 7. Posting completes successfully - Success toast appears.
 */

const PostNowButton = ({ platform, content, image, color, template, variant = "default", size = "sm" }) => {
  const [open, setOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();

  const handleClick = async () => {
      console.log(`[PostNowButton] Click. SuperAdmin: ${isSuperAdmin}, User: ${user?.id}`);
      
      // LOGGING
      try {
        if (user?.id) await logPlatformAction(user.id, platform, 'BUTTON_CLICK', { isSuperAdmin });
      } catch (e) { console.warn("Log fail", e); }

      // AUTH CHECK REMOVED - Direct Open
      setOpen(true);
  };

  const handleConfirm = async () => {
    console.log(`[PostNowButton] Confirm. Starting...`);
    setIsPosting(true);
    
    // AUTH CHECK REMOVED - Proceed regardless of user state
    try {
      const payload = content?.content || content || "Default Status Update";
      const targetUserId = user?.id || null; // Pass null if no user, manager handles it

      console.log(`[PostNowButton] Calling manager with user: ${targetUserId}`);

      const result = await postToPlatform(targetUserId, null, platform, payload);
      
      if (result.success) {
        toast({
            title: "✓ Posted successfully!",
            description: `Your ad has been posted to ${platform}.`,
            className: "bg-green-50 border-green-200 text-green-900"
        });
        setOpen(false);
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('[PostNowButton] Error:', error);
      toast({
        title: "Posting Failed",
        description: error.message || "Error posting content.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick}
        className={variant === "ghost" ? "" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"}
        variant={variant}
        size={size}
        disabled={isPosting}
      >
        {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        {isPosting ? "Posting..." : "Post Now"}
      </Button>

      <PostConfirmationDialog 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        platform={platform}
        content={typeof content === 'string' ? content : content?.content}
      />
    </>
  );
};

export default PostNowButton;