import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useFraudRules } from '@/hooks/useFraudRules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const FraudRulesEngine = () => {
  const { rules, loading, createRule, updateRule, deleteRule } = useFraudRules();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'unusual_amount',
    threshold_value: 0,
    enabled: true,
    description: ''
  });

  const ruleTypes = [
    { value: 'unusual_amount', label: 'Unusual Transaction Amount', description: 'Flag transactions exceeding customer average' },
    { value: 'rapid_transfers', label: 'Rapid Transfers', description: 'Detect multiple transactions in short time' },
    { value: 'location_mismatch', label: 'Location Mismatch', description: 'Flag transactions from unusual locations' },
    { value: 'velocity_check', label: 'High Velocity Check', description: 'Monitor transaction volume over time' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingRule 
      ? await updateRule(editingRule.id, formData)
      : await createRule(formData);

    if (result.success) {
      toast({
        title: editingRule ? 'Rule updated' : 'Rule created',
        description: `Fraud detection rule has been ${editingRule ? 'updated' : 'created'} successfully`
      });
      setIsDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      rule_name: rule.rule_name,
      rule_type: rule.rule_type,
      threshold_value: rule.threshold_value,
      enabled: rule.enabled,
      description: rule.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (ruleId) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      const result = await deleteRule(ruleId);
      if (result.success) {
        toast({
          title: 'Rule deleted',
          description: 'Fraud detection rule has been removed'
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      rule_name: '',
      rule_type: 'unusual_amount',
      threshold_value: 0,
      enabled: true,
      description: ''
    });
    setEditingRule(null);
  };

  return (
    <>
      <Helmet>
        <title>Fraud Rules - Bank Fraud Detection</title>
        <meta name="description" content="Configure fraud detection rules and thresholds" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fraud Detection Rules</h1>
            <p className="text-muted-foreground">Configure automated fraud detection parameters</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit' : 'Create'} Fraud Detection Rule</DialogTitle>
                <DialogDescription>
                  Configure parameters for automated fraud detection
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    value={formData.rule_name}
                    onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                    placeholder="Enter rule name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select
                    value={formData.rule_type}
                    onValueChange={(value) => setFormData({ ...formData, rule_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ruleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <p className="font-medium">{type.label}</p>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Threshold Value</Label>
                  <Input
                    type="number"
                    value={formData.threshold_value}
                    onChange={(e) => setFormData({ ...formData, threshold_value: parseFloat(e.target.value) })}
                    placeholder="Enter threshold"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.rule_type === 'unusual_amount' && 'Maximum transaction amount'}
                    {formData.rule_type === 'rapid_transfers' && 'Maximum number of transactions in 10 minutes'}
                    {formData.rule_type === 'location_mismatch' && 'Distance threshold in km'}
                    {formData.rule_type === 'velocity_check' && 'Maximum total amount per hour'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add rule description"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Enable Rule</Label>
                    <p className="text-sm text-muted-foreground">
                      Activate this rule for fraud detection
                    </p>
                  </div>
                  <Switch
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRule ? 'Update' : 'Create'} Rule
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ruleTypes.map((type) => (
            <Card key={type.value}>
              <CardHeader>
                <CardTitle className="text-base">{type.label}</CardTitle>
                <CardDescription className="text-xs">{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {rules.filter(r => r.rule_type === type.value && r.enabled).length} Active
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Rules</CardTitle>
            <CardDescription>Manage your fraud detection rules</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading rules...
                    </TableCell>
                  </TableRow>
                ) : rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No rules configured
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.rule_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {ruleTypes.find(t => t.value === rule.rule_type)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{rule.threshold_value}</TableCell>
                      <TableCell>
                        {rule.enabled ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(rule.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rule.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FraudRulesEngine;