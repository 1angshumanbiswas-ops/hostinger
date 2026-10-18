import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, Users, CheckCircle2 } from 'lucide-react';

const CommunicationModule = ({ data }) => {
  const comms = data?.communications || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Recent Communications & Notes</h3>
      <div className="grid grid-cols-1 gap-4">
        {comms.map(comm => (
          <Card key={comm.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium mb-1">
                  <MessageSquare className="w-3 h-3" /> {comm.type}
                </div>
                <CardTitle className="text-base">{comm.title}</CardTitle>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(comm.date).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{comm.summary}</p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Attendees
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {comm.attendees.map((person, i) => (
                    <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-600">
                      {person}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Action Items
                </h4>
                <ul className="space-y-1">
                  {comm.actionItems.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunicationModule;