import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Video, FileText, Brain, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { toast } = useToast();

  // PDF Upload State
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Video State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Quiz State
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A'
  }]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*').order('name');
    if (data) setClasses(data);
  };

  const fetchSubjects = async (classId) => {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('class_id', classId)
      .order('name');
    if (data) setSubjects(data);
  };

  const handleUploadPDF = async () => {
    if (!pdfTitle || !pdfUrl || !selectedSubject) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const { error } = await supabase.from('ncert_pdfs').insert({
      subject_id: selectedSubject,
      title: pdfTitle,
      file_url: pdfUrl
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload PDF',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'PDF uploaded successfully'
      });
      setPdfTitle('');
      setPdfUrl('');
    }
  };

  const handleAddVideo = async () => {
    if (!videoTitle || !videoUrl || !selectedSubject) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const { error } = await supabase.from('diksha_videos').insert({
      subject_id: selectedSubject,
      title: videoTitle,
      video_url: videoUrl
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add video',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Video added successfully'
      });
      setVideoTitle('');
      setVideoUrl('');
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle || !selectedSubject || questions.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in quiz title and at least one question',
        variant: 'destructive'
      });
      return;
    }

    // Validate all questions
    const isValid = questions.every(q => 
      q.question_text && q.option_a && q.option_b && q.option_c && q.option_d && q.correct_answer
    );

    if (!isValid) {
      toast({
        title: 'Incomplete Questions',
        description: 'Please fill in all question fields',
        variant: 'destructive'
      });
      return;
    }

    // Create quiz
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        subject_id: selectedSubject,
        title: quizTitle
      })
      .select()
      .single();

    if (quizError) {
      toast({
        title: 'Error',
        description: 'Failed to create quiz',
        variant: 'destructive'
      });
      return;
    }

    // Add questions
    const questionsWithQuizId = questions.map(q => ({
      ...q,
      quiz_id: quizData.id
    }));

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsWithQuizId);

    if (questionsError) {
      toast({
        title: 'Error',
        description: 'Failed to add questions',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Quiz created successfully'
      });
      setQuizTitle('');
      setQuestions([{
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A'
      }]);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A'
    }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-xl">
              <CardTitle className="text-2xl">Student Education Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin-class">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="admin-class">
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="admin-subject">Select Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                    <SelectTrigger id="admin-subject">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="pdfs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl shadow-md p-1">
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              Upload PDFs
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg">
              <Video className="w-4 h-4 mr-2" />
              Add Videos
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-lg">
              <Brain className="w-4 h-4 mr-2" />
              Create Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdfs">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Upload NCERT PDF</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pdf-title">PDF Title</Label>
                  <Input
                    id="pdf-title"
                    placeholder="e.g., Chapter 1: Introduction"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    className="text-slate-900"
                  />
                </div>
                <div>
                  <Label htmlFor="pdf-url">PDF URL</Label>
                  <Input
                    id="pdf-url"
                    placeholder="https://example.com/file.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="text-slate-900"
                  />
                </div>
                <Button onClick={handleUploadPDF} className="bg-blue-500 hover:bg-blue-600 w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Add DIKSHA Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    placeholder="e.g., Newton's Laws Explained"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="text-slate-900"
                  />
                </div>
                <div>
                  <Label htmlFor="video-url">Video Embed URL</Label>
                  <Input
                    id="video-url"
                    placeholder="https://www.youtube.com/embed/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="text-slate-900"
                  />
                </div>
                <Button onClick={handleAddVideo} className="bg-green-500 hover:bg-green-600 w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Create Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    placeholder="e.g., Chapter 1 Quiz"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="text-slate-900"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Questions</h3>
                  {questions.map((question, index) => (
                    <Card key={index} className="border-2 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-900">Question {index + 1}</h4>
                          {questions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div>
                          <Label>Question Text</Label>
                          <Textarea
                            placeholder="Enter your question"
                            value={question.question_text}
                            onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                            className="text-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Option A</Label>
                            <Input
                              placeholder="Option A"
                              value={question.option_a}
                              onChange={(e) => updateQuestion(index, 'option_a', e.target.value)}
                              className="text-slate-900"
                            />
                          </div>
                          <div>
                            <Label>Option B</Label>
                            <Input
                              placeholder="Option B"
                              value={question.option_b}
                              onChange={(e) => updateQuestion(index, 'option_b', e.target.value)}
                              className="text-slate-900"
                            />
                          </div>
                          <div>
                            <Label>Option C</Label>
                            <Input
                              placeholder="Option C"
                              value={question.option_c}
                              onChange={(e) => updateQuestion(index, 'option_c', e.target.value)}
                              className="text-slate-900"
                            />
                          </div>
                          <div>
                            <Label>Option D</Label>
                            <Input
                              placeholder="Option D"
                              value={question.option_d}
                              onChange={(e) => updateQuestion(index, 'option_d', e.target.value)}
                              className="text-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Correct Answer</Label>
                          <Select
                            value={question.correct_answer}
                            onValueChange={(value) => updateQuestion(index, 'correct_answer', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button onClick={addQuestion} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                <Button onClick={handleCreateQuiz} className="bg-purple-500 hover:bg-purple-600 w-full">
                  <Brain className="w-4 h-4 mr-2" />
                  Create Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;