import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function CRMHeader({ title, breadcrumbs }) {
  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 mt-14 lg:mt-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          {breadcrumbs && (
            <nav className="text-sm text-muted-foreground mb-1">
              {breadcrumbs.join(' / ')}
            </nav>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-green">{title}</h1>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>
    </header>
  );
}