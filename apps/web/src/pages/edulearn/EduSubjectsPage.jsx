import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import SubjectCard from '@/components/edulearn/SubjectCard';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EduSubjectsPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchSubjects();
    }
  }, [classId]);

  const fetchSubjects = async () => {
    try {
      // Fetch class details
      const { data: classInfo } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      setClassData(classInfo);

      // Fetch subjects for this class with material counts
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*, materials(id)')
        .eq('class_id', classId)
        .order('name');

      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Fetch subjects error:', error);
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
        <title>Class {classData?.class_number} Subjects - Edulearn</title>
        <meta name="description" content={`Browse subjects and study materials for Class ${classData?.class_number}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12">
              <Badge className="mb-4">Class {classData?.class_number}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Available <span className="text-[hsl(var(--edulearn-heading))]">Subjects</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {classData?.description || `Explore all subjects for Class ${classData?.class_number}`}
              </p>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No subjects available for this class yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    materialCount={subject.materials?.length || 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <EduFooter />
      </div>
    </>
  );
}