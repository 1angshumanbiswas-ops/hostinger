import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, FileText, Loader2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
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

export default function PortfolioUploadTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cvFiles, setCvFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploading, deleting, uploadCVFile, deleteCVFile, fetchAllCVFiles } = usePortfolioCVManagement();

  useEffect(() => {
    loadCVFiles();
  }, []);

  const loadCVFiles = async () => {
    const result = await fetchAllCVFiles();
    if (result.success) {
      setCvFiles(result.data);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadCVFile(selectedFile);
    if (result.success) {
      setSelectedFile(null);
      setUploadSuccess(true);
      
      // Reset file input
      const fileInput = document.getElementById('cv-file-input');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Reload files list
      await loadCVFiles();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
    }
  };

  const handleDelete = async (cvId, fileUrl) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

    const result = await deleteCVFile(cvId, fileUrl);
    if (result.success) {
      // Reload files list
      await loadCVFiles();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Upload New CV
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Upload your CV in PDF, DOC, or DOCX format (maximum file size: 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadSuccess && (
            <div className="portfolio-success-message flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Your CV has been uploaded successfully!
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                id="cv-file-input"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="portfolio-input cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/20 dark:file:text-purple-400"
                disabled={uploading}
              />
            </div>
            
            {selectedFile && (
              <div className="portfolio-file-list-item bg-white dark:bg-slate-800 shadow-sm">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                      Ready to upload
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload CV File
                </>
              )}
            </Button>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Tip:</span> Ensure your CV is up-to-date and formatted professionally before uploading.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Your Uploaded CVs</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Manage and organize your uploaded CV files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cvFiles.length === 0 ? (
            <div className="portfolio-empty-state">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-900 dark:text-white font-medium mb-1">
                No files uploaded yet
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload your first CV to get started
              </p>
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
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cv.id, cv.file_url)}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 ml-2"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}