import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Book } from '../types/Book';
import { RETURN_URL_SESSION_KEY } from '../lib/cartSession';
import {
  CartContext,
  type CartLineItem,
} from './cartContext';

const CART_STORAGE_KEY = 'hiltonbookstore-cart';

function loadCart(): CartLineItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCart(items: CartLineItem[]) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>(() => loadCart());

  useEffect(() => {
    persistCart(items);
  }, [items]);

  const addToCart = useCallback((book: Book, returnUrl: string) => {
    sessionStorage.setItem(RETURN_URL_SESSION_KEY, returnUrl);
    setItems((prev) => {
      const existing = prev.find((l) => l.bookId === book.bookID);
      if (existing) {
        return prev.map((l) =>
          l.bookId === book.bookID
            ? { ...l, quantity: l.quantity + 1 }
            : l
        );
      }
      return [
        ...prev,
        {
          bookId: book.bookID,
          title: book.title,
          author: book.author,
          price: book.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const setLineQuantity = useCallback((bookId: number, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((l) => l.bookId !== bookId));
      return;
    }
    setItems((prev) =>
      prev.map((l) =>
        l.bookId === bookId ? { ...l, quantity } : l
      )
    );
  }, []);

  const removeLine = useCallback((bookId: number) => {
    setItems((prev) => prev.filter((l) => l.bookId !== bookId));
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, l) => sum + l.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      cartTotal,
      addToCart,
      setLineQuantity,
      removeLine,
    }),
    [
      items,
      totalQuantity,
      cartTotal,
      addToCart,
      setLineQuantity,
      removeLine,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
