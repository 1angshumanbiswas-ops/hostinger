import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import usePortfolioCVManagement from '@/hooks/usePortfolioCVManagement';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  const mb = kb / 1024;
  
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }
  return `${kb.toFixed(2)} KB`;
};

export default function PortfolioDownloadTab() {
  const [cvFiles, setCvFiles] = useState([]);
  const [error, setError] = useState(null);
  const { loading, downloadCVFile, fetchAllCVFiles } = usePortfolioCVManagement();

  useEffect(() => {
    loadCVFiles();
  }, []);

  const loadCVFiles = async () => {
    setError(null);
    const result = await fetchAllCVFiles();
    if (result.success) {
      setCvFiles(result.data);
    } else {
      setError(result.error);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    await downloadCVFile(fileUrl, fileName);
  };

  const handleRefresh = async () => {
    await loadCVFiles();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 portfolio-skeleton" />
            <Skeleton className="h-4 w-72 mt-2 portfolio-skeleton" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full portfolio-skeleton" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/50 bg-red-50 dark:bg-red-950/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Error Loading Files
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            {error || 'Failed to load CV files. Please check your connection and try again.'}
          </p>
          <Button 
            onClick={loadCVFiles} 
            variant="outline"
            className="font-semibold"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Available CV Files
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
            Download your uploaded CV files anytime you need them
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="ml-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {cvFiles.length === 0 ? (
          <div className="portfolio-empty-state">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-900 dark:text-white font-medium mb-1">
              No CV files available
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Upload files in the Upload tab to access them here
            </p>
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Files uploaded will appear here for easy downloading and sharing
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cvFiles.map((cv) => (
              <div
                key={cv.id}
                className="portfolio-file-list-item bg-white dark:bg-slate-800"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {cv.file_name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {cv.uploaded_at
                          ? format(new Date(cv.uploaded_at), 'MMM dd, yyyy')
                          : 'Unknown date'}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                      <span>{formatFileSize(cv.file_size)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(cv.file_url, cv.file_name)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white ml-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}