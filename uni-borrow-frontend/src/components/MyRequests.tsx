import { useState, useEffect } from 'react';
import { BorrowRequest, Equipment, mockRequests, mockEquipment } from '@/lib/mockData';
import { useDataMode } from '@/contexts/DataModeContext';
import { listRequestsLive } from '@/lib/requestsApi';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

export const MyRequests = () => {
  const { user } = useAuth();
  const { mode } = useDataMode();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const storedRequests = localStorage.getItem('requests');
    const storedEquipment = localStorage.getItem('equipment');
    const load = async () => {
      if (mode === 'live') {
        try {
          const live = await listRequestsLive();
          setRequests(live);
        } catch (e) {
          // fallback to stored or mock
          setRequests(storedRequests ? JSON.parse(storedRequests) : mockRequests);
        }
      } else {
        setRequests(storedRequests ? JSON.parse(storedRequests) : mockRequests);
      }
    };

    load();
    setEquipment(storedEquipment ? JSON.parse(storedEquipment) : mockEquipment);
  }, [mode]);

  const myRequests = requests.filter(req => req.userId === user?.id);

  const getEquipmentName = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId)?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'returned': return 'bg-muted text-muted-foreground border-muted';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-foreground">My Requests</h3>
        <p className="text-muted-foreground">Track your equipment borrow requests</p>
      </div>

      {myRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myRequests.map(request => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      {getEquipmentName(request.equipmentId)}
                    </CardTitle>
                    <CardDescription>
                      Requested on {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{request.quantity}</p>
                  </div>
                  {request.approvedDate && (
                    <div>
                      <p className="text-muted-foreground">Approved On</p>
                      <p className="font-medium">
                        {format(new Date(request.approvedDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                  {request.approvedBy && (
                    <div>
                      <p className="text-muted-foreground">Approved By</p>
                      <p className="font-medium">{request.approvedBy}</p>
                    </div>
                  )}
                  {request.returnDate && (
                    <div>
                      <p className="text-muted-foreground">Returned On</p>
                      <p className="font-medium">
                        {format(new Date(request.returnDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
                {request.notes && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{request.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
