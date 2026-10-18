import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import CRMHeader from '@/components/crm/CRMHeader';
import EditContactModal from '@/components/crm/EditContactModal';
import AddInteractionModal from '@/components/crm/AddInteractionModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Pencil, Mail, Phone, Building2, MapPin, DollarSign, Calendar, Plus, FileText, Video, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useCRMContacts } from '@/hooks/useCRMContacts';
import { useCRMInteractions } from '@/hooks/useCRMInteractions';
import { format } from 'date-fns';
import { validateUserID } from '@/utils/uuidValidator';

export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const userId = user?.id;
  const { updateContact } = useCRMContacts(userId);
  const { interactions, loading: interactionsLoading, addInteraction } = useCRMInteractions(userId, id);

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchContact = async () => {
      if (!userId || !validateUserID(userId, 'ContactDetails.fetchContact')) {
        setContact(null);
        setLoading(false);
        return;
      }

      if (!id) {
        setContact(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setContact(data);
      } catch (err) {
        console.error('Error fetching contact:', err);
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [userId, id]);

  const filteredInteractions = filterType === 'All' 
    ? interactions 
    : interactions.filter(i => i.type === filterType);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Applying':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Paid':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return '';
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail className="w-5 h-5" />;
      case 'Call': return <Phone className="w-5 h-5" />;
      case 'Meeting': return <Video className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Show loading state while checking authentication
  if (authLoading || loading) {
    return (
      <>
        <CRMHeader title="Contact Details" breadcrumbs={['CRM', 'Contacts', 'Details']} />
        <div className="p-4 lg:p-6 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated || !userId) {
    return (
      <>
        <Helmet>
          <title>Contact Details | ProCRM</title>
          <meta name="description" content="View contact details" />
        </Helmet>
        <CRMHeader title="Contact Details" breadcrumbs={['CRM', 'Contacts', 'Details']} />
        <div className="p-4 lg:p-6">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">Please log in to view contact details.</p>
              </div>
              <Button onClick={() => navigate('/login')}>Go to Login</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!contact) {
    return (
      <>
        <CRMHeader title="Contact Not Found" breadcrumbs={['CRM', 'Contacts', 'Not Found']} />
        <div className="p-4 lg:p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Contact not found or you don't have access to it.</p>
              <Button onClick={() => navigate('/crm/contacts')} className="mt-4">
                Back to Contacts
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{contact.name} | ProCRM</title>
        <meta name="description" content={`Contact details for ${contact.name}`} />
      </Helmet>

      <CRMHeader title={contact.name} breadcrumbs={['CRM', 'Contacts', contact.name]} />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/crm/contacts')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Contacts
        </Button>

        {/* Contact Profile */}
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{contact.name}</CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusBadgeClass(contact.status)}>
                  {contact.status}
                </Badge>
                <Button onClick={() => setEditModalOpen(true)} variant="outline" className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{contact.phone}</p>
                  </div>
                </div>
              )}

              {contact.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{contact.company}</p>
                  </div>
                </div>
              )}

              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{contact.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Deal Amount</p>
                  <p className="font-bold text-lg text-primary">
                    ${(contact.deal_amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {contact.expected_close_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Close</p>
                    <p className="font-medium">
                      {format(new Date(contact.expected_close_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interaction Timeline */}
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle>Interaction Timeline</CardTitle>
              <div className="flex items-center gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Note">Note</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setInteractionModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Interaction
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {interactionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : filteredInteractions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No interactions yet</p>
                <Button onClick={() => setInteractionModalOpen(true)} variant="outline" className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Interaction
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start gap-4 p-5 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(interaction.timestamp), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{interaction.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        by {interaction.created_by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EditContactModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        contact={contact}
        onContactUpdated={async (id, updates) => {
          await updateContact(id, updates);
          setContact({ ...contact, ...updates });
        }}
      />

      <AddInteractionModal
        open={interactionModalOpen}
        onOpenChange={setInteractionModalOpen}
        onInteractionAdded={addInteraction}
      />
    </>
  );
}