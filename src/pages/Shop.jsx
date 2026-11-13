import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { getCollectionProducts, formatMoney, sized } from '../lib/shopify';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getCollectionProducts()
      .then(c => setProducts(c?.products?.nodes || []))
      .catch(() => setError(true));
  }, []);

  const types = useMemo(() => {
    const t = new Set((products || []).map(p => p.productType).filter(Boolean));
    return ['All', ...t];
  }, [products]);

  const shown = (products || []).filter(p => filter === 'All' || p.productType === filter);

  return (
    <div className="shop-page">
      <SEO
        title="Shop AfterDARK Merch | Cool J's AfterDARK"
        description="Official Cool J's AfterDARK merch — tees, hoodies, and more from Delaware's longest-running comedy show. Printed to order, shipped to you."
        path="/shop"
      />

      <section className="shop-hero">
        <div className="container">
          <p className="section-label">Official Merch</p>
          <span className="gold-line" />
          <h1 className="display shop-hero__title">Wear the <span className="text-gold">Night</span></h1>
          <p className="shop-hero__sub">
            Gear from Delaware's longest-running comedy show. Printed to order, shipped to your door.
          </p>
        </div>
      </section>

      {types.length > 2 && (
        <div className="shop-filters">
          <div className="container shop-filters__inner">
            {types.map(t => (
              <button
                key={t}
                className={`shop-filter${filter === t ? ' shop-filter--active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="section shop-section">
        <div className="container">
          {error && <p className="shop-msg">The shop is taking a quick intermission. Please try again shortly.</p>}

          {!error && products === null && (
            <div className="shop-grid">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="shop-card shop-card--skeleton" />)}
            </div>
          )}

          {!error && products && shown.length === 0 && (
            <p className="shop-msg">New drops coming soon. Stay tuned.</p>
          )}

          {!error && shown.length > 0 && (
            <div className="shop-grid">
              {shown.map(p => {
                const min = p.priceRange.minVariantPrice;
                const max = p.priceRange.maxVariantPrice;
                const alt = p.images?.nodes?.[1];
                return (
                  <ScrollReveal key={p.id}>
                    <Link to={`/shop/${p.handle}`} className="shop-card">
                      <div className="shop-card__img-wrap">
                        {p.featuredImage && (
                          <img src={sized(p.featuredImage.url, 600)} alt={p.featuredImage.altText || p.title} className="shop-card__img" loading="lazy" />
                        )}
                        {alt && <img src={sized(alt.url, 600)} alt="" aria-hidden="true" className="shop-card__img shop-card__img--alt" loading="lazy" />}
                        {!p.availableForSale && <span className="shop-card__badge">Sold Out</span>}
                      </div>
                      <div className="shop-card__body">
                        {p.productType && <span className="shop-card__type">{p.productType}</span>}
                        <h2 className="shop-card__name">{p.title}</h2>
                        <span className="shop-card__price">
                          {Number(max.amount) > Number(min.amount) ? 'From ' : ''}
                          {formatMoney(min.amount, min.currencyCode)}
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
