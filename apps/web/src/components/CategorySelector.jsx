import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, ScanEye, Users } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';

const categories = [
  {
    id: 'text-content',
    name: 'Text & Content',
    icon: FileText
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    icon: Image
  },
  {
    id: 'image-analysis',
    name: 'Image Analysis',
    icon: ScanEye
  },
  {
    id: 'meeting-notes',
    name: 'Meeting & Notes',
    icon: Users
  }
];

const CategorySelector = ({ selectedCategory, setSelectedCategory, setSelectedTool }) => {
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedTool(null);
  };

  return (
    <div className='bg-transparent p-1'>
      <h2 className='text-lg font-bold text-[hsl(var(--dark-green))] mb-4'>Select AI Category</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onSelect={handleCategorySelect}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;