import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, AlertCircle, ShieldCheck } from 'lucide-react';

const PostConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  platform, 
  content, 
  isAll = false 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" />
            {isAll ? "Post to All Platforms?" : `Post to ${platform?.charAt(0).toUpperCase() + platform?.slice(1)}?`}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to publish this content?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 max-h-[150px] overflow-y-auto mb-4">
            {content || "Standard update content will be used."}
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-400">
             <span>Instant Post</span>
             <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Action</span>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700 text-white">
            Confirm & Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostConfirmationDialog;