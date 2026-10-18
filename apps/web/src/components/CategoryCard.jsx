import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const CategoryCard = ({ category, isSelected, onSelect, index }) => {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onSelect(category.id)}
      whileHover={{ scale: 1.02 }}
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group h-full flex flex-col justify-between
        ${isSelected 
          ? 'border-[hsl(var(--dark-green))] bg-[hsl(var(--dark-green-light))] shadow-md' 
          : 'border-[#E0E0D8] bg-[#F5F3F0] hover:border-[hsl(var(--dark-green))] hover:shadow-lg'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-[hsl(var(--dark-green))]" />
        </div>
      )}
      
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300
        ${isSelected ? 'bg-[hsl(var(--dark-green))]' : 'bg-[hsl(var(--dark-green-light))] group-hover:bg-[hsl(var(--dark-green))]'}
      `}>
        <Icon className={`w-6 h-6 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-[hsl(var(--dark-green))] group-hover:text-white'}`} />
      </div>
      
      <h3 className={`font-semibold transition-colors duration-300 ${isSelected ? 'text-[hsl(var(--dark-green))]' : 'text-[#333333] group-hover:text-[hsl(var(--dark-green))]'}`}>
        {category.name}
      </h3>
    </motion.div>
  );
};

export default CategoryCard;