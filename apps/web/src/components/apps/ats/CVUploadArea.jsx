import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CVUploadArea = ({ onFileSelect, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!validTypes.includes(file.type)) {
      return "Invalid file format. Please upload PDF or DOCX.";
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return "File size exceeds 5MB limit.";
    }
    
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    // Automatically trigger analysis on select
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".pdf,.docx,.doc"
        className="hidden"
      />
      
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ease-in-out bg-[#F5F3F0]",
          isDragging 
            ? "border-[#2D7A4A] bg-[#E8F5E9] scale-[1.02]" 
            : "border-[#E0E0D8] hover:border-[#2D7A4A] hover:shadow-md",
          selectedFile ? "border-solid border-[#2D7A4A]" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!selectedFile ? triggerFileInput : undefined}
      >
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300",
                isDragging ? "bg-[#2D7A4A] text-white" : "bg-[#E8F5E9] text-[#2D7A4A]"
              )}>
                <UploadCloud className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-2">
                  {isDragging ? "Drop your resume here" : "Upload your CV"}
                </h3>
                <p className="text-[#555555] mb-4 max-w-sm mx-auto">
                  Drag and drop your resume or click to browse. Supported formats: PDF, DOCX (Max 5MB)
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-[#2D7A4A] text-[#2D7A4A] hover:bg-[#2D7A4A] hover:text-white transition-all duration-300"
              >
                Select File
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="w-16 h-16 bg-[#2D7A4A] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D7A4A]/20">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#333333] mb-1 truncate max-w-[300px]">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-[#555555]">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <div className="flex gap-3 mt-2">
                 <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect(selectedFile);
                  }}
                  className="bg-[#2D7A4A] hover:bg-[#3E925B] text-white"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Again"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearFile}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "ATS Parsing", icon: CheckCircle2 },
          { label: "Keyword Check", icon: CheckCircle2 },
          { label: "Format Scan", icon: CheckCircle2 },
        ].map((feature, i) => (
          <div key={i} className="flex items-center justify-center gap-2 text-sm text-[#555555] bg-white p-3 rounded-lg border border-[#E0E0D8]">
            <feature.icon className="w-4 h-4 text-[#2D7A4A]" />
            {feature.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVUploadArea;