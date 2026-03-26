import { createContext } from 'react';
import type { Book } from '../types/Book';

export interface CartLineItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface CartContextValue {
  items: CartLineItem[];
  totalQuantity: number;
  cartTotal: number;
  addToCart: (book: Book, returnUrl: string) => void;
  setLineQuantity: (bookId: number, quantity: number) => void;
  removeLine: (bookId: number) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
