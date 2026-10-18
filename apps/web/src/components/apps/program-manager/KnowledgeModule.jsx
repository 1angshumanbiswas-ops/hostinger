import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

const KnowledgeModule = () => {
  const docs = [
    { id: 1, title: 'Q3 Incident Response Playbook', type: 'SOP', date: '2023-09-15', author: 'DevOps Team' },
    { id: 2, title: 'Frontend Architecture Guidelines', type: 'Architecture', date: '2023-10-02', author: 'Architecture Guild' },
    { id: 3, title: 'Release Management Checklist', type: 'Checklist', date: '2023-10-18', author: 'QA Team' },
    { id: 4, title: 'Sprint Retrospective Template', type: 'Template', date: '2023-08-20', author: 'Scrum Masters' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-cyan-600" />
        <h3 className="text-lg font-semibold text-slate-800">Knowledge Repository</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(doc => (
          <Card key={doc.id} className="group hover:border-cyan-200 transition-colors">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{doc.title}</h4>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {doc.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Updated {doc.date} by {doc.author}
                </div>
                <Button variant="ghost" size="sm" className="mt-3 h-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 px-2 -ml-2">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeModule;