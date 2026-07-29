import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { buildOrderMessage, copyOrderToClipboard, openInstagramDm } from "../utils/instagramOrder";

export default function Product() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [justOrdered, setJustOrdered] = useState(false);
  const { addItem } = useCart();

  if (!product) return <Navigate to="/collection" replace />;

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const hasGallery = gallery.length > 1;
  const currentImage = gallery[imageIndex];
  const related = products
    .filter((item) => item.slug !== slug && !item.hidden)
    .slice(0, 2);

  const previousImage = () => {
    setImageIndex((current) => (current - 1 + gallery.length) % gallery.length);
  };

  const nextImage = () => {
    setImageIndex((current) => (current + 1) % gallery.length);
  };

  const handleOrderOnInstagram = async () => {
    const message = buildOrderMessage([{ title: product.title, qty }]);
    await copyOrderToClipboard(message);
    setJustOrdered(true);
    setJustAdded(false);
    openInstagramDm();
  };

  return (
    <div className="page-shell desktop-site">
      <Seo
        title={product.title}
        description={`${product.title}: ${product.description}. Scopri il capo REVERT e contatta _revert_ su Instagram.`}
        image={product.image}
        path={`/product/${product.slug}`}
        product={product}
      />
      <Header />
      <main className="product-detail">
        <section className={`product-hero ${hasGallery ? "has-gallery" : ""}`}>
          {hasGallery && (
            <button className="gallery-arrow gallery-arrow-left" onClick={previousImage} aria-label="Immagine precedente">
              <ChevronLeft size={48} strokeWidth={1.8} />
            </button>
          )}

          <img src={currentImage} alt={`${product.title} ${imageIndex + 1}`} />

          {hasGallery && (
            <button className="gallery-arrow gallery-arrow-right" onClick={nextImage} aria-label="Immagine successiva">
              <ChevronRight size={48} strokeWidth={1.8} />
            </button>
          )}
        </section>

        <section className="product-copy">
          <h1>{product.title}</h1>
          <p>-{product.description}</p>
          {hasGallery && <p className="gallery-count">{imageIndex + 1} / {gallery.length}</p>}

          <div className="add-to-cart-row">
            <div className="qty-stepper">
              <button type="button" aria-label="Diminuisci quantità" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus size={14} strokeWidth={2} />
              </button>
              <span>{qty}</span>
              <button type="button" aria-label="Aumenta quantità" onClick={() => setQty((q) => q + 1)}>
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>

            <button
              className="add-to-cart-button"
              type="button"
              onClick={() => {
                addItem(product, qty);
                setJustAdded(true);
                setJustOrdered(false);
                setQty(1);
              }}
            >
              AGGIUNGI ALLA LISTA DEI DESIDERI
            </button>
          </div>

          <button
            className="order-ig-button"
            type="button"
            onClick={handleOrderOnInstagram}
          >
            DM INSTAGRAM
          </button>

          {justAdded && (
            <p className="add-to-cart-confirm" role="status">
              Aggiunto alla lista dei desideri ✓
            </p>
          )}

          {justOrdered && (
            <p className="add-to-cart-confirm" role="status">
              Messaggio copiato — incollalo nella chat Instagram ✓
            </p>
          )}
        </section>

        <section className="related-section">
          <h2>Altri prodotti:</h2>
          <div className="product-grid related-grid">
            {related.map((item) => <ProductCard key={item.slug} product={item} compact />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
