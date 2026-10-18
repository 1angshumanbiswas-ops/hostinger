import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, Trash2, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const APIKeyInput = ({ name, description, isConfigured, onSave, onDelete, onTest }) => {
  const [value, setValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!isConfigured);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setIsEditing(!isConfigured);
    if (isConfigured) setValue('••••••••••••••••••••••••••••••••');
  }, [isConfigured]);

  const handleSave = async () => {
    if (!value || value === '••••••••••••••••••••••••••••••••') return;
    const success = await onSave(name, value);
    if (success) {
      setIsEditing(false);
      setValue('••••••••••••••••••••••••••••••••');
      setShowKey(false);
    }
  };

  const handleDelete = async () => {
    const success = await onDelete(name);
    if (success) {
      setIsEditing(true);
      setValue('');
    }
  };

  const handleTest = async () => {
    setTesting(true);
    await onTest(name, isEditing ? value : 'hidden_key');
    setTesting(false);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 transition-all hover:bg-slate-800">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2">
            {name}
            {isConfigured && !isEditing ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-500" />
            )}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
        <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-900/50 border border-slate-700 text-slate-300">
          {isConfigured && !isEditing ? 'Connected' : 'Not Configured'}
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <div className="relative flex-1">
          <Input
            type={showKey && isEditing ? 'text' : 'password'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (!isEditing) setIsEditing(true);
            }}
            placeholder={`Enter ${name} API Key`}
            className="bg-slate-900 border-slate-700 text-slate-100 pr-10 focus-visible:ring-indigo-500"
            disabled={!isEditing && isConfigured}
          />
          {isEditing && (
            <button 
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {isEditing ? (
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        ) : (
          <Button onClick={() => { setIsEditing(true); setValue(''); }} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 min-w-[100px]">
            Edit
          </Button>
        )}

        <Button 
          variant="outline" 
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
          onClick={handleTest}
          disabled={testing || (!isConfigured && !value)}
        >
          <Activity className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span className="sr-only sm:not-sr-only sm:ml-2">Test</span>
        </Button>

        {isConfigured && (
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default APIKeyInput;