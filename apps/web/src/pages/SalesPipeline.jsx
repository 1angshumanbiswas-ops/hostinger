import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import CRMHeader from '@/components/crm/CRMHeader';
import { useCRMContacts } from '@/hooks/useCRMContacts';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function SalesPipeline() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const userId = user?.id;
  const { contacts, loading: contactsLoading, updateContact } = useCRMContacts(userId);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [draggedContact, setDraggedContact] = useState(null);

  const pipelineData = useMemo(() => {
    const stages = {
      Lead: contacts.filter(c => c.status === 'Lead'),
      Applying: contacts.filter(c => c.status === 'Applying'),
      Paid: contacts.filter(c => c.status === 'Paid')
    };

    const totalValue = contacts.reduce((sum, c) => sum + (parseFloat(c.deal_amount) || 0), 0);

    return { stages, totalValue };
  }, [contacts]);

  const handleDragStart = (e, contact) => {
    setDraggedContact(contact);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedContact || draggedContact.status === newStatus) {
      setDraggedContact(null);
      return;
    }

    try {
      await updateContact(draggedContact.id, { status: newStatus });
      
      toast({
        title: 'Contact Moved',
        description: `${draggedContact.name} moved to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update contact',
        variant: 'destructive'
      });
    } finally {
      setDraggedContact(null);
    }
  };

  const getDealSizeColor = (amount) => {
    if (amount >= 20000) return 'text-green-600 dark:text-green-400';
    if (amount >= 15000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Lead':
        return 'bg-blue-500';
      case 'Applying':
        return 'bg-yellow-500';
      case 'Paid':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <>
        <Helmet>
          <title>Sales Pipeline | ProCRM</title>
          <meta name="description" content="Manage your sales pipeline and track deals" />
        </Helmet>
        <div className="p-4 lg:p-6 space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
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
          <title>Sales Pipeline | ProCRM</title>
          <meta name="description" content="Manage your sales pipeline and track deals" />
        </Helmet>
        <CRMHeader title="Sales Pipeline" breadcrumbs={['CRM', 'Pipeline']} />
        <div className="p-4 lg:p-6">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">Please log in to view your sales pipeline.</p>
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
        <title>Sales Pipeline | ProCRM</title>
        <meta name="description" content="Manage your sales pipeline and track deals" />
      </Helmet>

      <CRMHeader title="Sales Pipeline" breadcrumbs={['CRM', 'Pipeline']} />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Pipeline Value */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Total Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              <div className="text-4xl font-bold text-primary">
                ${pipelineData.totalValue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['Lead', 'Applying', 'Paid'].map((stage) => (
            <div
              key={stage}
              className="space-y-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStageColor(stage)}`} />
                  <h3 className="text-lg font-bold">{stage}</h3>
                  <Badge variant="outline">{pipelineData.stages[stage].length}</Badge>
                </div>
                <div className="text-sm text-muted-foreground font-semibold">
                  ${pipelineData.stages[stage].reduce((sum, c) => sum + (parseFloat(c.deal_amount) || 0), 0).toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 min-h-[400px] bg-muted/20 rounded-lg p-4 border-2 border-dashed border-border">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))
                ) : pipelineData.stages[stage].length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No contacts in {stage}</p>
                  </div>
                ) : (
                  pipelineData.stages[stage].map((contact) => (
                    <Card
                      key={contact.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, contact)}
                      onClick={() => navigate(`/crm/contact/${contact.id}`)}
                      className="cursor-move hover:shadow-lg transition-shadow border-l-4 border-l-primary"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-base">{contact.name}</h4>
                            {contact.company && (
                              <p className="text-sm text-muted-foreground">{contact.company}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {stage}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className={`font-bold text-lg ${getDealSizeColor(contact.deal_amount)}`}>
                            ${(contact.deal_amount || 0).toLocaleString()}
                          </span>
                        </div>

                        {contact.expected_close_date && (
                          <div className="text-xs text-muted-foreground">
                            Expected close: {new Date(contact.expected_close_date).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-muted-foreground">Small Deal ($10-15k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-600" />
                <span className="text-muted-foreground">Medium Deal ($15-20k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span className="text-muted-foreground">Large Deal ($20k+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}