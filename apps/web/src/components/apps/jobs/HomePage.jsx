import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, Building, Users } from 'lucide-react';
import JobCard from './JobCard';
import { supabase } from '@/lib/customSupabaseClient';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });

  useEffect(() => {
    const fetchHomeData = async () => {
      // Fetch featured
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('featured', true)
        .limit(3);
      
      if (jobs) setFeaturedJobs(jobs);

      // Fetch rough stats
      const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      
      setStats({
        jobs: jobCount || 142,
        companies: 45 // mock distinct companies
      });
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs/search');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1672309558498-cfcc89afff25?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 z-10 bg-slate-900/70" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8 mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Find Your Next <span className="text-emerald-400">Tech Role</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto font-medium">
            Discover thousands of remote and on-site opportunities in software engineering, design, data, and more.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-3 p-2 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Job title, keyword, or company..." 
                className="h-12 pl-11 bg-white border-0 text-slate-900 placeholder:text-slate-400 rounded-lg w-full text-base focus-visible:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-base shadow-sm">
              Search Jobs
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 pt-4 text-sm font-medium text-slate-300">
            <span>Popular:</span>
            <button onClick={() => navigate('/jobs/search?q=React')} className="hover:text-emerald-400 transition-colors">React</button>
            <button onClick={() => navigate('/jobs/search?q=Node')} className="hover:text-emerald-400 transition-colors">Node.js</button>
            <button onClick={() => navigate('/jobs/search?q=Designer')} className="hover:text-emerald-400 transition-colors">UI/UX Designer</button>
            <button onClick={() => navigate('/jobs/search?q=Remote')} className="hover:text-emerald-400 transition-colors">Remote Work</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.jobs}+</h3>
              <p className="text-slate-500 font-medium">Active Jobs</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.companies}+</h3>
              <p className="text-slate-500 font-medium">Companies Hiring</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">10k+</h3>
              <p className="text-slate-500 font-medium">Candidates Placed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Opportunities</h2>
            <p className="text-slate-500 mt-2">Hand-picked roles from top companies.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => navigate('/jobs/search')}>
            Browse All Jobs
          </Button>
        </div>
        
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Loading featured jobs...</p>
          </div>
        )}
        
        <div className="mt-8 sm:hidden flex justify-center">
           <Button variant="outline" className="w-full border-slate-300" onClick={() => navigate('/jobs/search')}>
            Browse All Jobs
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-900 py-20 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to accelerate your hiring?</h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Join thousands of companies that use TechJobFinder to build their dream teams. Post your open roles today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-slate-100 font-bold" onClick={() => navigate('/jobs/admin')}>
              Post a Job Now
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-500 text-white hover:bg-emerald-800" onClick={() => navigate('/jobs/search')}>
              Explore Candidates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}