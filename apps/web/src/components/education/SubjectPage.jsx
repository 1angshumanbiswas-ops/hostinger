import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Video, Brain, Download, ExternalLink, Play, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/education/Navigation';
import QuizComponent from '@/components/education/QuizComponent';
import { useToast } from '@/components/ui/use-toast';

const SubjectPage = () => {
  const { classId, subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [ncertPdfs, setNcertPdfs] = useState([]);
  const [dikshaVideos, setDikshaVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (classId && subjectId) {
      fetchData();
    }
  }, [classId, subjectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subject info
      const { data: subjectData, error: subError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single();
      
      if (subError) throw subError;
      setSubject(subjectData);

      // Fetch class info
      const { data: classData, error: clsError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();
      
      if (clsError) throw clsError;
      setClassInfo(classData);

      // Fetch NCERT PDFs
      const { data: pdfData, error: pdfError } = await supabase
        .from('ncert_pdfs')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });
      
      if (pdfError) console.error("PDF Fetch Error:", pdfError); // Log but don't stop
      if (pdfData) setNcertPdfs(pdfData);

      // Fetch DIKSHA Videos
      const { data: videoData, error: vidError } = await supabase
        .from('diksha_videos')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });
      
      if (vidError) console.error("Video Fetch Error:", vidError);
      if (videoData) setDikshaVideos(videoData);

      // Fetch Quizzes
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });
      
      if (quizError) console.error("Quiz Fetch Error:", quizError);
      if (quizData) setQuizzes(quizData);

    } catch (error) {
      console.error("Error fetching subject data:", error);
      toast({
        title: "Error loading resources",
        description: "Could not load class resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-white">
           <Navigation />
           <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Loading Learning Resources...</p>
           </div>
        </div>
     );
  }

  if (selectedQuiz) {
    return (
      <>
        <Navigation />
        <QuizComponent quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      <div className="container mx-auto px-4 max-w-7xl py-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {subject?.name || 'Subject'}
                </h1>
                <p className="text-slate-500 mt-1 font-medium">{classInfo?.name || 'Class'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NCERT PDFs Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">NCERT PDFs</h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {ncertPdfs.length === 0 ? (
              <Card className="col-span-full border-dashed border-2 border-slate-300 shadow-none bg-slate-50">
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No PDFs available for this subject yet.</p>
                </CardContent>
              </Card>
            ) : (
              ncertPdfs.map((pdf) => (
                <Card key={pdf.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start gap-3 text-base">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="leading-tight">{pdf.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(pdf.file_url, '_blank')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 h-9 text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(pdf.file_url, '_blank')}
                        className="h-9 w-9 p-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </section>

        {/* DIKSHA Videos Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">DIKSHA Videos</h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {dikshaVideos.length === 0 ? (
              <Card className="col-span-full border-dashed border-2 border-slate-300 shadow-none bg-slate-50">
                <CardContent className="py-12 text-center">
                  <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No videos available for this subject yet.</p>
                </CardContent>
              </Card>
            ) : (
              dikshaVideos.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full overflow-hidden">
                   <div className="aspect-video bg-slate-100 w-full relative group">
                      <iframe
                        src={video.video_url}
                        className="w-full h-full"
                        allowFullScreen
                        title={video.title}
                      />
                    </div>
                  <CardHeader className="pt-4 pb-2">
                    <CardTitle className="text-base line-clamp-2 leading-tight">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Added on {new Date(video.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </motion.div>
        </section>

        {/* Quizzes Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Quizzes</h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {quizzes.length === 0 ? (
              <Card className="col-span-full border-dashed border-2 border-slate-300 shadow-none bg-slate-50">
                <CardContent className="py-12 text-center">
                  <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No quizzes available for this subject yet.</p>
                </CardContent>
              </Card>
            ) : (
              quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription>
                      Test your knowledge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setSelectedQuiz(quiz)}
                      className="bg-purple-500 hover:bg-purple-600 w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default SubjectPage;