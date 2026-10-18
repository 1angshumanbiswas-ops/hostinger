import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <motion.h1
      className='text-2xl font-bold text-[#F5F3F0] leading-8 w-full drop-shadow-md'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      Let's turn your ideas into reality
    </motion.h1>
  );
};

export default CallToAction;