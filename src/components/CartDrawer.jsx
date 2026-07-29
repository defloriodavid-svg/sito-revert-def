import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { buildOrderMessage, copyOrderToClipboard, openInstagramDm } from "../utils/instagramOrder";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem } = useCart();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  const handleOrder = async () => {
    const message = buildOrderMessage(items);
    const ok = await copyOrderToClipboard(message);
    setCopied(ok);
    openInstagramDm();
  };

  return (
    <div className="cart-overlay" role="dialog" aria-label="Lista dei desideri" aria-modal="true">
      <button className="cart-backdrop" aria-label="Chiudi lista dei desideri" onClick={closeCart} />

      <div className="cart-panel">
        <div className="cart-panel-head">
          <h2>LISTA DEI DESIDERI</h2>
          <button className="icon-button" aria-label="Chiudi lista dei desideri" onClick={closeCart}>
            <X size={26} strokeWidth={1.7} />
          </button>
        </div>

        {isEmpty ? (
          <div className="cart-empty" aria-label="Lista dei desideri vuota">
            <ShoppingBag size={40} strokeWidth={1.3} />
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.slug}>
                  <img src={item.image} alt={item.title} />
                  <div className="cart-item-info">
                    <p className="cart-item-title">{item.title}</p>
                    <div className="cart-qty">
                      <button type="button" aria-label="Diminuisci quantità" onClick={() => updateQty(item.slug, item.qty - 1)}>
                        <Minus size={14} strokeWidth={2} />
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Aumenta quantità" onClick={() => updateQty(item.slug, item.qty + 1)}>
                        <Plus size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <button className="cart-item-remove" type="button" aria-label={`Rimuovi ${item.title}`} onClick={() => removeItem(item.slug)}>
                    <Trash2 size={18} strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <button className="cart-order-button" type="button" onClick={handleOrder}>
                DM INSTAGRAM
              </button>
              {copied && (
                <p className="cart-copy-note" role="status">
                  Messaggio copiato — incollalo nella chat Instagram ✓
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
