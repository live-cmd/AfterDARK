import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Performers.css';

export default function Performers() {
  const [legends, setLegends] = useState([]);
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeClip, setActiveClip] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [legendsRes, clipsRes] = await Promise.allSettled([
      supabase.from('legends_afterdark').select('*').order('induction_date', { ascending: false }),
      supabase.from('performance_clips').select('*').order('event_date', { ascending: false }),
    ]);
    if (legendsRes.status === 'fulfilled' && !legendsRes.value.error) {
      setLegends(legendsRes.value.data || []);
    }
    if (clipsRes.status === 'fulfilled' && !clipsRes.value.error) {
      setClips(clipsRes.value.data || []);
    }
    setLoading(false);
  }

  function getYouTubeId(url) {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : url;
  }

  function getThumbnail(clip) {
    if (clip.thumbnail_url) return clip.thumbnail_url;
    const id = getYouTubeId(clip.youtube_url);
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  return (
    <div className="performers-page">
      <section className="performers-hero">
        <div className="performers-hero__bg" />
        <div className="container performers-hero__content">
          <p className="section-label">Performers</p>
          <h1 className="display text-blue performers-hero__title">
            The Stage<br />AfterDARK
          </h1>
          <p className="performers-hero__sub text-dim">
            The artists, comedians, musicians, and voices who've made
            Cool J's AfterDARK what it is.
          </p>
        </div>
      </section>

      {/* PERFORM HERE CTA */}
      <section className="section perform-cta">
        <div className="container perform-cta__inner">
          <div className="perform-cta__text">
            <p className="section-label">Take The Stage</p>
            <span className="blue-line" />
            <h2 className="perform-cta__title">Think You Belong Up Here?</h2>
            <p className="perform-cta__sub text-dim">
              We're always looking for comedians, musicians, vocalists, and
              spoken word artists for upcoming shows. Tell us about your act —
              no approval gate, just send us what you've got.
            </p>
          </div>
          <a href="/submit" className="btn btn-blue perform-cta__btn">Submit Your Info →</a>
        </div>
      </section>

      {/* LEGENDS AFTERDARK */}
      <section className="section legends-section">
        <div className="container">
          <p className="section-label">The Highest Honor</p>
          <span className="gold-line" />
          <h2 className="legends-section__title">Legends AfterDARK</h2>
          <p className="legends-section__sub text-dim">
            Inducted for performances that truly entertained at the highest level.
          </p>

          {loading ? (
            <p className="performers-loading">Loading...</p>
          ) : legends.length === 0 ? (
            <p className="performers-empty">No inductees yet — the first Legend is waiting to be named.</p>
          ) : (
            <div className="legends-grid">
              {legends.map(legend => (
                <div key={legend.id} className="legend-card">
                  <div className="legend-card__frame">
                    <img src={legend.headshot_url} alt={legend.name} className="legend-card__img" />
                  </div>
                  <h3 className="legend-card__name">{legend.name}</h3>
                  <p className="legend-card__date">Inducted {formatDate(legend.induction_date)}</p>
                  {legend.bio && <p className="legend-card__bio text-dim">{legend.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PERFORMANCE CLIPS */}
      <section className="section clips-section">
        <div className="container">
          <p className="section-label">See It Live</p>
          <span className="blue-line" />
          <h2 className="clips-section__title">Performance Clips</h2>
          <p className="clips-section__sub text-dim">
            Moments from the AfterDARK stage.
          </p>

          {loading ? (
            <p className="performers-loading">Loading...</p>
          ) : clips.length === 0 ? (
            <p className="performers-empty">No clips posted yet — check back soon.</p>
          ) : (
            <div className="clips-grid">
              {clips.map(clip => (
                <div key={clip.id} className="clip-card" onClick={() => setActiveClip(clip)}>
                  <div className="clip-card__thumb" style={{ backgroundImage: `url(${getThumbnail(clip)})` }}>
                    <div className="clip-card__play">▶</div>
                  </div>
                  <h3 className="clip-card__name">{clip.performer_name}</h3>
                  {clip.event_date && <p className="clip-card__date text-dim">{formatDate(clip.event_date)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VIDEO MODAL */}
      {activeClip && (
        <div className="clip-modal" onClick={() => setActiveClip(null)}>
          <div className="clip-modal__inner" onClick={e => e.stopPropagation()}>
            <button className="clip-modal__close" onClick={() => setActiveClip(null)}>×</button>
            <div className="clip-modal__video">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(activeClip.youtube_url)}?autoplay=1`}
                title={activeClip.performer_name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="clip-modal__name">{activeClip.performer_name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
