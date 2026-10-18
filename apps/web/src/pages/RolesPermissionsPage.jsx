import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/erp/DashboardLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('roles').select('*').limit(10).catch(() => ({ data: [], error: null }));
      
      if (!data || data.length === 0) {
        setRoles([
          { id: 1, name: 'Superadmin', permissions_count: 42, description: 'Full system access' },
          { id: 2, name: 'Admin', permissions_count: 28, description: 'Department management' },
          { id: 3, name: 'User', permissions_count: 5, description: 'Basic access' },
        ]);
      } else {
        setRoles(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    toast({ title: "Action Clicked", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <Button onClick={handleAction}><Plus className="h-4 w-4 mr-2" /> Create New Role</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p>Loading roles...</p>
          ) : (
            roles.map((role) => (
              <Card key={role.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAction}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAction}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Permissions:</span>
                    <span className="font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">{role.permissions_count || 0} assigned</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={handleAction}>Edit Permissions</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}