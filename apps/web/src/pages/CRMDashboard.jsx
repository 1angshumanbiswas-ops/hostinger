import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import CRMHeader from '@/components/crm/CRMHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCRMContacts } from '@/hooks/useCRMContacts';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Users, TrendingUp, DollarSign, Target, Plus, Mail, Phone, FileText, Video, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { validateUserID } from '@/utils/uuidValidator';

export default function CRMDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const userId = user?.id;
  const { contacts, loading: contactsLoading } = useCRMContacts(userId);
  const navigate = useNavigate();
  const [recentInteractions, setRecentInteractions] = React.useState([]);
  const [interactionsLoading, setInteractionsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecentInteractions = async () => {
      if (!userId || !validateUserID(userId, 'CRMDashboard.fetchRecentInteractions')) {
        setRecentInteractions([]);
        setInteractionsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('interactions')
          .select('*, contacts(name)')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentInteractions(data || []);
      } catch (err) {
        console.error('Error fetching interactions:', err);
      } finally {
        setInteractionsLoading(false);
      }
    };

    fetchRecentInteractions();
  }, [userId]);

  const metrics = useMemo(() => {
    const leadCount = contacts.filter(c => c.status === 'Lead').length;
    const applyingCount = contacts.filter(c => c.status === 'Applying').length;
    const paidCount = contacts.filter(c => c.status === 'Paid').length;
    const totalPipeline = contacts.reduce((sum, c) => sum + (parseFloat(c.deal_amount) || 0), 0);
    const conversionRate = contacts.length > 0 ? ((paidCount / contacts.length) * 100).toFixed(1) : 0;
    const avgDealSize = paidCount > 0 
      ? (contacts.filter(c => c.status === 'Paid').reduce((sum, c) => sum + (parseFloat(c.deal_amount) || 0), 0) / paidCount).toFixed(0)
      : 0;

    return {
      total: contacts.length,
      leadCount,
      applyingCount,
      paidCount,
      totalPipeline,
      conversionRate,
      avgDealSize
    };
  }, [contacts]);

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Meeting': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <>
        <Helmet>
          <title>Dashboard | ProCRM</title>
          <meta name="description" content="CRM Dashboard - Manage your contacts and pipeline" />
        </Helmet>
        <div className="p-4 lg:p-6 space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </>
    );
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated || !userId) {
    return (
      <>
        <Helmet>
          <title>Dashboard | ProCRM</title>
          <meta name="description" content="CRM Dashboard - Manage your contacts and pipeline" />
        </Helmet>
        <div className="p-4 lg:p-6">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">Please log in to view your CRM dashboard.</p>
              </div>
              <Button onClick={() => navigate('/login')}>Go to Login</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const loading = contactsLoading;

  return (
    <>
      <Helmet>
        <title>Dashboard | ProCRM</title>
        <meta name="description" content="CRM Dashboard - Manage your contacts and pipeline" />
      </Helmet>

      <CRMHeader title="Dashboard" breadcrumbs={['CRM', 'Dashboard']} />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Quick Action */}
        <div className="flex justify-end">
          <Button onClick={() => navigate('/crm/contacts')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Contact
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Contacts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">{metrics.total}</div>
              )}
            </CardContent>
          </Card>

          {/* Contacts by Stage */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                By Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Lead</Badge>
                    <span className="font-semibold">{metrics.leadCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Applying</Badge>
                    <span className="font-semibold">{metrics.applyingCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                    <span className="font-semibold">{metrics.paidCount}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pipeline Value */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <div className="text-3xl font-bold text-primary">
                  ${metrics.totalPipeline.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold text-accent">{metrics.conversionRate}%</div>
              )}
            </CardContent>
          </Card>

          {/* Average Deal Size */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Avg Deal Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-28" />
              ) : (
                <div className="text-3xl font-bold">${metrics.avgDealSize}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Interactions Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            {interactionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : recentInteractions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No interactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <span className="font-semibold">{interaction.contacts?.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{interaction.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(interaction.timestamp), 'MMM d, yyyy h:mm a')} • {interaction.created_by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}