import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Building2, BookmarkPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function JobCard({ job, onSave, savedJobs = [] }) {
  const navigate = useNavigate();
  const isSaved = savedJobs.includes(job.id);
  const fallbackLogo = "https://images.unsplash.com/photo-1704030459018-88ad4a4c7446?auto=format&fit=crop&q=80&w=200&h=200";

  const isApiSource = job.source === 'api';

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) onSave(job.id, isSaved);
  };

  const handleCardClick = () => {
    if (isApiSource && job.external_url) {
      // For API jobs, we might want to navigate to a local details page first, 
      // or directly to external url if local page isn't handling API jobs well yet.
      // Let's use local detail page and it will show external_url.
      navigate(`/jobs/${job.id}`, { state: { jobData: job } });
    } else {
      navigate(`/jobs/${job.id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col h-full relative"
      onClick={handleCardClick}
    >
      <div className="absolute top-4 right-14">
         <Badge variant="outline" className={`text-xs font-semibold ${isApiSource ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {isApiSource ? 'External API' : 'Direct'}
         </Badge>
      </div>

      <CardContent className="p-6 flex-1 pt-7">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex gap-4">
            <div className="h-14 w-14 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0 bg-white p-1">
              <img 
                src={job.company_logo || fallbackLogo} 
                alt={`${job.company} logo`} 
                className="w-full h-full object-cover rounded-md"
                onError={(e) => { e.target.src = fallbackLogo; }}
              />
            </div>
            <div className="pr-16">
              <h3 className="font-semibold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{job.title}</h3>
              <p className="text-slate-500 flex items-center gap-1 text-sm mt-1 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                {job.company}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`absolute top-3 right-3 h-8 w-8 rounded-full ${isSaved ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
            onClick={handleSaveClick}
          >
            <BookmarkPlus className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 mb-5">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-normal">
            {job.job_type || 'Full-time'}
          </Badge>
          <Badge variant="outline" className="text-slate-600 border-slate-200 font-normal">
            {job.experience_level || 'Entry-level'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-500 mt-auto">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="truncate">
              {job.salary_min ? `$${(job.salary_min/1000).toFixed(0)}k` : 'DOE'} 
              {job.salary_max ? ` - $${(job.salary_max/1000).toFixed(0)}k` : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}