import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import ClassCard from '@/components/edulearn/ClassCard';
import MaterialCard from '@/components/edulearn/MaterialCard';
import { supabase } from '@/lib/customSupabaseClient';
import { Search, BookOpen, FileText, TrendingUp, ArrowRight } from 'lucide-react';

export default function EduHomePage() {
  const [classes, setClasses] = useState([]);
  const [featuredMaterials, setFeaturedMaterials] = useState([]);
  const [stats, setStats] = useState({ materials: 0, classes: 0, subjects: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes with subject counts
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*, subjects(id)')
        .order('class_number');

      if (classesError) {
        console.error('Error fetching classes:', classesError);
      } else {
        setClasses(classesData || []);
      }

      // Fetch featured materials (top downloaded)
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select(`
          *,
          classes(class_number),
          subjects(name),
          resource_types(name, icon_key)
        `)
        .order('downloads_count', { ascending: false })
        .limit(6);

      if (materialsError) {
        console.error('Error fetching materials:', materialsError);
      } else {
        setFeaturedMaterials(materialsData || []);
      }

      // Fetch statistics
      const [
        { count: materialsCount },
        { count: classesCount },
        { count: subjectsCount }
      ] = await Promise.all([
        supabase.from('materials').select('*', { count: 'exact', head: true }),
        supabase.from('classes').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        materials: materialsCount || 0,
        classes: classesCount || 0,
        subjects: subjectsCount || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/edulearn/library?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading - Edulearn</title>
          <meta name="description" content="Loading educational resources..." />
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading Edulearn...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edulearn - NCERT & CBSE Educational Resources for Classes 6-12</title>
        <meta name="description" content="Access comprehensive NCERT and CBSE study materials, textbooks, sample papers, and educational videos for classes 6 to 12." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1624388611710-bdf95023d1c2"
              alt="Students studying with educational materials"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Free Educational Resources
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Your Gateway to
                <span className="block text-[hsl(var(--edulearn-heading))] mt-2">
                  Quality Education
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Access NCERT textbooks, CBSE sample papers, Diksha videos, and comprehensive study materials for Classes 6-12
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for materials, subjects, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base shadow-lg bg-background text-foreground"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 shadow-lg">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[hsl(var(--edulearn-heading))]">{stats.materials}+</p>
                    <p className="text-sm text-muted-foreground">Study Materials</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[hsl(var(--edulearn-heading))]">{stats.subjects}+</p>
                    <p className="text-sm text-muted-foreground">Subjects Covered</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[hsl(var(--edulearn-heading))]">{stats.classes}</p>
                    <p className="text-sm text-muted-foreground">Classes (6-12)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Access Classes */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Browse by Class</h2>
                <p className="text-muted-foreground">Select your class to access relevant study materials</p>
              </div>
              <Button variant="ghost" onClick={() => navigate('/edulearn/classes')}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {classes.slice(0, 4).map((classData) => (
                  <ClassCard
                    key={classData.id}
                    classData={classData}
                    subjectCount={classData.subjects?.length || 0}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No classes available yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Featured Materials */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Popular Materials</h2>
                <p className="text-muted-foreground">Most downloaded study resources by students</p>
              </div>
              <Button variant="ghost" onClick={() => navigate('/edulearn/library')}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {featuredMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No materials available yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <EduFooter />
      </div>
    </>
  );
}