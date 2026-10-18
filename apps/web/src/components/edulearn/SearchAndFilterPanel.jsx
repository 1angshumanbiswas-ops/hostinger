import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

export default function SearchAndFilterPanel({ filters, onFiltersChange }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    const [classesRes, subjectsRes, typesRes] = await Promise.all([
      supabase.from('classes').select('*').order('class_number'),
      supabase.from('subjects').select('*').order('name'),
      supabase.from('resource_types').select('*').order('name')
    ]);

    setClasses(classesRes.data || []);
    setSubjects(subjectsRes.data || []);
    setResourceTypes(typesRes.data || []);
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      classId: '',
      subjectId: '',
      resourceTypeId: '',
      source: '',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.searchQuery || filters.classId || filters.subjectId || 
                          filters.resourceTypeId || filters.source;

  return (
    <Card className="border-2 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Search & Filter</h3>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search Materials</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by title or description..."
                value={filters.searchQuery}
                onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class" className="text-sm font-medium mb-2 block">Class</Label>
              <Select
                value={filters.classId}
                onValueChange={(value) => onFiltersChange({ ...filters, classId: value })}
              >
                <SelectTrigger id="class">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      Class {cls.class_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium mb-2 block">Subject</Label>
              <Select
                value={filters.subjectId}
                onValueChange={(value) => onFiltersChange({ ...filters, subjectId: value })}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resourceType" className="text-sm font-medium mb-2 block">Resource Type</Label>
              <Select
                value={filters.resourceTypeId}
                onValueChange={(value) => onFiltersChange({ ...filters, resourceTypeId: value })}
              >
                <SelectTrigger id="resourceType">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source" className="text-sm font-medium mb-2 block">Source</Label>
              <Select
                value={filters.source}
                onValueChange={(value) => onFiltersChange({ ...filters, source: value })}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sources</SelectItem>
                  <SelectItem value="NCERT">NCERT</SelectItem>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="Diksha">Diksha</SelectItem>
                  <SelectItem value="State Board">State Board</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="sort" className="text-sm font-medium mb-2 block">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
            >
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}