import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, ScanEye, Users } from 'lucide-react';
import ToolCategory from '@/components/ToolCategory';
import { toolsData } from '@/data/toolsData';

const categoryConfig = [
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

const AvailableTools = () => {
  return (
    <motion.div
      className='bg-[#F5F3F0] rounded-2xl shadow-xl p-12 border border-[#E0E0D8]'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className='text-3xl font-bold text-[#2D7A4A] mb-12 text-center'>Available AI Tools</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6'>
        {categoryConfig.map((category, index) => (
          <ToolCategory
            key={category.id}
            category={category}
            tools={toolsData[category.id] || []}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AvailableTools;