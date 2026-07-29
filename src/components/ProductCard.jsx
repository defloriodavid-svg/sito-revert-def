import { Link } from "react-router-dom";

export default function ProductCard({ product, compact = false }) {
  const destination = product.linkSlug || product.slug;

  return (
    <article className={`product-card product-card-reveal ${compact ? "is-compact" : ""}`}>
      <Link to={`/product/${destination}`}>
        <div className="product-image-wrap">
          <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
        </div>
        <h2>{product.title}</h2>
      </Link>
    </article>
  );
}
