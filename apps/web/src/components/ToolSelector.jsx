import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toolsData } from '@/data/toolsData';

const ToolSelector = ({ selectedCategory, selectedTool, onSelect }) => {
  const availableTools = selectedCategory ? toolsData[selectedCategory] : [];

  const handleValueChange = (value) => {
    const tool = availableTools.find(t => t.id === value);
    if (tool) {
      onSelect(tool);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">Select Tool</label>
      <Select 
        value={selectedTool?.id} 
        onValueChange={handleValueChange}
        disabled={!selectedCategory}
      >
        <SelectTrigger className="w-full bg-white border-blue-200 focus:ring-blue-500 h-11">
          <SelectValue placeholder={selectedCategory ? "Choose a tool..." : "Select a category first"} />
        </SelectTrigger>
        <SelectContent>
          {availableTools?.length > 0 ? (
            availableTools.map((tool) => (
              <SelectItem key={tool.id} value={tool.id}>
                {tool.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-slate-500 text-center">
              {selectedCategory ? "No tools found" : "Select a category above"}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ToolSelector;