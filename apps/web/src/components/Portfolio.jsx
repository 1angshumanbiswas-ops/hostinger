import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, XCircle, Loader2, User, Mail, Phone, MapPin, Linkedin, Briefcase, Download, GraduationCap, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { PORTFOLIO_PROFILE } from '@/lib/profileData';

const Portfolio = () => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  
  // State for the active resume (either from DB or just uploaded)
  const [resumeData, setResumeData] = useState(null);
  
  // UI States
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching resume:', error);
      } else if (data) {
        setResumeData(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    if (!(file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('officedocument'))) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
      });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `Resume_${PORTFOLIO_PROFILE.name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);

      const newResume = {
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        public_url: publicUrl
      };

      const { data: dbData, error: dbError } = await supabase
        .from('resumes')
        .insert([newResume])
        .select()
        .single();

      if (dbError) throw dbError;

      setResumeData(dbData);
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been saved to your portfolio.",
      });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error saving your resume. Please try again.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!resumeData) return;
    try {
      setIsLoading(true);
      const { error: dbError } = await supabase.from('resumes').delete().eq('id', resumeData.id);
      if (dbError) throw dbError;
      if (resumeData.file_path) {
        await supabase.storage.from('portfolio').remove([resumeData.file_path]);
      }
      setResumeData(null);
      toast({ title: "Resume removed", description: "Your resume has been removed from your portfolio." });
    } catch (error) {
      console.error('Remove failed:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to remove resume." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleDownload = () => {
    if (resumeData?.public_url) {
        const link = document.createElement('a');
        link.href = resumeData.public_url;
        link.target = '_blank';
        link.download = resumeData.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  if (isLoading && !resumeData && !isUploading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-3 text-slate-600">Loading portfolio data...</span>
      </div>
    );
  }

  // Helper to check if file is PDF (for viewing)
  const isPdf = resumeData?.file_type === 'application/pdf' || resumeData?.file_name?.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      {/* 1. Header & Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-8 relative">
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left z-10 w-full md:w-auto">
            {/* Profile Picture */}
            <div className="relative group shrink-0">
               <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1.5 bg-gradient-to-br from-indigo-400 to-slate-400 shadow-2xl overflow-hidden relative">
                   {PORTFOLIO_PROFILE.avatar ? (
                     <img 
                        src={PORTFOLIO_PROFILE.avatar} 
                        alt={PORTFOLIO_PROFILE.name} 
                        className="w-full h-full object-cover rounded-full border-4 border-slate-900 bg-slate-800"
                     />
                   ) : (
                     <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-900">
                        <User className="w-16 h-16 text-slate-500" />
                     </div>
                   )}
                   <div className="absolute bottom-3 right-3 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-sm" title="Available"></div>
               </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{PORTFOLIO_PROFILE.name}</h1>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 text-indigo-200 font-medium text-lg">
                 <span className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {PORTFOLIO_PROFILE.title}
                 </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm mt-2">
                  <MapPin className="w-4 h-4" /> {PORTFOLIO_PROFILE.location}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto items-center md:items-end gap-3 text-sm text-slate-300 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-md z-10 shadow-lg mt-4 md:mt-0">
             <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default w-full md:w-auto justify-center md:justify-end">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" /> {PORTFOLIO_PROFILE.email}
             </div>
             <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default w-full md:w-auto justify-center md:justify-end">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" /> {PORTFOLIO_PROFILE.phone}
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                <Linkedin className="w-4 h-4 text-indigo-400 shrink-0" /> 
                <a href={PORTFOLIO_PROFILE.linkedin.startsWith('http') ? PORTFOLIO_PROFILE.linkedin : `https://${PORTFOLIO_PROFILE.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors underline decoration-indigo-500/50 hover:decoration-indigo-500">
                    LinkedIn Profile
                </a>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. LIVE RESUME PREVIEW SECTION */}
      {resumeData && isPdf && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 overflow-hidden h-[800px] relative group mt-8"
        >
            <div className="absolute top-4 right-8 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="sm" onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
            </div>
            <iframe 
                src={`${resumeData.public_url}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full rounded-xl border-0"
                title="Resume PDF Viewer"
            />
        </motion.div>
      )}

      {/* 3. HARDCODED RESUME CONTENT (Fallback or Supplementary) */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8"
      >
          {/* Left Column: Summary, Education, Skills */}
          <div className="lg:col-span-4 space-y-8">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" /> Professional Summary
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  {PORTFOLIO_PROFILE.summary}
                  </p>
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" /> Technical Skills
                  </h3>
                  <div className="space-y-4">
                      {Object.entries(PORTFOLIO_PROFILE.skills).map(([category, skills]) => (
                          <div key={category}>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{category}</h4>
                              <div className="flex flex-wrap gap-2">
                                  {skills.map((skill, i) => (
                                      <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                                          {skill}
                                      </Badge>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Education Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" /> Education
                  </h3>
                  <div className="space-y-6">
                      {PORTFOLIO_PROFILE.education.map((edu, idx) => (
                          <div key={idx} className="relative pl-4 border-l-2 border-slate-100">
                              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                              <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                              <p className="text-sm text-slate-600">{edu.major}</p>
                              <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs text-slate-500 font-medium">{edu.institution}</span>
                                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{edu.year}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Certifications Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" /> Certifications
                  </h3>
                  <div className="space-y-3">
                      {PORTFOLIO_PROFILE.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                  <h4 className="text-sm font-semibold text-slate-900">{cert.name}</h4>
                                  <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                                      <span>{cert.issuer}</span> • <span>{cert.year}</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Right Column: Experience */}
          <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-dark-green flex items-center gap-2">
                          <Briefcase className="w-6 h-6 text-indigo-600" /> Work Experience
                      </h3>
                      {resumeData && (
                          <Button onClick={handleDownload} variant="outline" className="hidden sm:flex items-center gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                              <Download className="w-4 h-4" /> Download Resume
                          </Button>
                      )}
                  </div>

                  <div className="space-y-12">
                      {PORTFOLIO_PROFILE.experience.map((exp, idx) => (
                          <div key={idx} className="group relative border-l-2 border-slate-200 pl-8 pb-2 last:border-0 last:pb-0">
                              {/* Timeline Dot */}
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm group-hover:scale-110 transition-transform"></div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                  <div>
                                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                          {exp.role}
                                      </h4>
                                      <div className="flex items-center gap-2 text-indigo-600 font-medium">
                                          {exp.company} 
                                          <span className="text-slate-300">•</span> 
                                          <span className="text-slate-500 font-normal text-sm">{exp.location}</span>
                                      </div>
                                  </div>
                                  <Badge variant="outline" className="w-fit bg-slate-50 text-slate-600 border-slate-200 px-3 py-1 h-fit flex items-center gap-1.5">
                                      <Calendar className="w-3.5 h-3.5" /> {exp.duration}
                                  </Badge>
                              </div>

                              <p className="text-slate-600 mb-4 leading-relaxed">
                                  {exp.description}
                              </p>

                              {exp.achievements && (
                                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                      <h5 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Key Achievements</h5>
                                      <ul className="space-y-2">
                                          {exp.achievements.map((achievement, i) => (
                                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                                                  {achievement}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </motion.div>

      {/* 4. File Management */}
      <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-dark-green">Resume File Management</h3>
                    <p className="text-sm text-slate-500">Update your source PDF file or download the current version.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resumeData ? (
                        <div 
                        className={`relative w-full sm:w-64 border-2 border-dashed rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-indigo-400 ${
                            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                        />
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2 text-slate-600">
                                <Upload className="w-5 h-5" />
                                <span className="text-sm font-medium">Upload New Resume</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 pr-2 w-full sm:w-auto shadow-sm">
                        <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center text-red-600 border border-red-100">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 mr-4">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]">{resumeData.file_name}</p>
                            <p className="text-xs text-slate-500">{new Date(resumeData.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={handleDownload} title="Download">
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={handleRemove} title="Delete">
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;