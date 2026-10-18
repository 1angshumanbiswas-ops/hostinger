import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Upload, Loader2 } from 'lucide-react';

export default function AdminUploadForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    resourceTypeId: '',
    fileUrl: '',
    fileSize: '',
    source: '',
    tags: ''
  });
  const [compliance, setCompliance] = useState({
    copyright: false,
    attribution: false,
    verified: false
  });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

    if (!compliance.copyright || !compliance.attribution || !compliance.verified) {
      toast({
        title: "Compliance Required",
        description: "Please check all compliance items before uploading",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];

      const { data, error } = await supabase
        .from('materials')
        .insert({
          title: formData.title,
          description: formData.description,
          class_id: formData.classId,
          subject_id: formData.subjectId,
          resource_type_id: formData.resourceTypeId,
          file_url: formData.fileUrl,
          file_size: formData.fileSize ? parseInt(formData.fileSize) : null,
          source: formData.source,
          tags: tagsArray
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Material Uploaded",
        description: "Educational material has been successfully added"
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        resourceTypeId: '',
        fileUrl: '',
        fileSize: '',
        source: '',
        tags: ''
      });
      setCompliance({ copyright: false, attribution: false, verified: false });

      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload New Material
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., NCERT Class 10 Maths Textbook"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the material"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="class">Class *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value })}
                required
              >
                <SelectTrigger id="class">
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
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                required
              >
                <SelectTrigger id="subject">
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
              <Label htmlFor="resourceType">Resource Type *</Label>
              <Select
                value={formData.resourceTypeId}
                onValueChange={(value) => setFormData({ ...formData, resourceTypeId: value })}
                required
              >
                <SelectTrigger id="resourceType">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fileUrl">File URL *</Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                required
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div>
              <Label htmlFor="fileSize">File Size (bytes)</Label>
              <Input
                id="fileSize"
                type="number"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="e.g., 5242880 (5MB)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g., NCERT, CBSE, Diksha"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., algebra, geometry, practice"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label className="text-base font-semibold">Compliance Checklist</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="copyright"
                checked={compliance.copyright}
                onCheckedChange={(checked) => setCompliance({ ...compliance, copyright: checked })}
              />
              <label htmlFor="copyright" className="text-sm cursor-pointer">
                Copyright clearance confirmed
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attribution"
                checked={compliance.attribution}
                onCheckedChange={(checked) => setCompliance({ ...compliance, attribution: checked })}
              />
              <label htmlFor="attribution" className="text-sm cursor-pointer">
                Proper source attribution provided
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={compliance.verified}
                onCheckedChange={(checked) => setCompliance({ ...compliance, verified: checked })}
              />
              <label htmlFor="verified" className="text-sm cursor-pointer">
                Content verified and appropriate for students
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}