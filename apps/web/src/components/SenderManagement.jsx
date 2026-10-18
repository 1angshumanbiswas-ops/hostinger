import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, ShieldAlert, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { useWhitelistBlacklist } from '@/hooks/useWhitelistBlacklist';

const SenderList = ({ items, type, onRemove, onAdd, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({ email: '', name: '', reason: 'manual' });

  const filteredItems = items.filter(item => 
    item.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.sender_name && item.sender_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    if (!newItem.email) return;
    onAdd(newItem.email, newItem.name, newItem.reason);
    setNewItem({ email: '', name: '', reason: 'manual' });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search emails..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className={type === 'whitelist' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
              <Plus className="w-4 h-4 mr-2" /> 
              Add to {type === 'whitelist' ? 'Whitelist' : 'Blacklist'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sender to {type === 'whitelist' ? 'Whitelist' : 'Blacklist'}</DialogTitle>
              <CardDescription>
                {type === 'whitelist' 
                  ? "Emails from this sender will never be auto-deleted." 
                  : "Emails from this sender will always be flagged as junk."}
              </CardDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={newItem.email} onChange={(e) => setNewItem({...newItem, email: e.target.value})} placeholder="sender@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input id="name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} placeholder="Sender Name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Select value={newItem.reason} onValueChange={(val) => setNewItem({...newItem, reason: val})}>
                   <SelectTrigger>
                       <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                       <SelectItem value="manual">Manual Entry</SelectItem>
                       {type === 'whitelist' ? (
                           <>
                               <SelectItem value="important">Important Contact</SelectItem>
                               <SelectItem value="subscription">Valuable Subscription</SelectItem>
                           </>
                       ) : (
                           <>
                               <SelectItem value="spam">Spam / Junk</SelectItem>
                               <SelectItem value="harassment">Harassment</SelectItem>
                           </>
                       )}
                   </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
               <Button onClick={handleAdd} disabled={!newItem.email || loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Sender'}
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        {loading && items.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
                {searchTerm ? "No matching senders found." : `No senders in ${type}.`}
            </div>
        ) : (
            <div className="divide-y">
                {filteredItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col">
                             <span className="font-medium text-sm text-slate-900">{item.sender_email}</span>
                             <div className="flex gap-2 text-xs text-slate-500">
                                 {item.sender_name && <span>{item.sender_name}</span>}
                                 {item.sender_name && <span>•</span>}
                                 <span className="capitalize">{item.reason?.replace('_', ' ')}</span>
                             </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onRemove(item.sender_email)} className="text-slate-400 hover:text-red-500 h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

const SenderManagement = ({ currentAccount }) => {
  const { whitelist, blacklist, loading, addToWhitelist, removeFromWhitelist, addToBlacklist, removeFromBlacklist } = useWhitelistBlacklist(currentAccount);

  if (!currentAccount) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Sender Rules
        </CardTitle>
        <CardDescription>Manage whitelisted and blacklisted senders for <strong>{currentAccount.account_email}</strong>.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whitelist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="whitelist" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                <ShieldCheck className="w-4 h-4 mr-2" /> Whitelist ({whitelist.length})
            </TabsTrigger>
            <TabsTrigger value="blacklist" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                <ShieldAlert className="w-4 h-4 mr-2" /> Blacklist ({blacklist.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="whitelist">
            <SenderList 
                items={whitelist} 
                type="whitelist" 
                onAdd={addToWhitelist} 
                onRemove={removeFromWhitelist}
                loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="blacklist">
            <SenderList 
                items={blacklist} 
                type="blacklist" 
                onAdd={addToBlacklist} 
                onRemove={removeFromBlacklist}
                loading={loading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SenderManagement;