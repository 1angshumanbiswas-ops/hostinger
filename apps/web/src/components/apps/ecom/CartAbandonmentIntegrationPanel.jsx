import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, KeyRound } from 'lucide-react';
import CredentialManager from '@/components/apps/ecom/credentials/CredentialManager';

export default function CartAbandonmentIntegrationPanel() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-8 h-8 text-indigo-600"/> 
          Integrations & API
        </h1>
        <p className="text-slate-500">Manage credentials for external services like Resend.</p>
      </div>

      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Mail className="w-5 h-5 text-indigo-600" />
            Resend Email Integration Required
          </CardTitle>
          <CardDescription>
            The cart abandonment notification system uses Resend to deliver high-deliverability emails.
            Ensure your <strong>Resend</strong> API key is configured below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-md border border-indigo-100 text-sm space-y-2">
            <h4 className="font-semibold text-slate-800">How to get a Resend API Key:</h4>
            <ol className="list-decimal pl-5 text-slate-600 space-y-1">
              <li>Sign up or log in at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">resend.com</a></li>
              <li>Navigate to <strong>API Keys</strong> in the dashboard sidebar.</li>
              <li>Click <strong>Create API Key</strong>, give it full access, and copy the key (starts with <code>re_</code>).</li>
              <li>Select the <strong>Resend</strong> tab below and paste your key.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Secure Credential Vault</h3>
        <CredentialManager />
      </div>
    </div>
  );
}