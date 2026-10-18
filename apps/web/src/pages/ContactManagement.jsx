import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import CRMHeader from '@/components/crm/CRMHeader';
import AddContactModal from '@/components/crm/AddContactModal';
import EditContactModal from '@/components/crm/EditContactModal';
import { useCRMContacts } from '@/hooks/useCRMContacts';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Pencil, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ContactManagement() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const userId = user?.id;
  const { contacts, loading: contactsLoading, addContact, updateContact, deleteContact } = useCRMContacts(userId);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteContact(contactToDelete.id);
      toast({
        title: 'Contact Deleted',
        description: `${contactToDelete.name} has been removed.`,
      });
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete contact',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Applying':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      case 'Paid':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      default:
        return '';
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <>
        <Helmet>
          <title>Contacts | ProCRM</title>
          <meta name="description" content="Manage your contacts and leads" />
        </Helmet>
        <div className="p-4 lg:p-6 space-y-6">
          <Skeleton className="h-20 w-full" />
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
          <title>Contacts | ProCRM</title>
          <meta name="description" content="Manage your contacts and leads" />
        </Helmet>
        <CRMHeader title="Contacts" breadcrumbs={['CRM', 'Contacts']} />
        <div className="p-4 lg:p-6">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">Please log in to manage your contacts.</p>
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
        <title>Contacts | ProCRM</title>
        <meta name="description" content="Manage your contacts and leads" />
      </Helmet>

      <CRMHeader title="Contacts" breadcrumbs={['CRM', 'Contacts']} />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Applying">Applying</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </div>

        {/* Contacts Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Deal Amount</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {searchQuery || statusFilter !== 'All' 
                        ? 'No contacts match your filters' 
                        : 'No contacts yet. Click "Add Contact" to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.phone || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.company || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeClass(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${(contact.deal_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/crm/contact/${contact.id}`)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(contact)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(contact)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Results Count */}
        {!loading && filteredContacts.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </p>
        )}
      </div>

      {/* Modals */}
      <AddContactModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onContactAdded={addContact}
      />

      {selectedContact && (
        <EditContactModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          contact={selectedContact}
          onContactUpdated={updateContact}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone and will also remove all associated interactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}