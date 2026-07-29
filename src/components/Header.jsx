import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <button className="icon-button" aria-label="Apri menu" onClick={() => setOpen(true)}>
          <Menu size={27} strokeWidth={1.7} />
        </button>
        <Link to="/" className="brand" aria-label="REVERT home">
          <img src="/images/revert-logo.webp" alt="REVERT" />
        </Link>
        <button className="icon-button cart-icon-button" aria-label="Apri lista dei desideri" onClick={openCart}>
          <ShoppingBag size={25} strokeWidth={1.7} />
          {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
        </button>
      </header>

      <div className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-panel">
          <button className="icon-button menu-close" aria-label="Chiudi menu" onClick={() => setOpen(false)}>
            <X size={30} strokeWidth={1.6} />
          </button>
          <img className="menu-logo" src="/images/revert-logo.webp" alt="" />
          <nav className="overlay-nav">
            <NavLink to="/" onClick={() => setOpen(false)}>HOME</NavLink>
            <NavLink to="/collection" onClick={() => setOpen(false)}>COLLECTION</NavLink>
          </nav>

          <section className="menu-contacts" aria-label="Contatti">
            <p>INSTAGRAM</p>
            <a
              href="https://www.instagram.com/_revert_/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apri il profilo Instagram REVERT"
            >
              _revert_
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
