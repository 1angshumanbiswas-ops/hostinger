import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow, format } from 'date-fns';
import { Copy, Mail, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function AbandonedCartDetailsModal({ isOpen, onClose, cart, onRefresh }) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  if (!cart) return null;

  const recoveryLink = `${window.location.origin}/recover-cart/${cart.recovery_token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(recoveryLink);
    toast({ title: 'Copied', description: 'Recovery link copied to clipboard.' });
  };

  const handleResendEmail = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-cart-abandonment-email', {
        body: JSON.stringify({
          cartId: cart.id,
          customerName: cart.customer_name,
          customerEmail: cart.customer_email,
          cartItems: cart.items,
          cartTotal: cart.cart_value,
          recoveryLink,
          abandonedAt: cart.abandoned_at
        })
      });
      if (error || !data?.success) throw new Error('Email failed');
      
      await supabase.from('abandoned_carts').update({ notification_sent_at: new Date().toISOString() }).eq('id', cart.id);
      toast({ title: 'Success', description: 'Recovery email sent manually.' });
      if (onRefresh) onRefresh();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to send email.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkRecovered = async () => {
    try {
      await supabase.from('abandoned_carts').update({ recovered: true, recovered_at: new Date().toISOString(), status: 'recovered' }).eq('id', cart.id);
      toast({ title: 'Success', description: 'Cart marked as recovered.' });
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update cart.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center pr-6">
            <span>Cart Details</span>
            {cart.recovered ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Recovered</Badge>
            ) : (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100"><Clock className="w-3 h-3 mr-1"/> Abandoned</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            ID: {cart.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-slate-50 rounded-lg border">
          <div>
            <p className="text-sm text-slate-500">Customer</p>
            <p className="font-semibold text-slate-900">{cart.customer_name || 'Guest'}</p>
            <p className="text-sm text-slate-600">{cart.customer_email || 'No email'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Abandonment Time</p>
            <p className="font-semibold text-slate-900">{cart.abandoned_at ? format(new Date(cart.abandoned_at), 'PPpp') : 'Unknown'}</p>
            <p className="text-sm text-slate-600">
              {cart.abandoned_at ? `${formatDistanceToNow(new Date(cart.abandoned_at))} ago` : ''}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900">Cart Items</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(cart.items || []).map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.name || item.title || 'Unknown Item'}</TableCell>
                  <TableCell className="text-center">{item.quantity || 1}</TableCell>
                  <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(Number(item.price) * (item.quantity || 1)).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end pt-4 font-bold text-lg border-t">
            Total Value: ${cart.cart_value}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-slate-900">Recovery Status</h4>
          <div className="text-sm bg-blue-50 p-3 rounded-md text-blue-800 space-y-1">
            <p><strong>Notification Sent:</strong> {cart.notification_sent_at ? format(new Date(cart.notification_sent_at), 'PPpp') : 'Not sent yet'}</p>
            <p><strong>Token Expires:</strong> {cart.token_expires_at ? format(new Date(cart.token_expires_at), 'PPp') : 'N/A'}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}><Copy className="w-4 h-4 mr-2"/> Copy Link</Button>
            {!cart.recovered && (
              <>
                <Button variant="outline" size="sm" onClick={handleResendEmail} disabled={isSending}>
                  <Mail className="w-4 h-4 mr-2"/> {isSending ? 'Sending...' : 'Resend Email'}
                </Button>
                <Button size="sm" onClick={handleMarkRecovered} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2"/> Mark Recovered
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}