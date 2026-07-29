import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { products } from "../data/products";

export default function Home() {
  const featuredProduct = products.find((product) => product.slug === "solucion-plaza");
  const visibleProducts = products.filter(
    (product) => product.slug !== "solucion-plaza" && !product.hidden
  );

  const spotlightOrder = [
    "giorgio-amici-tanto-2026-black",
    "partypills",
    "longsleeve",
    "skull-v2-purple",
  ];

  const spotlightProducts = spotlightOrder
    .map((slug) => visibleProducts.find((product) => product.slug === slug))
    .filter(Boolean);

  const remainingProducts = visibleProducts.filter(
    (product) => !spotlightOrder.includes(product.slug)
  );

  return (
    <div className="page-shell desktop-site">
      <Seo
        title="Streetwear italiano"
        description="REVERT: streetwear italiano con t-shirt grafiche, longsleeve e trucker hat. Scopri la collezione e contatta _revert_ su Instagram."
        path="/"
      />
      <Header />
      <main className="home-page">
        <section className="showcase-layout" aria-label="Featured products">
          {featuredProduct && (
            <Link
              to={`/product/${featuredProduct.slug}`}
              className="showcase-featured"
            >
              <div className="showcase-featured-media">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.title}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="showcase-featured-copy">
                <span className="product-badge">NEW</span>
                <p>FEATURED DROP</p>
                <h1>{featuredProduct.title}</h1>
                <span className="showcase-button">VIEW PRODUCT <b>→</b></span>
              </div>
            </Link>
          )}

          <div className="showcase-side-grid">
            {spotlightProducts.map((product) => (
              <Link
                key={product.slug}
                to={`/product/${product.slug}`}
                className="showcase-square"
              >
                <div className="showcase-square-media">
                  <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
                </div>
                <div className="showcase-square-copy">
                  <h2>{product.title}</h2>
                  <span>DISCOVER →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {remainingProducts.length > 0 && (
          <section className="more-products-section">
            <div className="section-heading">
              <h2>MORE PIECES</h2>
            </div>
            <div className="product-grid home-grid">
              {remainingProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
