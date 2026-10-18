import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, Bot, Copy, Check, Share2, Download, FileImage as ImageIcon, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ToolSelector from '@/components/ToolSelector';
import { Badge } from '@/components/ui/badge';

const AIOutput = ({ selectedCategory, selectedTool, setSelectedTool, output, setOutput }) => {
  const [inputText, setInputText] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  // Mapping for readable category names
  const categoryNames = {
    'text-content': 'Text & Content',
    'image-generation': 'Image Generation',
    'image-analysis': 'Image Analysis',
    'meeting-notes': 'Meeting & Notes'
  };

  // Helper to select a relevant image based on the prompt
  const getSimulatedImage = (query) => {
    const q = query.toLowerCase();
    
    // Check for specific keywords to return relevant images
    if (q.includes('pig')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Cute pink pig in a field" src="https://images.unsplash.com/photo-1602853736377-8e8744036346" />;
    }
    if (q.includes('cat') || q.includes('kitten')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Fluffy cat" src="https://images.unsplash.com/photo-1615422732720-14ffad6d2715" />;
    }
    if (q.includes('dog') || q.includes('puppy')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Golden Retriever dog" src="https://images.unsplash.com/photo-1702573391190-85feea21409c" />;
    }
    if (q.includes('mountain') || q.includes('nature') || q.includes('landscape')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Mountain landscape" src="https://images.unsplash.com/photo-1537541366012-ea7c3c38321e" />;
    }
    if (q.includes('city') || q.includes('urban') || q.includes('building')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Futuristic city" src="https://images.unsplash.com/photo-1698897175977-f85b4b8b6d0f" />;
    }
    if (q.includes('food') || q.includes('burger') || q.includes('pizza')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Delicious food" src="https://images.unsplash.com/photo-1468071174046-657d9d351a40" />;
    }
    if (q.includes('car') || q.includes('vehicle')) {
      return <img className="w-full h-auto max-h-[400px] object-cover" alt="Sports car" src="https://images.unsplash.com/photo-1596546381135-b43a6e46a8a5" />;
    }

    // Default abstract image for generic requests
    return <img className="w-full h-auto max-h-[400px] object-cover" alt="Abstract AI Art" src="https://images.unsplash.com/photo-1624956476546-43890da15f09" />;
  };

  const handleGenerate = () => {
    if (!selectedTool) {
       toast({
        title: "Please select a tool",
        description: "You need to choose an AI tool before generating content.",
        variant: "destructive"
      });
      return;
    }

    if (!inputText.trim()) {
      toast({
        title: "Please enter your request",
        description: "Type something to get started with AI generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    // Clear previous output while generating new one
    setOutput(null);
    
    // Simulate AI generation with intelligent response based on input
    setTimeout(() => {
      let resultData;
      
      if (selectedCategory === 'image-generation') {
        // Use the helper to get a relevant image component
        resultData = {
          type: 'image',
          content: getSimulatedImage(inputText),
        };
      } else {
        // Context-aware text generation
        let textContent = '';
        const q = inputText.toLowerCase();
        
        if (q.includes('poem')) {
            textContent = `Here is a poem based on "${inputText}":\n\nIn realms of code where silicon dreams,\nA digital mind weaves endless streams.\nOf data and thought, a tapestry bright,\nCreating new worlds with pixelated light.\n\nHope this captures the essence of your request!`;
        } else if (q.includes('code') || q.includes('function') || q.includes('react')) {
            textContent = `Here's a code snippet for "${inputText}":\n\n\`\`\`javascript\nfunction solution() {\n  console.log("Processing your request...");\n  return true;\n}\n\`\`\`\n\nThis is a sample implementation. Let me know if you need specific logic!`;
        } else if (q.includes('summarize') || q.includes('summary')) {
            textContent = `Summary of request "${inputText}":\n\n• Key Point 1: The user requires concise information.\n• Key Point 2: AI processing is efficient.\n• Key Point 3: Output delivered successfully.\n\nReady for the next task!`;
        } else if (q.includes('email') || q.includes('letter')) {
            textContent = `Subject: Regarding your request\n\nDear User,\n\nI hope this email finds you well. I have processed the task you requested regarding "${inputText}". Everything looks good to go.\n\nBest regards,\nAI Assistant`;
        } else {
            textContent = `I've processed your request: "${inputText}"\n\nAnalysis:\nBased on the input provided, I have generated this response using the ${selectedTool.name} model. The query appears to be general in nature.\n\nResult:\nThis is a simulated response. In a production environment, this text would be generated by the actual LLM API. The interface handles the request gracefully and displays this placeholder text to demonstrate functionality.\n\nFeel free to try specific prompts like "Write a poem", "Generate code", or "Write an email"!`;
        }

        resultData = {
          type: 'text',
          content: textContent,
        };
      }

      setOutput({
        ...resultData,
        tool: selectedTool,
        input: inputText,
        timestamp: new Date().toISOString()
      });
      setIsGenerating(false);
      
      toast({
        title: "✨ Content generated successfully!",
        description: "Your AI-powered result is ready below."
      });
    }, 2000);
  };

  const handleCopy = () => {
    if (output && output.type === 'text') {
      navigator.clipboard.writeText(output.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Text content copied successfully."
      });
    }
  };

  return (
    <motion.div
      className='bg-white rounded-xl p-6 flex flex-col h-full border border-slate-200 shadow-sm relative overflow-hidden'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
        <Bot className="w-6 h-6 text-blue-600" />
        AI Workspace
      </h2>
      
      <div className='flex-1 flex flex-col gap-6'>
        <ToolSelector 
          selectedCategory={selectedCategory}
          selectedTool={selectedTool}
          onSelect={setSelectedTool}
        />

        {/* Selected Tool Display Box */}
        <AnimatePresence>
          {selectedTool && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 overflow-hidden"
            >
              <div className="bg-blue-100 p-2 rounded-full mt-0.5 shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Active Tool</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-white border-blue-200 text-slate-500 font-normal whitespace-nowrap">
                    {categoryNames[selectedCategory] || 'General'}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {selectedTool.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to process your request using the {selectedTool.name} model.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='space-y-2 flex-1'>
          <div className="flex justify-between items-center">
             <label className='text-sm font-medium text-slate-700'>
              {selectedTool ? `Instructions for ${selectedTool.name}` : 'Your Request'}
            </label>
            {inputText && (
              <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-slate-600 px-2" onClick={() => setInputText('')}>
                Clear
              </Button>
            )}
          </div>
          <Textarea
            placeholder={selectedTool ? `Describe what you want ${selectedTool.name} to do...` : "Select a category and tool above to get started..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className='min-h-[120px] resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-base'
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedTool || !inputText.trim()}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white h-12 shadow-lg shadow-blue-600/20 transition-all duration-300 rounded-lg text-base font-medium'
        >
          {isGenerating ? (
            <>
              <motion.div
                className='w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2'
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className='w-5 h-5 mr-2' />
              Generate Content
            </>
          )}
        </Button>

        {/* Output Display Section */}
        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border-t-2 border-slate-100 pt-6 mt-2"
            >
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {output.type === 'image' ? <ImageIcon className="w-4 h-4 text-purple-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {output.type === 'image' ? 'Generated Image' : 'Generated Text'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {output.type === 'text' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500" onClick={() => setOutput(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-5">
                   {output.type === 'image' ? (
                     <div className="rounded-lg overflow-hidden bg-slate-200 border border-slate-300 relative group">
                        {/* We now render the content directly as it is a React Element (the image) */}
                        {output.content}
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-slate-900 pointer-events-none">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                           </Button>
                        </div>
                     </div>
                   ) : (
                     <div className="prose prose-sm max-w-none text-slate-700">
                        <p className="whitespace-pre-wrap leading-relaxed">{output.content}</p>
                     </div>
                   )}
                </div>
                
                <div className="bg-slate-100/50 px-4 py-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                   <span>Model: {output.tool?.name || 'Unknown'}</span>
                   <span>{new Date(output.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AIOutput;