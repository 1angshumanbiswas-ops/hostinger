import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { downloadCVFile } from '@/utils/portfolioStorage';

export default function CVDownloadButton({ cvData }) {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!cvData) {
      toast({
        title: "No CV Found",
        description: "Please upload a CV first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setDownloading(true);

      const result = await downloadCVFile(cvData.file_path);

      if (!result.success) {
        // Check if error is related to missing bucket
        if (result.error?.includes('Storage bucket not available')) {
          throw new Error('Unable to download CV. Storage is not available.');
        }
        throw new Error(result.error);
      }

      // Create download link
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = cvData.file_name || 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Successful",
        description: `${cvData.file_name} has been downloaded.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading || !cvData}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download CV
        </>
      )}
    </Button>
  );
}