import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import MaterialCard from '@/components/edulearn/MaterialCard';
import ResourceTypeIcon from '@/components/edulearn/ResourceTypeIcon';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import { useRelatedMaterials } from '@/hooks/useRelatedMaterials';
import { useFavorites } from '@/hooks/useFavorites';
import { useDownloadTracking } from '@/hooks/useDownloadTracking';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Heart, Share2, Printer, Eye, Calendar, FileText } from 'lucide-react';

export default function EduMaterialDetailsPage() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { relatedMaterials } = useRelatedMaterials(material);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { logDownload } = useDownloadTracking();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  const fetchMaterial = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          classes(class_number),
          subjects(name),
          resource_types(name, icon_key)
        `)
        .eq('id', materialId)
        .single();

      if (error) throw error;
      setMaterial(data);
    } catch (error) {
      console.error('Fetch material error:', error);
      toast({
        title: "Error",
        description: "Failed to load material details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!material.file_url) {
      toast({
        title: "No File Available",
        description: "This material doesn't have a downloadable file",
        variant: "destructive"
      });
      return;
    }

    await logDownload(material.id);
    window.open(material.file_url, '_blank');
    
    toast({
      title: "Download Started",
      description: "Your download has been initiated"
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: material.title,
          text: material.description,
          url: url
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Material link copied to clipboard"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-background">
        <EduHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">Material not found</p>
          <Button onClick={() => navigate('/edulearn/library')} className="mt-4">
            Browse Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{material.title} - Edulearn</title>
        <meta name="description" content={material.description || `Download ${material.title} for Class ${material.classes?.class_number}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="border-2 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <ResourceTypeIcon iconKey={material.resource_types?.icon_key} className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{material.resource_types?.name}</Badge>
                          <Badge variant="outline">Class {material.classes?.class_number}</Badge>
                          {material.subjects?.name && (
                            <Badge variant="outline">{material.subjects.name}</Badge>
                          )}
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-3">
                          {material.title}
                        </h1>
                        {material.description && (
                          <p className="text-muted-foreground leading-relaxed">
                            {material.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-b border-border py-4 my-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Download className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">{material.downloads_count || 0}</p>
                            <p className="text-xs text-muted-foreground">Downloads</p>
                          </div>
                        </div>
                        
                        {material.file_size && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">{formatFileSize(material.file_size)}</p>
                              <p className="text-xs text-muted-foreground">File Size</p>
                            </div>
                          </div>
                        )}

                        {material.source && (
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">{material.source}</p>
                              <p className="text-xs text-muted-foreground">Source</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-xs">{formatDate(material.created_at)}</p>
                            <p className="text-xs text-muted-foreground">Added</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {material.tags && material.tags.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold mb-2">Tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {material.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-6">
                      <Button onClick={handleDownload} size="lg" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download Material
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => toggleFavorite(material.id)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(material.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="lg" onClick={handlePrint}>
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {relatedMaterials.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Related Materials</h2>
                    <div className="space-y-4">
                      {relatedMaterials.slice(0, 3).map((related) => (
                        <MaterialCard key={related.id} material={related} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <EduFooter />
      </div>
    </>
  );
}