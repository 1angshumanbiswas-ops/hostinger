import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import AdminMaterialEditor from '@/components/edulearn/AdminMaterialEditor';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Trash2, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EduAdminMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = materials.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subjects?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(materials);
    }
  }, [searchQuery, materials]);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          classes(class_number),
          subjects(name),
          resource_types(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
      setFilteredMaterials(data || []);
    } catch (error) {
      console.error('Fetch materials error:', error);
      toast({
        title: "Error",
        description: "Failed to load materials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setIsEditorOpen(true);
  };

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialToDelete.id);

      if (error) throw error;

      toast({
        title: "Material Deleted",
        description: "The material has been removed"
      });

      fetchMaterials();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Materials - Admin - Edulearn</title>
        <meta name="description" content="Manage all educational materials" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Manage <span className="text-[hsl(var(--edulearn-heading))]">Materials</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                View, edit, and delete educational materials
              </p>
            </div>

            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Class {material.classes?.class_number}</Badge>
                      </TableCell>
                      <TableCell>{material.subjects?.name || 'N/A'}</TableCell>
                      <TableCell>{material.resource_types?.name || 'N/A'}</TableCell>
                      <TableCell>{material.downloads_count || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(material)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(material)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No materials found</p>
              </div>
            )}
          </div>
        </section>

        <AdminMaterialEditor
          material={selectedMaterial}
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          onSuccess={fetchMaterials}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{materialToDelete?.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <EduFooter />
      </div>
    </>
  );
}