
import type { Vendor, Transaction, Product } from './types';

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Bombay Chaatwala',
    description: 'Authentic Indian street food, bursting with flavor. A campus favorite for a spicy kick!',
    image: 'https://picsum.photos/600/400',
    imageHint: 'indian street food',
    products: [
      { id: '101', name: 'Vegetable Samosa', price: 2.25, stock: 60 },
      { id: '102', name: 'Pani Puri', price: 5.00, stock: 40 },
      { id: '103', name: 'Mango Lassi', price: 4.50, stock: 35 },
      { id: '104', name: 'Chai Tea', price: 2.50, stock: 50 },
    ],
  },
  {
    id: '2',
    name: 'Lee Corner',
    description: 'Your campus convenience store for quick bites, drinks, and study essentials.',
    image: 'https://picsum.photos/600/400',
    imageHint: 'convenience store',
    products: [
      { id: '201', name: 'Energy Drink', price: 3.50, stock: 100 },
      { id: '202', name: 'Protein Bar', price: 2.75, stock: 80 },
      { id: '203', name: 'Bag of Chips', price: 1.50, stock: 120 },
      { id: '204', name: 'Instant Noodles', price: 2.00, stock: 90 },
    ],
  },
  {
    id: '3',
    name: 'Samosa Spot',
    description: 'Authentic, flavorful samosas and Indian street food. A campus favorite!',
    image: 'https://picsum.photos/600/400',
    imageHint: 'samosas food',
    products: [
      { id: '301', name: 'Vegetable Samosa', price: 2.00, stock: 75 },
      { id: '302', name: 'Chicken Samosa', price: 2.50, stock: 50 },
      { id: '303', name: 'Mango Lassi', price: 4.00, stock: 30 },
      { id: '304', name: 'Chai Tea', price: 2.50, stock: 45 },
    ],
  },
  {
    id: '4',
    name: 'Fruit Shop',
    description: 'Fresh and juicy fruits, smoothies, and healthy juices.',
    image: 'https://picsum.photos/600/400',
    imageHint: 'fresh fruit',
    products: [
      { id: '401', name: 'Banana', price: 0.50, stock: 150 },
      { id: '402', name: 'Orange Juice', price: 3.50, stock: 50 },
      { id: '403', name: 'Fruit Salad', price: 5.00, stock: 30 },
      { id: '404', name: 'Berry Smoothie', price: 6.00, stock: 25 },
    ],
  },
];

export const transactions: Transaction[] = [
  {
    id: 't1',
    vendorName: 'Bombay Chaatwala',
    date: '2024-05-20',
    items: [
      { name: 'Pani Puri', quantity: 1, price: 5.00 },
      { name: 'Chai Tea', quantity: 1, price: 2.50 },
    ],
    total: 7.50,
  },
  {
    id: 't2',
    vendorName: 'Samosa Spot',
    date: '2024-05-18',
    items: [
      { name: 'Vegetable Samosa', quantity: 2, price: 2.00 },
      { name: 'Mango Lassi', quantity: 1, price: 4.00 },
    ],
    total: 8.00,
  },
  {
    id: 't3',
    vendorName: 'Lee Corner',
    date: '2024-05-15',
    items: [
      { name: 'Energy Drink', quantity: 2, price: 3.50 },
      { name: 'Protein Bar', quantity: 1, price: 2.75 },
    ],
    total: 9.75,
  },
];

export const user = {
    name: 'Alex Doe',
    email: 'alex.doe@university.edu',
}
