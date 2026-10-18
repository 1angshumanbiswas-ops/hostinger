import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Shared Pagination Registry for all 5 ERP pages
export const HR_PAGES = [
  { path: '/erp', title: 'HR Dashboard', pageNumber: 1 },
  { path: '/erp/employees', title: 'Employees', pageNumber: 2 },
  { path: '/erp/finance', title: 'Financial Health', pageNumber: 3 },
  { path: '/erp/crm', title: 'CRM Manager', pageNumber: 4 },
  { path: '/erp/scm', title: 'SCM Logistics', pageNumber: 5 }
];

export default function HRPortalLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find current page based on pathname
  const currentPageData = HR_PAGES.find(p => p.path === location.pathname);
  const currentPageNumber = currentPageData?.pageNumber || 1;
  const currentPageTitle = currentPageData?.title || 'HR Dashboard';
  const totalPages = HR_PAGES.length;

  // Get previous and next pages
  const prevPage = HR_PAGES.find(p => p.pageNumber === currentPageNumber - 1);
  const nextPage = HR_PAGES.find(p => p.pageNumber === currentPageNumber + 1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 relative">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1f5233] rounded-md flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Angshuman AI Corp ERP</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Exit Portal
          </Button>
        </div>
      </header>

      <main>
        {children}
      </main>

      {/* Universal Pagination Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => prevPage && navigate(prevPage.path)}
            disabled={!prevPage}
            className={`flex items-center gap-2 ${
              !prevPage 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                : 'border-gray-300 text-slate-700 hover:bg-slate-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Page {currentPageNumber} of {totalPages}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentPageTitle}
            </span>
          </div>

          <Button
            onClick={() => nextPage && navigate(nextPage.path)}
            disabled={!nextPage}
            className={`flex items-center gap-2 ${
              !nextPage 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-[#1f5233] text-white hover:bg-[#173d26]'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}