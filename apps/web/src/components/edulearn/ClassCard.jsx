import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClassCard({ classData, subjectCount = 0 }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 overflow-hidden"
      onClick={() => navigate(`/edulearn/classes/${classData.id}`)}
    >
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <GraduationCap className="w-8 h-8" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
        </div>
        <h3 className="text-2xl font-bold text-[hsl(var(--edulearn-heading))] mb-2 group-hover:text-[hsl(var(--edulearn-heading-hover))] transition-colors">
          Class {classData.class_number}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {classData.description || `Study materials for Class ${classData.class_number}`}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{subjectCount}</span>
          <span>Subjects Available</span>
        </div>
      </CardContent>
    </Card>
  );
}