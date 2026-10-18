import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileStack } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubjectCard({ subject, materialCount = 0 }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border hover:border-primary/50"
      onClick={() => navigate(`/edulearn/library?subjectId=${subject.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[hsl(var(--edulearn-heading))] group-hover:text-[hsl(var(--edulearn-heading-hover))] transition-colors">
              {subject.name}
            </h3>
          </div>
        </div>
        {subject.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {subject.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm">
          <FileStack className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{materialCount}</span> Materials
          </span>
        </div>
      </CardContent>
    </Card>
  );
}