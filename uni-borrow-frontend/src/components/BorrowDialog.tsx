import { useState } from 'react';
import { Equipment, BorrowRequest } from '@/lib/mockData';
import { useDataMode } from '@/contexts/DataModeContext';
import { createRequestLive } from '@/lib/requestsApi';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface BorrowDialogProps {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BorrowDialog = ({ equipment, open, onOpenChange }: BorrowDialogProps) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { mode } = useDataMode();

  const handleSubmit = () => {
    if (!user) return;
    const newRequestPartial: Partial<BorrowRequest> = {
      equipmentId: equipment.id,
      userId: user.id,
      userName: user.name,
      status: 'pending',
      requestDate: new Date().toISOString(),
      quantity,
      notes,
    };

    if (mode === 'live') {
      createRequestLive(newRequestPartial)
        .then((created) => {
          // append to local cache so UI can reflect quickly
          const existing = JSON.parse(localStorage.getItem('requests') || '[]');
          localStorage.setItem('requests', JSON.stringify([...existing, created]));
          toast({ title: 'Request submitted', description: `Your request for ${equipment.name} has been submitted.` });
          onOpenChange(false);
          setQuantity(1);
          setNotes('');
        })
        .catch(() => {
          toast({ title: 'Submission failed', description: 'Could not submit request to server', variant: 'destructive' });
        });
    } else {
      const newRequest: BorrowRequest = {
        id: Date.now().toString(),
        equipmentId: equipment.id,
        userId: user.id,
        userName: user.name,
        status: 'pending',
        requestDate: new Date().toISOString(),
        quantity,
        notes,
      };

      const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      localStorage.setItem('requests', JSON.stringify([...existingRequests, newRequest]));

      toast({
        title: "Request submitted",
        description: `Your request for ${equipment.name} has been submitted for approval.`,
      });

      onOpenChange(false);
      setQuantity(1);
      setNotes('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrow Request</DialogTitle>
          <DialogDescription>
            Submit a request to borrow {equipment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={equipment.available}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-muted-foreground">
              Available: {equipment.available}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
