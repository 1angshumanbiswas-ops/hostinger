import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Target, Upload, FileText, Download, Calendar, MapPin, User, Mail, Phone, Linkedin, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { PORTFOLIO_PROFILE } from '@/lib/profileData';
import { supabase } from '@/lib/customSupabaseClient';

const PortfolioContent = ({ activeSection }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [resumeData, setResumeData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section - Only on Dashboard */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center rounded-2xl overflow-hidden shadow-lg"
        style={{ 
          backgroundImage: 'url(https://horizons-cdn.hostinger.com/e0687bb0-98a0-45d4-8f73-50f1c1652251/f50c7187c1910a7ffc4cf91b727dca14.png)',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Building Powerful AI-Driven Applications
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Transforming ideas into reality with cutting-edge AI tools and no-code platforms
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{PORTFOLIO_PROFILE.experience.length}</p>
            <p className="text-sm text-muted-foreground">Positions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{PORTFOLIO_PROFILE.education.length}</p>
            <p className="text-sm text-muted-foreground">Degrees</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{PORTFOLIO_PROFILE.certifications.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-justify">
            {PORTFOLIO_PROFILE.summary}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderResume = () => (
    <div className="space-y-6">
      {/* Professional Profile Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {PORTFOLIO_PROFILE.avatar ? (
                <img src={PORTFOLIO_PROFILE.avatar} alt={PORTFOLIO_PROFILE.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <User className="w-16 h-16 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{PORTFOLIO_PROFILE.name}</h1>
              <p className="text-xl text-primary font-semibold mb-4">{PORTFOLIO_PROFILE.title}</p>
              <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${PORTFOLIO_PROFILE.email}`} className="hover:text-primary">{PORTFOLIO_PROFILE.email}</a>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="w-4 h-4" />
                  <span>{PORTFOLIO_PROFILE.phone}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Linkedin className="w-4 h-4" />
                  <a href={`https://${PORTFOLIO_PROFILE.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">LinkedIn</a>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4" />
                  <span>{PORTFOLIO_PROFILE.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Resume Upload/Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Resume Document
          </CardTitle>
          <CardDescription>Upload and manage your resume file</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!resumeData ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 cursor-pointer ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
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
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                )}
                <p className="text-sm text-muted-foreground mb-4">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <Button disabled={isUploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-10 h-10 text-primary" />
                  <div>
                    <p className="font-medium">{resumeData.file_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(resumeData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRemove}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-justify">
            {PORTFOLIO_PROFILE.summary}
          </p>
        </CardContent>
      </Card>

      {/* Complete Resume Sections in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Skills, Education, Certifications */}
        <div className="space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(PORTFOLIO_PROFILE.skills).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {category !== Object.keys(PORTFOLIO_PROFILE.skills)[Object.keys(PORTFOLIO_PROFILE.skills).length - 1] && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PORTFOLIO_PROFILE.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-primary/30">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary"></div>
                    <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.major}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">{edu.institution}</span>
                      <Badge variant="outline" className="text-xs">{edu.year}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PORTFOLIO_PROFILE.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold">{cert.name}</h4>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{cert.issuer}</span>
                        <span>•</span>
                        <span>{cert.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Experience (spans 2 columns) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {PORTFOLIO_PROFILE.experience.map((exp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative border-l-2 border-primary/30 pl-6 pb-6 last:pb-0"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-foreground">{exp.role}</h4>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          {exp.company}
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.duration}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.achievements && (
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <h5 className="text-sm font-semibold mb-2 uppercase tracking-wide">Key Achievements</h5>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {PORTFOLIO_PROFILE.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative border-l-2 border-primary/30 pl-6 pb-6 last:pb-0"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{exp.role}</h4>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      {exp.company}
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.duration}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {exp.description}
                </p>

                {exp.achievements && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h5 className="text-sm font-semibold mb-2 uppercase tracking-wide">Key Achievements</h5>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {PORTFOLIO_PROFILE.education.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative border-l-2 border-primary/30 pl-6"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                
                <h4 className="font-bold text-foreground">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.major}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground font-medium">{edu.institution}</span>
                  <Badge variant="secondary">{edu.year}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Technical Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(PORTFOLIO_PROFILE.skills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                {category !== Object.keys(PORTFOLIO_PROFILE.skills)[Object.keys(PORTFOLIO_PROFILE.skills).length - 1] && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTFOLIO_PROFILE.certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors duration-200"
              >
                <Award className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{cert.name}</h4>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span>{cert.issuer}</span>
                    <span>•</span>
                    <span>{cert.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Settings</CardTitle>
        <CardDescription>Manage your portfolio preferences and information</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Settings functionality coming soon. You'll be able to customize your portfolio display, manage visibility, and update your information.
        </p>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'resume':
        return renderResume();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'certifications':
        return renderCertifications();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="portfolio-content p-6">
      {renderContent()}
    </div>
  );
};

export default PortfolioContent;