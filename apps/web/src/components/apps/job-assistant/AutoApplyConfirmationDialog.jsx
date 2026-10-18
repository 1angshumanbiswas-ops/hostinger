import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const AutoApplyConfirmationDialog = ({ 
  isOpen, 
  jobTitle, 
  jobDescription, 
  atsScore, 
  onConfirm, 
  onCancel, 
  isLoading 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Auto Apply</DialogTitle>
          <DialogDescription>
            Are you sure you want to auto apply to this job using your uploaded CV?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-[#323130] mb-1">Target Role</h4>
            <p className="text-sm text-[#605E5C] font-medium">{jobTitle || "Not specified"}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-[#323130] mb-1">Job Description Snippet</h4>
            <div className="text-sm text-[#605E5C] mt-1 max-h-32 overflow-y-auto bg-[#F3F2F1] p-3 rounded border border-[#EDEBE9]">
              {jobDescription ? (
                jobDescription.length > 200 
                  ? jobDescription.substring(0, 200) + "..." 
                  : jobDescription
              ) : "No description available"}
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-primary/10 p-4 rounded-lg border border-primary/20">
            <span className="font-semibold text-sm text-primary">Current ATS Score Match</span>
            <Badge 
              variant={atsScore >= 61 ? "default" : "secondary"} 
              className={`text-sm px-3 py-1 ${
                atsScore >= 86 ? 'bg-[hsl(var(--primary))] text-primary-foreground' : 
                atsScore >= 61 ? 'bg-blue-100 text-blue-800' : 
                atsScore >= 31 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}
            >
              {atsScore}% Match
            </Badge>
          </div>
        </div>
        
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Applying..." : "Confirm Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoApplyConfirmationDialog;