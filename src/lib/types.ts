export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  vendorName: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}
