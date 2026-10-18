import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertOctagon, ShieldAlert } from 'lucide-react';

const RiskIssueModule = ({ data }) => {
  const risks = data?.risks?.risks || [];
  const issues = data?.risks?.issues || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-100">
          <CardHeader className="bg-red-50/50 pb-4 border-b border-red-100">
            <CardTitle className="text-base font-semibold text-red-800 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" /> Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {risks.map(risk => (
                <div key={risk.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-slate-800">{risk.title}</h4>
                    <Badge variant={risk.severity === 'High' ? 'destructive' : 'secondary'}>
                      {risk.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500"><span className="font-medium">Mitigation:</span> {risk.mitigation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="bg-amber-50/50 pb-4 border-b border-amber-100">
            <CardTitle className="text-base font-semibold text-amber-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Open Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map(issue => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium text-sm">{issue.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={issue.priority === 'Critical' ? 'text-red-600 border-red-200 bg-red-50' : ''}>
                        {issue.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{issue.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskIssueModule;