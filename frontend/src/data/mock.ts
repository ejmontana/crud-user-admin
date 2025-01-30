import { User, Product } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@ejemplo.com',
    role: 'admin',
    active: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Usuario Normal',
    email: 'usuario@ejemplo.com',
    role: 'user',
    active: true,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Marketing Manager',
    email: 'marketing@ejemplo.com',
    role: 'user',
    active: false,
    createdAt: '2024-01-03'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    description: 'Laptop de última generación para profesionales',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    stock: 10
  },
  {
    id: '2',
    name: 'Smartphone X',
    description: 'Teléfono inteligente con cámara de alta resolución',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    stock: 15
  },
  {
    id: '3',
    name: 'Tablet Air',
    description: 'Tablet ligera y potente para creativos',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    stock: 8
  }
];