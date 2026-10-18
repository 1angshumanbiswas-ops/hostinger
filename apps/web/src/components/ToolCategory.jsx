import React from 'react';
import { motion } from 'framer-motion';

const ToolCategory = ({ category, tools, index }) => {
  const Icon = category.icon;

  return (
    <motion.div
      className='flex flex-col items-center text-center group'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className='w-16 h-16 bg-[hsl(var(--dark-green-light))] rounded-2xl shadow-sm border border-[#E0E0D8] flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--dark-green))] transition-colors duration-300'>
        <Icon className={`w-8 h-8 text-[hsl(var(--dark-green))] group-hover:text-white transition-colors duration-300`} />
      </div>
      
      <h3 className='text-lg font-bold text-[hsl(var(--dark-green))] mb-1 group-hover:text-[hsl(var(--dark-green-hover))] transition-colors'>{category.name}</h3>
      <p className='text-sm text-[#555555] mb-6'>{tools.length} tools available</p>

      <ul className='space-y-2.5 w-full'>
        {tools.map((tool) => (
          <li
            key={tool.name}
            className='text-sm text-[#333333] hover:text-[hsl(var(--dark-green))] transition-colors flex items-center justify-center font-medium cursor-default'
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dark-green))] mr-2.5 opacity-60" />
            {tool.name}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ToolCategory;