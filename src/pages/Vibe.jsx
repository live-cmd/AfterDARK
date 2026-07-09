import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Vibe.css';

const SUPABASE_IMG = (filename) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/website-images/${filename}`;

const INTERESTS = [
  { id: 'comedy', label: 'Comedy Night' },
  { id: 'karaoke', label: 'Karaoke' },
  { id: 'open_mic', label: 'Open Mic' },
  { id: 'spoken_word', label: 'Spoken Word' },
  { id: 'dj_nights', label: 'DJ Nights' },
  { id: 'private_events', label: 'Private Events' },
];

export default function Vibe() {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [utm, setUtm] = useState({ source: null, medium: null, campaign: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
    });
  }, []);

  function toggleInterest(id) {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    try {
      const res = await fetch('/.netlify/functions/vibe-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          interests,
          utm_source: utm.source,
          utm_medium: utm.medium,
          utm_campaign: utm.campaign,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="vibe-page">
      <div className="vibe-page__bg" style={{ backgroundImage: `url(${SUPABASE_IMG('comedy_comedian-wide-shot-1.jpeg')})` }} />
      <div className="vibe-page__overlay" />

      <div className="vibe-page__content">
        <Link to="/" className="vibe-page__logo">Cool J's AfterDARK</Link>

        {status === 'success' ? (
          <div className="vibe-page__success">
            <h1 className="vibe-page__headline">You're in.</h1>
            <p className="vibe-page__sub">Keep an eye on your inbox — the vibe's coming to you now.</p>
            <Link to="/events" className="btn btn-blue">See What's On</Link>
          </div>
        ) : (
          <>
            <p className="vibe-page__eyebrow">You found us. Nice.</p>
            <h1 className="vibe-page__headline">
              This is what<br />
              <span className="text-blue">AfterDARK</span> feels like.
            </h1>
            <p className="vibe-page__sub">
              Tell us what you're into, and we'll make sure you never miss the vibe.
            </p>

            <form className="vibe-page__form" onSubmit={handleSubmit}>
              <div className="vibe-page__interests">
                {INTERESTS.map(interest => (
                  <button
                    type="button"
                    key={interest.id}
                    className={`vibe-page__chip ${interests.includes(interest.id) ? 'vibe-page__chip--active' : ''}`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>

              <div className="vibe-page__email-row">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="vibe-page__input"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button type="submit" className="btn btn-blue" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Joining…' : 'Get the Vibe'}
                </button>
              </div>

              {status === 'error' && (
                <p className="vibe-page__error" role="alert">Something went wrong. Please try again.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
