import { useState, useEffect } from 'react';
import { Equipment, mockEquipment } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AdminPanel = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    category: '',
    condition: 'good',
    quantity: 1,
    available: 1,
    description: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('equipment');
    setEquipment(stored ? JSON.parse(stored) : mockEquipment);
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Validation error",
        description: "Name and category are required",
        variant: "destructive",
      });
      return;
    }

    let updatedEquipment: Equipment[];

    if (editingItem) {
      updatedEquipment = equipment.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } as Equipment : item
      );
      toast({
        title: "Equipment updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newItem: Equipment = {
        id: Date.now().toString(),
        name: formData.name!,
        category: formData.category!,
        condition: formData.condition as any,
        quantity: formData.quantity!,
        available: formData.available!,
        description: formData.description,
      };
      updatedEquipment = [...equipment, newItem];
      toast({
        title: "Equipment added",
        description: `${formData.name} has been added successfully.`,
      });
    }

    setEquipment(updatedEquipment);
    localStorage.setItem('equipment', JSON.stringify(updatedEquipment));
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const updatedEquipment = equipment.filter(item => item.id !== id);
    setEquipment(updatedEquipment);
    localStorage.setItem('equipment', JSON.stringify(updatedEquipment));
    toast({
      title: "Equipment deleted",
      description: "The equipment has been removed.",
    });
  };

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      condition: 'good',
      quantity: 1,
      available: 1,
      description: '',
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-success/10 text-success border-success/20';
      case 'good': return 'bg-primary/10 text-primary border-primary/20';
      case 'fair': return 'bg-warning/10 text-warning border-warning/20';
      case 'poor': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Equipment Management</h3>
          <p className="text-muted-foreground">Add, edit, or remove equipment</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update equipment details' : 'Add a new item to the inventory'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Equipment name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Computers, Lab Equipment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value as any })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Total Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available">Available</Label>
                  <Input
                    id="available"
                    type="number"
                    min={0}
                    max={formData.quantity}
                    value={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Update' : 'Add'} Equipment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="mt-1">{item.category}</CardDescription>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getConditionColor(item.condition)}>
                  {item.condition}
                </Badge>
                <Badge variant="outline">
                  {item.available}/{item.quantity} Available
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No equipment in inventory</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
