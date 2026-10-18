import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInDays } from 'date-fns';

export default function CredentialRotationReminder({ credentials, onRotateRequest }) {
  const needsRotation = credentials.filter(cred => {
    const daysOld = differenceInDays(new Date(), new Date(cred.updated_at));
    return daysOld > 90;
  });

  if (needsRotation.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-800 text-lg">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Credential Rotation Recommended
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 mb-4">
          For optimal security, it is best practice to rotate API keys every 90 days. The following services have outdated credentials:
        </p>
        <div className="space-y-3">
          {needsRotation.map(cred => (
            <div key={cred.id} className="flex items-center justify-between bg-white/60 p-3 rounded-md border border-amber-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-800">{cred.service_name}</span>
                <span className="text-xs text-amber-600">
                  Last updated {differenceInDays(new Date(), new Date(cred.updated_at))} days ago
                </span>
              </div>
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100" onClick={() => onRotateRequest(cred.service_name)}>
                Update Now <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}