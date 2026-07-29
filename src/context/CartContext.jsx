import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "revert-cart-v1";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private browsing, etc). The cart still
      // works for the current page load even if it can't persist.
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === product.slug);
      if (existing) {
        return current.map((item) =>
          item.slug === product.slug ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...current,
        {
          slug: product.slug,
          title: product.title,
          image: product.image,
          qty,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (slug) => {
    setItems((current) => current.filter((item) => item.slug !== slug));
  };

  const updateQty = (slug, qty) => {
    if (qty < 1) {
      removeItem(slug);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.slug === slug ? { ...item, qty } : item))
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalCount,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
