import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Save } from 'lucide-react';

export default function AdminMaterialEditor({ material, open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || '',
        description: material.description || '',
        classId: material.class_id || '',
        subjectId: material.subject_id || '',
        resourceTypeId: material.resource_type_id || '',
        fileUrl: material.file_url || '',
        fileSize: material.file_size || '',
        source: material.source || '',
        tags: material.tags?.join(', ') || ''
      });
    }
  }, [material]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const [classesRes, subjectsRes, typesRes] = await Promise.all([
      supabase.from('classes').select('*').order('class_number'),
      supabase.from('subjects').select('*').order('name'),
      supabase.from('resource_types').select('*').order('name')
    ]);

    setClasses(classesRes.data || []);
    setSubjects(subjectsRes.data || []);
    setResourceTypes(typesRes.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];

      const { error } = await supabase
        .from('materials')
        .update({
          title: formData.title,
          description: formData.description,
          class_id: formData.classId,
          subject_id: formData.subjectId,
          resource_type_id: formData.resourceTypeId,
          file_url: formData.fileUrl,
          file_size: formData.fileSize ? parseInt(formData.fileSize) : null,
          source: formData.source,
          tags: tagsArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', material.id);

      if (error) throw error;

      toast({
        title: "Material Updated",
        description: "Changes have been saved successfully"
      });

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-class">Class</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value })}
              >
                <SelectTrigger id="edit-class">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      Class {cls.class_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-subject">Subject</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
              >
                <SelectTrigger id="edit-subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-resourceType">Resource Type</Label>
              <Select
                value={formData.resourceTypeId}
                onValueChange={(value) => setFormData({ ...formData, resourceTypeId: value })}
              >
                <SelectTrigger id="edit-resourceType">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-fileUrl">File URL</Label>
            <Input
              id="edit-fileUrl"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-source">Source</Label>
              <Input
                id="edit-source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="comma-separated"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}