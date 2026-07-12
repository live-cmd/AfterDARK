import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { fetchEventbriteEvents } from '../lib/eventbriteClient';
import './FeaturedEvent.css';

export default function FeaturedEvent() {
  const [featured, setFeatured] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
  }, []);

  async function loadFeatured() {
    setLoading(true);
    try {
      // Get featured_event config row
      const { data: configRows, error: configError } = await supabase
        .from('featured_event')
        .select('*')
        .limit(1);

      if (configError || !configRows || configRows.length === 0) {
        setFeatured(null);
        setLoading(false);
        return;
      }

      const config = configRows[0];

      if (config.source === 'eventbrite') {
        const ebEvents = await fetchEventbriteEvents();
        const match = ebEvents.find(e => String(e.id) === String(config.event_id));
        if (match) {
          setFeatured({ ...match, promo_code: config.promo_code, promo_text: config.promo_text, custom_cta_label: config.custom_cta_label });
        } else {
          setFeatured(null);
        }
      } else {
        const { data: show, error: showError } = await supabase
          .from('shows')
          .select('*')
          .eq('id', config.event_id)
          .maybeSingle();
        if (!showError && show) {
          setFeatured({ ...show, promo_code: config.promo_code, promo_text: config.promo_text, custom_cta_label: config.custom_cta_label });
        } else {
          setFeatured(null);
        }
      }
    } catch {
      setFeatured(null);
    }
    setLoading(false);
  }

  function getTicketHref(event) {
    return event.eventbrite_url || '/tickets';
  }

  function getCtaLabel(event) {
    return event.custom_cta_label || 'Get Tickets →';
  }

  if (loading || !featured) return null;

  const href = getTicketHref(featured);
  const isExternal = href.startsWith('http');

  return (
    <>
      {/* FEATURED CARD */}
      <div className="fe-wrapper">
        <p className="section-label fe-label">⭐ Featured Show</p>
        <div className="fe-card" onClick={() => setModalOpen(true)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setModalOpen(true)}>
          <div
            className="fe-card__image"
            style={featured.image_url ? { backgroundImage: `url(${featured.image_url})` } : {}}
          >
            <span className="fe-card__badge">⭐ Featured</span>
            <div className="fe-card__overlay">
              <h3 className="fe-card__name">{featured.name}</h3>
              <p className="fe-card__date">{featured.month} {featured.day}, {featured.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fe-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="fe-modal" onClick={e => e.stopPropagation()}>
            <button className="fe-modal__close" onClick={() => setModalOpen(false)}>✕</button>

            {featured.image_url && (
              <div className="fe-modal__hero" style={{ backgroundImage: `url(${featured.image_url})` }}>
                <div className="fe-modal__hero-bar" />
                <span className="fe-modal__hero-badge">⭐ Featured Show</span>
              </div>
            )}

            <div className="fe-modal__body">
              <h2 className="fe-modal__name">{featured.name}</h2>
              <p className="fe-modal__meta">
                {featured.month} {featured.day}, {featured.year}
                {featured.time && <> · {featured.time}</>}
                {featured.venue && <> · {featured.venue}</>}
              </p>

              {featured.description && (
                <p className="fe-modal__desc">{featured.description}</p>
              )}

              {featured.promo_code && (
                <div className="fe-modal__promo">
                  <p className="fe-modal__promo-text">{featured.promo_text || 'Use promo code at checkout:'}</p>
                  <span className="fe-modal__promo-code">{featured.promo_code}</span>
                </div>
              )}

              <div className="fe-modal__actions">
                {!featured.sold_out && !featured.is_free && !featured.is_private && (
                  isExternal
                    ? <a href={href} target="_blank" rel="noopener noreferrer" className="btn fe-modal__cta-primary">{getCtaLabel(featured)}</a>
                    : <Link to={href} className="btn fe-modal__cta-primary">{getCtaLabel(featured)}</Link>
                )}
                {featured.sold_out && <span className="fe-modal__sold-out">Sold Out</span>}
                {featured.is_free && <span className="fe-modal__free">Free Admission</span>}
                <Link to="/events" className="btn fe-modal__cta-ghost" onClick={() => setModalOpen(false)}>View Full Details</Link>
              </div>

              {!featured.is_private && !featured.is_free && !featured.sold_out && (
                <p className="fe-modal__note">
                  {featured.price ? `Tickets from $${featured.price} · ` : ''}Sold through Eventbrite
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
