import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, FileText, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { uploadCVFile } from '@/utils/portfolioStorage';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function CVUploadModal({ open, onOpenChange, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setUploadError(null);

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB. Please choose a smaller file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated || !user?.id) {
      setUploadError('Authentication required. Please log in to upload files.');
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(20);
      setUploadError(null);

      // Upload file with user ID in path
      const uploadResult = await uploadCVFile(selectedFile, user.id);

      if (!uploadResult.success) {
        // Check for specific error types
        const errorMessage = uploadResult.error || "Failed to upload CV. Please try again.";
        
        // Network error
        if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        // Storage bucket error
        if (errorMessage.toLowerCase().includes('bucket')) {
          throw new Error('Storage service temporarily unavailable. Please try again later.');
        }
        
        // Authentication error
        if (errorMessage.toLowerCase().includes('auth') || errorMessage.toLowerCase().includes('401') || errorMessage.toLowerCase().includes('403')) {
          throw new Error('Authentication error. Please log out and log in again.');
        }
        
        throw new Error(errorMessage);
      }

      setUploadProgress(100);

      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });

      setSelectedFile(null);
      onOpenChange(false);
      
      // Call success callback after a short delay to allow toast to show
      setTimeout(() => {
        onUploadSuccess?.();
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || "Failed to upload CV. Please try again.";
      setUploadError(errorMessage);
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRetry = () => {
    setUploadError(null);
    if (selectedFile) {
      handleUpload();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload CV</DialogTitle>
          <DialogDescription>
            Upload your CV in PDF, DOC, or DOCX format (max 5MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Authentication Check */}
          {!isAuthenticated && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please log in to upload files.
              </AlertDescription>
            </Alert>
          )}

          {/* File Upload Input */}
          {isAuthenticated && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cv-upload">Select File</Label>
                <Input
                  id="cv-upload"
                  type="file"
                  accept={ACCEPTED_EXTENSIONS.join(',')}
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="cursor-pointer"
                />
              </div>

              {/* Selected File Display */}
              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  {!uploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col gap-2">
                    <span>{uploadError}</span>
                    {selectedFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="h-8 w-fit mt-2"
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Retry Upload
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || !isAuthenticated}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload CV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}