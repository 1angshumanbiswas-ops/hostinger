import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Brain, TrendingUp, Users, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/education/Navigation';
import { initializeEducationData } from '@/lib/educationDataInit';
import { useToast } from '@/components/ui/use-toast';

const EducationHome = () => {
  const [stats, setStats] = useState({
    totalPdfs: 0,
    totalVideos: 0,
    totalQuizzes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        // Initialize data if needed
        await initializeEducationData();
        // Fetch fresh stats
        await fetchStats();
      } catch (error) {
        console.error("Initialization error:", error);
        toast({
          title: "Error",
          description: "Failed to load education data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const fetchStats = async () => {
    try {
      const [pdfs, videos, quizzes] = await Promise.all([
        supabase.from('ncert_pdfs').select('id', { count: 'exact', head: true }),
        supabase.from('diksha_videos').select('id', { count: 'exact', head: true }),
        supabase.from('quizzes').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalPdfs: pdfs.count || 0,
        totalVideos: videos.count || 0,
        totalQuizzes: quizzes.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'NCERT PDFs',
      description: 'Access comprehensive NCERT textbooks for all subjects',
      color: 'from-[#2D7A4A] to-[#3E925B]',
      count: stats.totalPdfs
    },
    {
      icon: Video,
      title: 'DIKSHA Videos',
      description: 'Watch educational videos from DIKSHA platform',
      color: 'from-[#2D7A4A] to-[#3E925B]',
      count: stats.totalVideos
    },
    {
      icon: Brain,
      title: 'Practice Quizzes',
      description: 'Test your knowledge with interactive quizzes',
      color: 'from-[#2D7A4A] to-[#3E925B]',
      count: stats.totalQuizzes
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2D7A4A] animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading Education Platform...</p>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3F0] via-white to-[#E8F5E9]">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-dark-green mb-6">
                Welcome to <span className="bg-gradient-to-r from-[#2D7A4A] to-[#3E925B] bg-clip-text text-transparent">EduLearn</span>
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Your comprehensive Student Education platform with NCERT resources, educational videos, and interactive quizzes
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#E0E0D8] hover:border-[#2D7A4A] h-full bg-[#F5F3F0] p-6 rounded-xl">
                    <CardHeader className="p-0 pb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 transition-all duration-300`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-dark-green">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-slate-700 mb-4">{feature.description}</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#2D7A4A]">
                        <TrendingUp className="w-4 h-4 text-[#2D7A4A]" />
                        {feature.count} Resources Available
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="bg-gradient-to-r from-[#2D7A4A] to-[#3E925B] rounded-2xl p-8 shadow-xl text-white transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">7</div>
                  <div className="text-green-100">Classes (6-12)</div>
                </div>
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">5+</div>
                  <div className="text-green-100">Subjects per Class</div>
                </div>
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">Free</div>
                  <div className="text-green-100">Quality Education</div>
                </div>
              </div>
            </motion.div>

            {/* Getting Started Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-16 text-center"
            >
              <h2 className="text-3xl font-bold text-dark-green mb-6">Get Started with Student Education</h2>
              <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
                Use the navigation menu at the top to select your Class and Subject.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EducationHome;