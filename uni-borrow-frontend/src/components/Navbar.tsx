import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useDataMode } from '@/contexts/DataModeContext';
import { LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, setMode } = useDataMode();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">UniBorrow</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="sm" variant={mode === 'mock' ? 'outline' : 'ghost'} onClick={() => setMode('mock')}>
              Mock
            </Button>
            <Button size="sm" variant={mode === 'live' ? 'outline' : 'ghost'} onClick={() => setMode('live')}>
              Live
            </Button>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-muted-foreground capitalize">{user.role}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
