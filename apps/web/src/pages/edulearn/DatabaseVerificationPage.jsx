import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { verifyDatabaseSetup, quickHealthCheck, getDataCounts } from '@/utils/edulearn/verifyDatabaseSetup';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, BarChart3 } from 'lucide-react';

export default function DatabaseVerificationPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [verifyResults, setVerifyResults] = useState(null);
  const [healthCheck, setHealthCheck] = useState(null);
  const [dataCounts, setDataCounts] = useState(null);

  useEffect(() => {
    // Run initial health check on mount
    runHealthCheck();
  }, []);

  const runVerification = async () => {
    setIsVerifying(true);
    setVerifyResults(null);
    try {
      const result = await verifyDatabaseSetup();
      setVerifyResults(result);
      
      if (result.isReady) {
        // If verification passes, also get data counts
        await loadDataCounts();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerifyResults({ isReady: false, error: error.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const runHealthCheck = async () => {
    setIsLoadingHealth(true);
    setHealthCheck(null);
    try {
      const health = await quickHealthCheck();
      setHealthCheck(health);
    } catch (error) {
      console.error('Health check error:', error);
      setHealthCheck({ healthy: false, errors: [error.message] });
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const loadDataCounts = async () => {
    setIsLoadingCounts(true);
    try {
      const counts = await getDataCounts();
      setDataCounts(counts);
    } catch (error) {
      console.error('Data counts error:', error);
      setDataCounts({ success: false, error: error.message });
    } finally {
      setIsLoadingCounts(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === true) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === false) return <XCircle className="w-5 h-5 text-red-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusBadge = (status) => {
    if (status === true) return <Badge className="bg-green-600">Ready</Badge>;
    if (status === false) return <Badge variant="destructive">Not Ready</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Database Verification - Edulearn Admin</title>
        <meta name="description" content="Verify and monitor Edulearn database setup and health" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Database <span className="text-primary">Verification</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor Edulearn database health and verify table configuration
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              onClick={runVerification} 
              disabled={isVerifying}
              size="lg"
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Full Verification
                </>
              )}
            </Button>

            <Button 
              onClick={runHealthCheck} 
              disabled={isLoadingHealth}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {isLoadingHealth ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Health Check
                </>
              )}
            </Button>

            <Button 
              onClick={loadDataCounts} 
              disabled={isLoadingCounts}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {isLoadingCounts ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Data Statistics
                </>
              )}
            </Button>
          </div>

          {/* Health Check Status */}
          {healthCheck && (
            <Alert className={`mb-6 ${healthCheck.healthy ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {healthCheck.healthy ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <AlertDescription className="font-semibold text-foreground">
                  {healthCheck.healthy ? 'Database is healthy and operational' : 'Database health check failed'}
                </AlertDescription>
              </div>
              {healthCheck.errors && healthCheck.errors.length > 0 && (
                <div className="mt-2 text-sm text-foreground">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc list-inside">
                    {healthCheck.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {new Date(healthCheck.timestamp).toLocaleString()}
              </p>
            </Alert>
          )}

          {/* Verification Results */}
          {verifyResults && (
            <div className="space-y-6 mb-6">
              {/* Overall Status */}
              <Alert className={verifyResults.isReady ? 'border-green-600 bg-green-50' : 'border-yellow-600 bg-yellow-50'}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(verifyResults.isReady)}
                  <AlertDescription className="font-semibold text-foreground">
                    {verifyResults.message}
                  </AlertDescription>
                </div>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tables Status */}
                {verifyResults.tables && Object.keys(verifyResults.tables).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tables</CardTitle>
                      <CardDescription>Database table status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(verifyResults.tables).map(([table, status]) => (
                        <div key={table} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span className="text-sm font-medium">{table}</span>
                          </div>
                          {getStatusBadge(status)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Columns Status */}
                {verifyResults.columns && Object.keys(verifyResults.columns).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Columns</CardTitle>
                      <CardDescription>Required column status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(verifyResults.columns).map(([column, status]) => (
                        <div key={column} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span className="text-sm font-medium">{column.replace(/_/g, ' ')}</span>
                          </div>
                          {getStatusBadge(status)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* RLS Status */}
                {verifyResults.rls && Object.keys(verifyResults.rls).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Row Level Security</CardTitle>
                      <CardDescription>RLS policy status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(verifyResults.rls).map(([table, status]) => (
                        <div key={table} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span className="text-sm font-medium">{table}</span>
                          </div>
                          {getStatusBadge(status)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Data Counts from verification */}
              {verifyResults.dataCounts && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Data Population Status
                    </CardTitle>
                    <CardDescription>Record counts from verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-muted-foreground">Resource Types</p>
                        <p className="text-2xl font-bold text-blue-700">{verifyResults.dataCounts.resource_types || 0}</p>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-muted-foreground">Materials</p>
                        <p className="text-2xl font-bold text-green-700">{verifyResults.dataCounts.materials || 0}</p>
                      </div>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-muted-foreground">Classes</p>
                        <p className="text-2xl font-bold text-purple-700">{verifyResults.dataCounts.classes || 0}</p>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-muted-foreground">Subjects</p>
                        <p className="text-2xl font-bold text-orange-700">{verifyResults.dataCounts.subjects || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Detailed Data Counts */}
          {dataCounts && dataCounts.success && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Detailed Statistics
                </CardTitle>
                <CardDescription>Live record counts from database tables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">Resource Types</p>
                    <p className="text-2xl font-bold text-blue-700">{dataCounts.counts.resource_types}</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">Materials</p>
                    <p className="text-2xl font-bold text-green-700">{dataCounts.counts.materials}</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">Classes</p>
                    <p className="text-2xl font-bold text-purple-700">{dataCounts.counts.classes}</p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">Subjects</p>
                    <p className="text-2xl font-bold text-orange-700">{dataCounts.counts.subjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!verifyResults && !isVerifying && (
            <Card>
              <CardContent className="p-12 text-center">
                <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Click "Full Verification" to check database configuration
                </p>
                <p className="text-sm text-muted-foreground">
                  Health check runs automatically on page load
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}