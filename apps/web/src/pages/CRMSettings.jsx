import React from 'react';
import { Helmet } from 'react-helmet';
import CRMHeader from '@/components/crm/CRMHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function CRMSettings() {
  return (
    <>
      <Helmet>
        <title>Settings | ProCRM</title>
        <meta name="description" content="CRM settings and configuration" />
      </Helmet>

      <CRMHeader title="Settings" breadcrumbs={['CRM', 'Settings']} />

      <div className="p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Settings panel coming soon. Configure your CRM preferences here.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}