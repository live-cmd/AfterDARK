import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { formatMoney, sized } from '../lib/shopify';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, open, setOpen, busy, updateQty, removeItem } = useCart();
  const lines = cart?.lines?.nodes || [];

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, setOpen]);

  return (
    <div className={`cart${open ? ' cart--open' : ''}`} aria-hidden={!open}>
      <div className="cart__backdrop" onClick={() => setOpen(false)} />
      <aside className="cart__panel" role="dialog" aria-label="Your cart">
        <header className="cart__head">
          <h2 className="cart__title">Your <span className="text-gold">Bag</span></h2>
          <button className="cart__close" onClick={() => setOpen(false)} aria-label="Close cart">×</button>
        </header>

        {lines.length === 0 ? (
          <div className="cart__empty">
            <p>Your bag is empty.</p>
            <Link to="/shop" className="btn btn-outline-gold" onClick={() => setOpen(false)}>Shop Merch</Link>
          </div>
        ) : (
          <>
            <ul className="cart__lines">
              {lines.map(line => {
                const m = line.merchandise;
                return (
                  <li key={line.id} className="cart__line">
                    {m.image && <img src={sized(m.image.url, 160)} alt={m.image.altText || m.product.title} className="cart__img" />}
                    <div className="cart__info">
                      <Link to={`/shop/${m.product.handle}`} className="cart__name" onClick={() => setOpen(false)}>{m.product.title}</Link>
                      {m.title !== 'Default Title' && <span className="cart__variant">{m.title}</span>}
                      <div className="cart__qty">
                        <button disabled={busy} onClick={() => updateQty(line.id, line.quantity - 1)} aria-label="Decrease quantity">−</button>
                        <span>{line.quantity}</span>
                        <button disabled={busy} onClick={() => updateQty(line.id, line.quantity + 1)} aria-label="Increase quantity">+</button>
                        <button className="cart__remove" disabled={busy} onClick={() => removeItem(line.id)}>Remove</button>
                      </div>
                    </div>
                    <span className="cart__price">{formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}</span>
                  </li>
                );
              })}
            </ul>
            <footer className="cart__foot">
              <div className="cart__subtotal">
                <span>Subtotal</span>
                <span>{formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</span>
              </div>
              <p className="cart__note">Shipping & taxes calculated at checkout. Every piece is printed to order.</p>
              <a href={cart.checkoutUrl} className="btn btn-gold cart__checkout">Checkout →</a>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
