import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EquipmentCatalog } from '@/components/EquipmentCatalog';
import { MyRequests } from '@/components/MyRequests';
import { AdminPanel } from '@/components/AdminPanel';
import { StaffPanel } from '@/components/StaffPanel';
import { Package, ClipboardList, Settings, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.name}!
          </p>
        </div>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="catalog" className="gap-2">
              <Package className="h-4 w-4" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              My Requests
            </TabsTrigger>
            {(user.role === 'staff' || user.role === 'admin') && (
              <TabsTrigger value="approvals" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Approvals
              </TabsTrigger>
            )}
            {user.role === 'admin' && (
              <TabsTrigger value="admin" className="gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            <EquipmentCatalog />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <MyRequests />
          </TabsContent>

          {(user.role === 'staff' || user.role === 'admin') && (
            <TabsContent value="approvals" className="space-y-4">
              <StaffPanel />
            </TabsContent>
          )}

          {user.role === 'admin' && (
            <TabsContent value="admin" className="space-y-4">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
