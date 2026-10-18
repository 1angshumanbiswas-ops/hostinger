import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import SearchAndFilterPanel from '@/components/edulearn/SearchAndFilterPanel';
import MaterialCard from '@/components/edulearn/MaterialCard';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EduResourceLibraryPage() {
  const [searchParams] = useSearchParams();
  const { materials, isLoading, filters, updateFilters, pagination, setPage } = useSearch();

  useEffect(() => {
    const initialFilters = {};
    if (searchParams.get('search')) initialFilters.searchQuery = searchParams.get('search');
    if (searchParams.get('classId')) initialFilters.classId = searchParams.get('classId');
    if (searchParams.get('subjectId')) initialFilters.subjectId = searchParams.get('subjectId');
    
    if (Object.keys(initialFilters).length > 0) {
      updateFilters(initialFilters);
    }
  }, [searchParams]);

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  return (
    <>
      <Helmet>
        <title>Resource Library - Edulearn</title>
        <meta name="description" content="Browse and download NCERT textbooks, CBSE sample papers, educational videos, and study materials for classes 6-12" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Resource <span className="text-[hsl(var(--edulearn-heading))]">Library</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Search and filter through our comprehensive collection of educational materials
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <SearchAndFilterPanel filters={filters} onFiltersChange={updateFilters} />
              </div>

              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">
                      No materials found. Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-sm text-muted-foreground">
                      Showing {materials.length} of {pagination.totalCount} materials
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {materials.map((material) => (
                        <MaterialCard key={material.id} material={material} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={pagination.page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(pagination.page + 1)}
                          disabled={pagination.page === totalPages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
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