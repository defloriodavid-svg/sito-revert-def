import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { categories, products } from "../data/products";

const categoryLabels = {
  All: "All",
  Longsleeve: "Longsleeve",
  Trucker: "Trucker Hats",
};

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("category") || "All";
  const active = categories.includes(requested) ? requested : "All";

  const visible = useMemo(
    () => (active === "All" ? products.filter((p) => !p.hidden) : products.filter((p) => !p.hidden && p.category === active)),
    [active],
  );

  const changeCategory = (category) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="page-shell desktop-site">
      <Seo
        title={active === "All" ? "Collection" : `${categoryLabels[active]} — Collection`}
        description={`Esplora la collezione REVERT: ${categoryLabels[active].toLowerCase()}. Streetwear italiano, grafiche originali e drop REVERT.`}
        path={active === "All" ? "/collection" : `/collection?category=${active}`}
      />
      <Header />
      <main>
        <section className="collection-head">
          <p>Collection</p>
          <p className="collection-current">{categoryLabels[active]}</p>
        </section>

        <div className="category-tabs" role="tablist" aria-label="Categorie">
          {categories.map((category) => (
            <button
              key={category}
              className={active === category ? "active" : ""}
              onClick={() => changeCategory(category)}
              type="button"
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <section className="product-grid collection-grid">
            {visible.map((product) => <ProductCard key={product.slug} product={product} />)}
          </section>
        ) : (
          <section className="empty-category" aria-live="polite">
            <h1>{categoryLabels[active]}</h1>
            <p>Le immagini di questa categoria verranno aggiunte appena disponibili.</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
