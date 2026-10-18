import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, MapPin, X, Briefcase, Hash } from 'lucide-react';

export default function JobFilterPanel({ 
  filters, 
  setFilters, 
  searchTerm, 
  setSearchTerm, 
  onApply, 
  onClear 
}) {

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
  const expLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Director'];
  const presetTitles = ['Project Manager', 'Product Manager', 'Delivery Manager'];

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const hasActiveFilters = filters.type?.length > 0 || filters.level?.length > 0 || filters.location !== 'all' || filters.presetTitles?.length > 0 || searchTerm;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2"><Search className="w-4 h-4"/> Search</h4>
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Keywords, company..." 
          className="bg-white"
        />
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Hash className="w-4 h-4"/> Target Roles</h4>
        <div className="space-y-2">
          {presetTitles.map(title => (
            <div key={title} className="flex items-center space-x-2">
              <Checkbox 
                id={`preset-${title}`} 
                checked={(filters.presetTitles || []).includes(title)}
                onCheckedChange={() => toggleFilter('presetTitles', title)}
              />
              <Label htmlFor={`preset-${title}`} className="text-sm font-normal cursor-pointer">{title}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`type-${type}`} 
                checked={(filters.type || []).includes(type)}
                onCheckedChange={() => toggleFilter('type', type)}
              />
              <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4"/> Experience</h4>
        <div className="space-y-2">
          {expLevels.map(level => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox 
                id={`level-${level}`} 
                checked={(filters.level || []).includes(level)}
                onCheckedChange={() => toggleFilter('level', level)}
              />
              <Label htmlFor={`level-${level}`} className="text-sm font-normal cursor-pointer">{level}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</h4>
        <Select value={filters.location || 'all'} onValueChange={(val) => setFilters({...filters, location: val})}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Location Preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Location</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="London">London</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t flex flex-col gap-2">
        <Button onClick={onApply} className="w-full bg-slate-900 text-white hover:bg-slate-800">
          Apply Filters
        </Button>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            className="w-full text-slate-500 hover:text-slate-900"
            onClick={onClear}
          >
            <X className="w-4 h-4 mr-2" /> Clear All
          </Button>
        )}
      </div>
    </div>
  );
}