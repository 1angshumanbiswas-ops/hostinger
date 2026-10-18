import React from 'react';
import { Book, FileText, Star, FlaskRound as Flask, Video, FileCheck, HelpCircle, BookOpen } from 'lucide-react';

const iconMap = {
  'book': Book,
  'file-text': FileText,
  'star': Star,
  'flask': Flask,
  'video': Video,
  'file-check': FileCheck,
  'help-circle': HelpCircle,
  'book-open': BookOpen
};

export default function ResourceTypeIcon({ iconKey, className = "w-5 h-5" }) {
  const Icon = iconMap[iconKey] || Book;
  return <Icon className={className} />;
}