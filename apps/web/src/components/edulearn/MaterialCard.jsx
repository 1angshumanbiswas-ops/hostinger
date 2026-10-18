import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResourceTypeIcon from './ResourceTypeIcon';
import { useFavorites } from '@/hooks/useFavorites';
import { useDownloadTracking } from '@/hooks/useDownloadTracking';
import { useToast } from '@/hooks/use-toast';

export default function MaterialCard({ material }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { logDownload } = useDownloadTracking();
  const { toast } = useToast();

  const handleDownload = async (e) => {
    e.stopPropagation();
    
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
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    await toggleFavorite(material.id);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-primary/50 overflow-hidden"
      onClick={() => navigate(`/edulearn/material/${material.id}`)}
    >
      <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ResourceTypeIcon iconKey={material.resource_types?.icon_key} className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {material.resource_types?.name || 'Material'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite(material.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <h3 className="font-bold text-base text-[hsl(var(--edulearn-heading))] mb-2 line-clamp-2 group-hover:text-[hsl(var(--edulearn-heading-hover))] transition-colors">
          {material.title}
        </h3>

        {material.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {material.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="outline" className="text-xs">
            Class {material.classes?.class_number}
          </Badge>
          {material.subjects?.name && (
            <Badge variant="outline" className="text-xs">
              {material.subjects.name}
            </Badge>
          )}
          {material.source && (
            <Badge variant="outline" className="text-xs">
              {material.source}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {material.downloads_count || 0}
            </span>
            {material.file_size && (
              <span>{formatFileSize(material.file_size)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant="default"
            className="h-8 bg-[hsl(var(--edulearn-heading))] hover:bg-[hsl(var(--edulearn-heading-hover))] text-white"
            onClick={handleDownload}
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}