// import { Category } from './category.model';
import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: 'AVAILABLE' | 'SOLD';
  imageUrl?: string;
  category: Category;
  sellerAddress: string; // 
  sellerPhone?: string;
}
