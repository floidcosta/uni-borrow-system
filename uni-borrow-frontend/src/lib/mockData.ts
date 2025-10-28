export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  quantity: number;
  available: number;
  description?: string;
  imageUrl?: string;
}

export interface BorrowRequest {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  requestDate: string;
  approvedDate?: string;
  returnDate?: string;
  approvedBy?: string;
  quantity: number;
  notes?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@school.edu',
    password: 'student123',
    name: 'John Student',
    role: 'student'
  },
  {
    id: '2',
    email: 'staff@school.edu',
    password: 'staff123',
    name: 'Jane Staff',
    role: 'staff'
  },
  {
    id: '3',
    email: 'admin@school.edu',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

// Mock Equipment
export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    category: 'Computers',
    condition: 'excellent',
    quantity: 10,
    available: 7,
    description: 'High-performance laptop for programming and design work'
  },
  {
    id: '2',
    name: 'iPad Pro 12.9"',
    category: 'Tablets',
    condition: 'good',
    quantity: 15,
    available: 12,
    description: 'Perfect for digital art and presentations'
  },
  {
    id: '3',
    name: 'Scientific Calculator',
    category: 'Calculators',
    condition: 'excellent',
    quantity: 50,
    available: 45,
    description: 'Texas Instruments TI-84 Plus'
  },
  {
    id: '4',
    name: 'DSLR Camera Canon',
    category: 'Photography',
    condition: 'good',
    quantity: 5,
    available: 3,
    description: 'Professional camera for photography projects'
  },
  {
    id: '5',
    name: 'Projector Epson',
    category: 'Presentation',
    condition: 'excellent',
    quantity: 8,
    available: 6,
    description: 'HD projector for presentations'
  },
  {
    id: '6',
    name: 'Arduino Starter Kit',
    category: 'Electronics',
    condition: 'good',
    quantity: 20,
    available: 18,
    description: 'Complete kit for electronics projects'
  },
  {
    id: '7',
    name: 'Microscope Olympus',
    category: 'Lab Equipment',
    condition: 'excellent',
    quantity: 12,
    available: 10,
    description: 'Advanced microscope for biology lab'
  },
  {
    id: '8',
    name: 'VR Headset Meta Quest',
    category: 'Virtual Reality',
    condition: 'good',
    quantity: 6,
    available: 4,
    description: 'Virtual reality headset for immersive learning'
  }
];

// Mock Borrow Requests
export const mockRequests: BorrowRequest[] = [
  {
    id: '1',
    equipmentId: '1',
    userId: '1',
    userName: 'John Student',
    status: 'pending',
    requestDate: new Date().toISOString(),
    quantity: 1,
    notes: 'Need for final year project'
  },
  {
    id: '2',
    equipmentId: '4',
    userId: '1',
    userName: 'John Student',
    status: 'approved',
    requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approvedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'Jane Staff',
    quantity: 1,
    notes: 'Photography assignment'
  }
];

export const categories = [
  'All',
  'Computers',
  'Tablets',
  'Calculators',
  'Photography',
  'Presentation',
  'Electronics',
  'Lab Equipment',
  'Virtual Reality'
];
