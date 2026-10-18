import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import ClassCard from '@/components/edulearn/ClassCard';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

export default function EduClassesPage() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*, subjects(id)')
        .order('class_number');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Fetch classes error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Browse Classes - Edulearn</title>
        <meta name="description" content="Browse study materials by class from 6th to 12th standard. Access NCERT textbooks, CBSE sample papers, and more." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Browse by <span className="text-[hsl(var(--edulearn-heading))]">Class</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select your class to explore comprehensive study materials, textbooks, and practice resources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classes.map((classData) => (
                <ClassCard
                  key={classData.id}
                  classData={classData}
                  subjectCount={classData.subjects?.length || 0}
                />
              ))}
            </div>
          </div>
        </section>

        <EduFooter />
      </div>
    </>
  );
}