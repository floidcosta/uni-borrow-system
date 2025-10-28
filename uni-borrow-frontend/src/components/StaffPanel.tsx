import { useState, useEffect } from 'react';
import { BorrowRequest, Equipment, mockRequests, mockEquipment } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, X, Check, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export const StaffPanel = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedRequests = localStorage.getItem('requests');
    const storedEquipment = localStorage.getItem('equipment');
    
    setRequests(storedRequests ? JSON.parse(storedRequests) : mockRequests);
    setEquipment(storedEquipment ? JSON.parse(storedEquipment) : mockEquipment);
  };

  const getEquipmentName = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId)?.name || 'Unknown';
  };

  const handleApprove = (requestId: string) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        // Update equipment availability
        const updatedEquipment = equipment.map(eq => {
          if (eq.id === req.equipmentId) {
            return { ...eq, available: eq.available - req.quantity };
          }
          return eq;
        });
        setEquipment(updatedEquipment);
        localStorage.setItem('equipment', JSON.stringify(updatedEquipment));

        return {
          ...req,
          status: 'approved' as const,
          approvedDate: new Date().toISOString(),
          approvedBy: user?.name,
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Request approved",
      description: "The borrow request has been approved.",
    });
  };

  const handleReject = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'rejected' as const, approvedBy: user?.name }
        : req
    );

    setRequests(updatedRequests);
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Request rejected",
      description: "The borrow request has been rejected.",
      variant: "destructive",
    });
  };

  const handleMarkReturned = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Update equipment availability
    const updatedEquipment = equipment.map(eq => {
      if (eq.id === request.equipmentId) {
        return { ...eq, available: eq.available + request.quantity };
      }
      return eq;
    });
    setEquipment(updatedEquipment);
    localStorage.setItem('equipment', JSON.stringify(updatedEquipment));

    const updatedRequests = requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'returned' as const, returnDate: new Date().toISOString() }
        : req
    );

    setRequests(updatedRequests);
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Marked as returned",
      description: "The equipment has been marked as returned.",
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const activeRequests = requests.filter(r => r.status === 'approved');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground">Request Management</h3>
        <p className="text-muted-foreground">Approve or reject borrow requests</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Pending Requests</h4>
        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(request => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        {getEquipmentName(request.equipmentId)}
                      </CardTitle>
                      <CardDescription>
                        Requested by {request.userName} on{' '}
                        {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{request.quantity}</p>
                    </div>
                  </div>
                  {request.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm">{request.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(request.id)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Active Loans</h4>
        {activeRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active loans</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeRequests.map(request => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        {getEquipmentName(request.equipmentId)}
                      </CardTitle>
                      <CardDescription>
                        Borrowed by {request.userName}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{request.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Approved On</p>
                      <p className="font-medium">
                        {request.approvedDate && format(new Date(request.approvedDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkReturned(request.id)}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Mark as Returned
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
