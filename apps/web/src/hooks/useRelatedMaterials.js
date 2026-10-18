import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useRelatedMaterials(material) {
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (material?.id && material?.subject_id) {
      fetchRelatedMaterials();
    }
  }, [material?.id, material?.subject_id]);

  const fetchRelatedMaterials = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          classes(class_number),
          subjects(name),
          resource_types(name, icon_key)
        `)
        .eq('subject_id', material.subject_id)
        .neq('id', material.id)
        .limit(6)
        .order('downloads_count', { ascending: false });

      if (error) throw error;
      setRelatedMaterials(data || []);
    } catch (error) {
      console.error('Fetch related materials error:', error);
      setRelatedMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { relatedMaterials, isLoading };
}