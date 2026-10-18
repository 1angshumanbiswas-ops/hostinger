import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useSearch(initialFilters = {}) {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: '',
    classId: '',
    subjectId: '',
    resourceTypeId: '',
    source: '',
    sortBy: 'newest',
    ...initialFilters
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalCount: 0
  });

  useEffect(() => {
    searchMaterials();
  }, [filters, pagination.page]);

  const searchMaterials = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('materials')
        .select(`
          *,
          classes(class_number),
          subjects(name),
          resource_types(name, icon_key)
        `, { count: 'exact' });

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
      
      if (filters.classId) {
        query = query.eq('class_id', filters.classId);
      }
      
      if (filters.subjectId) {
        query = query.eq('subject_id', filters.subjectId);
      }
      
      if (filters.resourceTypeId) {
        query = query.eq('resource_type_id', filters.resourceTypeId);
      }
      
      if (filters.source) {
        query = query.ilike('source', `%${filters.source}%`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'downloads':
          query = query.order('downloads_count', { ascending: false });
          break;
        case 'alphabetical':
          query = query.order('title', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setMaterials(data || []);
      setPagination(prev => ({ ...prev, totalCount: count || 0 }));
    } catch (error) {
      console.error('Search materials error:', error);
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const setPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return {
    materials,
    isLoading,
    filters,
    updateFilters,
    pagination,
    setPage,
    refetch: searchMaterials
  };
}