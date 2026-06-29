import { useState, useEffect } from 'react';
import './PrivateEvents.css';

const RECAPTCHA_SITE_KEY = '6LfKPf4sAAAAAC32FH8vbfnIkM993HUYVvAOymxF';

const PACKAGES = [
  {
    icon: '🎤',
    name: 'Comedy Night',
    desc: 'Professional stand-up comedians from the Mid-Atlantic and beyond. We curate the lineup, run the show, and deliver the laughs — you just show up and enjoy.',
    highlights: ['Headliner + opener', 'Custom run of show', 'MC included'],
  },
  {
    icon: '🎵',
    name: 'Karaoke',
    desc: 'Not your average karaoke night. AfterDARK-produced karaoke with professional sound, lighting, and a host who keeps the energy exactly where it needs to be.',
    highlights: ['Professional sound system', 'Hosted experience', 'Full song library'],
  },
  {
    icon: '🎸',
    name: 'Live Music',
    desc: 'Live bands and solo artists curated for your event. From background ambiance to full-on concert energy — we match the act to your occasion.',
    highlights: ['Curated artist selection', 'Full backline available', 'Genre flexible'],
  },
  {
    icon: '🎙️',
    name: 'Spoken Word',
    desc: 'Poetry, storytelling, and spoken word performance that moves a room. Perfect for cultural events, fundraisers, and celebrations with depth.',
    highlights: ['Local & national artists', 'Open mic option', 'Cultural programming'],
  },
  {
    icon: '🎲',
    name: 'Game Night',
    desc: 'Hosted game nights that get people talking, laughing, and competing. Custom trivia, team games, and interactive formats for any group size.',
    highlights: ['Custom trivia available', 'Team formats', 'All ages friendly'],
  },
  {
    icon: '✨',
    name: 'Special Event',
    desc: 'Have something unique in mind? Birthdays, corporate events, celebrations, fundraisers — tell us what you\'re building and we\'ll make it happen.',
    highlights: ['Fully custom', 'Concept development', 'Full coordination'],
  },
];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  guestCount: '',
  preferredDate: '',
  message: '',
  vipOptIn: false,
  website: '', // honeypot — real users never see or fill this
};

export default function PrivateEvents() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  useEffect(() => {
    if (document.querySelector(`script[src*="recaptcha"]`)) return;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handlePackageSelect(packageName) {
    setSelectedPackage(packageName);
    setForm(prev => ({ ...prev, eventType: packageName }));
    document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' });
  }

  function getRecaptchaToken() {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) { reject(new Error('reCAPTCHA not loaded')); return; }
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'private_event_inquiry' }).then(resolve).catch(reject);
      });
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Honeypot: if this hidden field has anything in it, it was filled by a bot.
    // Pretend success so the bot doesn't learn it was caught.
    if (form.website) {
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setSubmitting(false);
      return;
    }

    try {
      const token = await getRecaptchaToken();
      const verifyRes = await fetch('/.netlify/functions/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        // Likely a bot — fail quietly without revealing why.
        setSubmitted(true);
        setForm(EMPTY_FORM);
        setSubmitting(false);
        return;
      }

      const inquiryRes = await fetch('/.netlify/functions/private-event-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          eventType: form.eventType,
          guestCount: form.guestCount,
          preferredDate: form.preferredDate,
          message: form.message,
          vipOptIn: form.vipOptIn,
        }),
      });

      const inquiryData = await inquiryRes.json();
      if (!inquiryRes.ok || !inquiryData.success) {
        throw new Error(inquiryData.error || 'Submission failed');
      }

      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError('Something went wrong. Please email us directly at live@cooljsafterdark.com');
    }

    setSubmitting(false);
  }

  return (
    <div className="private-page">

      {/* HERO */}
      <section className="private-hero">
        <div className="private-hero__bg" />
        <div className="container private-hero__content">
          <p className="section-label">Private Events</p>
          <h1 className="display text-blue private-hero__title">
            Make It a<br />Private Show
          </h1>
          <p className="private-hero__sub text-dim">
            Birthdays. Corporate events. Celebrations. We bring Delaware's
            best live entertainment to your private event — fully produced,
            professionally run, unforgettable.
          </p>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section private-packages">
        <div className="container">
          <p className="section-label">What We Offer</p>
          <span className="blue-line" />
          <h2 className="private-packages__title">Choose Your Experience</h2>
          <p className="private-packages__sub text-dim">
            Select a package below and we'll reach out to build the perfect event around it.
          </p>
          <div className="packages-grid">
            {PACKAGES.map((pkg, i) => (
              <div
                key={i}
                className={`package-card ${selectedPackage === pkg.name ? 'package-card--selected' : ''}`}
                onClick={() => handlePackageSelect(pkg.name)}
              >
                <div className="package-card__icon">{pkg.icon}</div>
                <h3 className="package-card__name">{pkg.name}</h3>
                <p className="package-card__desc">{pkg.desc}</p>
                <ul className="package-card__highlights">
                  {pkg.highlights.map((h, j) => (
                    <li key={j}>✓ {h}</li>
                  ))}
                </ul>
                <div className="package-card__cta">
                  {selectedPackage === pkg.name ? (
                    <span className="package-card__selected-label">Selected ✓</span>
                  ) : (
                    <span className="package-card__select">Request This Package →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="section private-form-section" id="inquiry-form">
        <div className="container private-form-section__inner">
          <div className="private-form-section__left">
            <p className="section-label">Get Started</p>
            <span className="blue-line" />
            <h2 className="private-form-section__title">
              Request a Quote
            </h2>
            <p className="text-dim">
              Fill out the form and we'll get back to you within 24 hours
              to discuss your event and put together a custom package.
            </p>
            <div className="private-form-section__contact">
              <p className="text-dim">Prefer to reach out directly?</p>
              <a href="mailto:live@cooljsafterdark.com" className="private-form-section__email">
                live@cooljsafterdark.com
              </a>
            </div>
          </div>

          <div className="private-form-section__right">
            {submitted ? (
              <div className="private-form__success">
                <div className="private-form__success-icon">✓</div>
                <h3 className="private-form__success-title">Request Received</h3>
                <p className="text-dim">
                  Thanks for reaching out. We'll be in touch within 24 hours
                  to talk through your event.
                </p>
              </div>
            ) : (
              <form className="private-form" onSubmit={handleSubmit}>
                {/* Honeypot field — hidden from real users via CSS, bots fill it anyway */}
                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={form.website}
                    onChange={handleFormChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <div className="private-form__row">
                  <div className="private-form__field">
                    <label className="private-label">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="private-input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="private-form__field">
                    <label className="private-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      className="private-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="private-form__row">
                  <div className="private-form__field">
                    <label className="private-label">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      className="private-input"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  <div className="private-form__field">
                    <label className="private-label">Event Type *</label>
                    <select
                      name="eventType"
                      value={form.eventType}
                      onChange={handleFormChange}
                      className="private-input private-select"
                      required
                    >
                      <option value="">Select a package</option>
                      {PACKAGES.map(pkg => (
                        <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="private-form__row">
                  <div className="private-form__field">
                    <label className="private-label">Estimated Guest Count</label>
                    <select
                      name="guestCount"
                      value={form.guestCount}
                      onChange={handleFormChange}
                      className="private-input private-select"
                    >
                      <option value="">Select range</option>
                      <option>Under 25</option>
                      <option>25–50</option>
                      <option>50–100</option>
                      <option>100–200</option>
                      <option>200+</option>
                    </select>
                  </div>
                  <div className="private-form__field">
                    <label className="private-label">Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={handleFormChange}
                      className="private-input"
                    />
                  </div>
                </div>

                <div className="private-form__field">
                  <label className="private-label">Tell Us About Your Event</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    className="private-input private-textarea"
                    placeholder="What are you celebrating? Any special requests or ideas?"
                    rows={4}
                  />
                </div>

                <label className="private-checkbox">
                  <input
                    type="checkbox"
                    name="vipOptIn"
                    checked={form.vipOptIn}
                    onChange={handleFormChange}
                  />
                  <span className="private-checkbox__box" />
                  <span className="private-checkbox__label">
                    Add me to the VIP list for exclusive offers and early ticket access
                  </span>
                </label>

                {error && <p className="private-form__error">{error}</p>}

                <button
                  type="submit"
                  className="btn btn-blue private-form__submit"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>

                <p className="text-dim" style={{ fontSize: '0.75rem', marginTop: '12px' }}>
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and{' '}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
