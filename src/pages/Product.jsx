import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { useCart } from '../components/CartContext';
import { getProduct, formatMoney, sized } from '../lib/shopify';
import './Shop.css';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL'];

export default function Product() {
  const { handle } = useParams();
  const { addItem, busy } = useCart();
  const [product, setProduct] = useState(undefined);
  const [selected, setSelected] = useState({});
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setProduct(undefined);
    getProduct(handle)
      .then(p => {
        setProduct(p || null);
        if (p) {
          const first = p.variants.nodes.find(v => v.availableForSale) || p.variants.nodes[0];
          setSelected(Object.fromEntries(first.selectedOptions.map(o => [o.name, o.value])));
        }
      })
      .catch(() => setProduct(null));
  }, [handle]);

  const variant = useMemo(() => {
    if (!product) return null;
    return product.variants.nodes.find(v =>
      v.selectedOptions.every(o => selected[o.name] === o.value)
    );
  }, [product, selected]);

  const images = useMemo(() => {
    if (!product) return [];
    return product.images.nodes;
  }, [product]);

  // jump gallery to the selected variant's image (e.g. color change)
  useEffect(() => {
    if (!variant?.image) return;
    const i = images.findIndex(img => img.url === variant.image.url);
    if (i >= 0) setActiveImg(i);
  }, [variant, images]);

  if (product === undefined) {
    return <div className="product-page"><div className="container product-loading">Loading…</div></div>;
  }
  if (product === null) {
    return (
      <div className="product-page">
        <div className="container product-loading">
          <p>That item isn't on the lineup anymore.</p>
          <Link to="/shop" className="btn btn-outline-gold">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isAvailable = (name, value) => {
    const trial = { ...selected, [name]: value };
    return product.variants.nodes.some(v =>
      v.availableForSale && v.selectedOptions.every(o => trial[o.name] === o.value)
    );
  };

  const options = product.options
    .filter(o => !(o.optionValues.length === 1 && o.optionValues[0].name === 'Default Title'))
    .map(o => ({
      ...o,
      values: o.name.toLowerCase() === 'size'
        ? [...o.optionValues].sort((a, b) => SIZE_ORDER.indexOf(a.name) - SIZE_ORDER.indexOf(b.name))
        : o.optionValues,
    }));

  const price = variant?.price || product.variants.nodes[0].price;
  const img = images[activeImg];
  const plainDesc = product.descriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: images.map(i => i.url),
    description: plainDesc,
    brand: { '@type': 'Brand', name: "Cool J's AfterDARK" },
    offers: {
      '@type': 'Offer',
      url: `https://cooljsafterdark.com/shop/${product.handle}`,
      priceCurrency: price.currencyCode,
      price: price.amount,
      availability: variant?.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="product-page">
      <SEO
        title={`${product.title} | Cool J's AfterDARK Merch`}
        description={plainDesc.slice(0, 155) || `Official Cool J's AfterDARK ${product.title}.`}
        path={`/shop/${product.handle}`}
        image={img?.url}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="container">
        <Link to="/shop" className="product-back">← All Merch</Link>

        <div className="product-layout">
          <div className="product-gallery">
            <div className="product-gallery__main">
              {img && <img src={sized(img.url, 1000)} alt={img.altText || product.title} />}
            </div>
            {images.length > 1 && (
              <div className="product-gallery__thumbs">
                {images.map((im, i) => (
                  <button
                    key={im.url}
                    className={`product-thumb${i === activeImg ? ' product-thumb--active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={sized(im.url, 160)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <p className="section-label">AfterDARK Merch</p>
            <h1 className="product-info__title">{product.title}</h1>
            <p className="product-info__price">{formatMoney(price.amount, price.currencyCode)}</p>

            {options.map(o => (
              <div key={o.name} className="product-option">
                <span className="product-option__label">{o.name}: <strong>{selected[o.name]}</strong></span>
                <div className="product-option__values">
                  {o.values.map(v => {
                    const ok = isAvailable(o.name, v.name);
                    return (
                      <button
                        key={v.name}
                        className={`product-chip${selected[o.name] === v.name ? ' product-chip--active' : ''}${ok ? '' : ' product-chip--na'}`}
                        onClick={() => setSelected(s => ({ ...s, [o.name]: v.name }))}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              className="btn btn-gold product-add"
              disabled={!variant?.availableForSale || busy}
              onClick={() => addItem(variant.id)}
            >
              {!variant ? 'Select options' : !variant.availableForSale ? 'Sold Out' : busy ? 'Adding…' : 'Add to Bag'}
            </button>

            <ul className="product-perks">
              <li>Printed to order just for you</li>
              <li>Ships in 2–5 business days + transit</li>
              <li>Free replacement if it arrives damaged</li>
            </ul>

            {product.descriptionHtml && (
              <div className="product-desc" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
