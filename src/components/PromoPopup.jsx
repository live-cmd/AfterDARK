import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PromoPopup.css';

function getYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : '';
}

export default function PromoPopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('promo_popup')
        .select('*')
        .eq('enabled', true)
        .limit(1)
        .single();
      if (!error && data) {
        setPopup(data);
        setTimeout(() => setVisible(true), 600);
      }
    }
    load();
  }, []);

  if (!popup || !visible) return null;

  return (
    <div className="promo-overlay" onClick={() => setVisible(false)}>
      <div className="promo-modal" onClick={e => e.stopPropagation()}>
        <button className="promo-close" onClick={() => setVisible(false)} aria-label="Close">✕</button>

        {popup.type === 'video' && popup.youtube_url ? (
          <div className="promo-video">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(popup.youtube_url)}?autoplay=1&mute=1`}
              title={popup.headline || 'Promo'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : popup.image_url ? (
          <div className="promo-img-wrap">
            <img src={popup.image_url} alt={popup.headline || 'Promo'} className="promo-img" />
          </div>
        ) : null}

        {(popup.headline || popup.subtext || popup.cta_url) && (
          <div className="promo-body">
            {popup.headline && <h2 className="promo-headline">{popup.headline}</h2>}
            {popup.subtext && <p className="promo-subtext">{popup.subtext}</p>}
            {popup.cta_url && (
              <a
                href={popup.cta_url}
                className="btn btn-blue promo-cta"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setVisible(false)}
              >
                {popup.cta_label || 'Learn More →'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
