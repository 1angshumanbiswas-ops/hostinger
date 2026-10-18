import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';

export default function usePortfolioCVManagement() {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const uploadCVFile = async (file) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return { success: false, error: "No file selected" };
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive"
      });
      return { success: false, error: "Invalid file type" };
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return { success: false, error: "File too large" };
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-cvs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-cvs')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('portfolio_cv')
        .insert({
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        // If database insert fails, delete the uploaded file
        await supabase.storage
          .from('portfolio-cvs')
          .remove([filePath]);
        throw dbError;
      }

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully`
      });

      return { success: true, data: dbData };

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  const deleteCVFile = async (cvId, fileUrl) => {
    setDeleting(true);

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const bucketIndex = urlParts.indexOf('portfolio-cvs');
      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('portfolio-cvs')
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('portfolio_cv')
        .delete()
        .eq('id', cvId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "File deleted",
        description: "The file has been deleted successfully"
      });

      return { success: true };

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setDeleting(false);
    }
  };

  const downloadCVFile = async (fileUrl, fileName) => {
    try {
      // Create a temporary link and trigger download
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${fileName}`
      });

      return { success: true };

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const fetchAllCVFiles = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('portfolio_cv')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data: data || [] };

    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Failed to load files",
        description: error.message || "Failed to fetch CV files",
        variant: "destructive"
      });
      return { success: false, error: error.message, data: [] };
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestCV = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('portfolio_cv')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data };

    } catch (error) {
      console.error('Fetch latest CV error:', error);
      return { success: false, error: error.message, data: null };
    } finally {
      setLoading(false);
    }
  };

  return {
    uploading,
    deleting,
    loading,
    uploadCVFile,
    deleteCVFile,
    downloadCVFile,
    fetchAllCVFiles,
    fetchLatestCV
  };
}