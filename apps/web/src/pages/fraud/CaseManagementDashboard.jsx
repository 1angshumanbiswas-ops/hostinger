import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Eye, Filter, FileText } from 'lucide-react';
import { useFraudCases } from '@/hooks/useFraudCases';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CaseManagementDashboard = () => {
  const [filters, setFilters] = useState({});
  const [selectedCase, setSelectedCase] = useState(null);
  const [note, setNote] = useState('');
  const { cases, loading, updateCase, addNote } = useFraudCases(filters);
  const { toast } = useToast();

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const colors = {
      investigating: 'bg-blue-500',
      confirmed_fraud: 'bg-red-500',
      false_positive: 'bg-green-500',
      resolved: 'bg-gray-500'
    };
    return <Badge className={colors[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const handleUpdateStatus = async (caseId, status) => {
    const result = await updateCase(caseId, { status });
    if (result.success) {
      toast({
        title: 'Status updated',
        description: `Case status changed to ${status}`
      });
    }
  };

  const handleUpdatePriority = async (caseId, priority) => {
    const result = await updateCase(caseId, { priority });
    if (result.success) {
      toast({
        title: 'Priority updated',
        description: `Case priority changed to ${priority}`
      });
    }
  };

  const handleAssign = async (caseId, assignee) => {
    const result = await updateCase(caseId, { assigned_to: assignee });
    if (result.success) {
      toast({
        title: 'Case assigned',
        description: `Case assigned to ${assignee}`
      });
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    
    const result = await addNote(selectedCase.id, note);
    if (result.success) {
      toast({
        title: 'Note added',
        description: 'Investigation note has been saved'
      });
      setNote('');
      setSelectedCase({
        ...selectedCase,
        investigation_notes: result.notes
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Case Management - Bank Fraud Detection</title>
        <meta name="description" content="Manage fraud investigation cases" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Case Management</h1>
            <p className="text-muted-foreground">Investigate and manage fraud cases</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {cases.filter(c => c.status === 'investigating').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Confirmed Fraud</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {cases.filter(c => c.status === 'confirmed_fraud').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {cases.filter(c => c.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fraud Cases</CardTitle>
                <CardDescription>All fraud investigation cases</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="confirmed_fraud">Confirmed Fraud</SelectItem>
                    <SelectItem value="false_positive">False Positive</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Alert Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading cases...
                    </TableCell>
                  </TableRow>
                ) : cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No fraud cases found
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((fraudCase) => (
                    <TableRow key={fraudCase.id}>
                      <TableCell className="font-mono text-xs">
                        {fraudCase.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{fraudCase.customers?.name}</p>
                          <p className="text-xs text-muted-foreground">{fraudCase.customers?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(fraudCase.transactions?.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={fraudCase.risk_score >= 70 ? 'destructive' : 'default'}>
                          {fraudCase.risk_score}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {fraudCase.alert_reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(fraudCase.status)}</TableCell>
                      <TableCell>{getPriorityBadge(fraudCase.priority)}</TableCell>
                      <TableCell>{fraudCase.assigned_to || 'Unassigned'}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(fraudCase.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCase(fraudCase)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
            <DialogDescription>Case ID: {selectedCase?.id}</DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <div>
                    <p className="font-medium">{selectedCase.customers?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCase.customers?.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedCase.customers?.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Transaction Details</Label>
                  <div>
                    <p className="text-2xl font-bold">${parseFloat(selectedCase.transactions?.amount || 0).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCase.transactions?.type} • {new Date(selectedCase.transactions?.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Location: {selectedCase.transactions?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Assessment</Label>
                <div className="flex items-center gap-4">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Risk Score: {selectedCase.risk_score}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{selectedCase.alert_reason}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedCase.status}
                    onValueChange={(value) => handleUpdateStatus(selectedCase.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="confirmed_fraud">Confirmed Fraud</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={selectedCase.priority}
                    onValueChange={(value) => handleUpdatePriority(selectedCase.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select
                    value={selectedCase.assigned_to || ''}
                    onValueChange={(value) => handleAssign(selectedCase.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Investigation Notes</Label>
                <div className="rounded-lg border bg-muted/50 p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
                  {selectedCase.investigation_notes ? (
                    <pre className="whitespace-pre-wrap text-sm">{selectedCase.investigation_notes}</pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">No notes yet</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Note</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter investigation notes..."
                  rows={3}
                />
                <Button onClick={handleAddNote}>
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaseManagementDashboard;