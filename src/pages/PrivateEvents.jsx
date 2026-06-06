import { useState } from 'react';
import './PrivateEvents.css';

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
};

export default function PrivateEvents() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
const BREVO_API_KEY = process.env.REACT_APP_BREVO_API_KEY;
    const PRIVATE_EVENTS_LIST = 13;
    const VIP_LIST = 10;

    try {
      // Add contact to Brevo
      const listIds = [PRIVATE_EVENTS_LIST];
      if (form.vipOptIn) listIds.push(VIP_LIST);

      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: form.email,
          firstName: form.name.split(' ')[0] || form.name,
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          phone: form.phone,
          listIds,
          updateEnabled: true,
          attributes: {
            EVENT_TYPE: form.eventType,
            GUEST_COUNT: form.guestCount,
            PREFERRED_DATE: form.preferredDate,
            MESSAGE: form.message,
          },
        }),
      });

      // Send notification email to AfterDARK
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: 'AfterDARK Website', email: 'live@cooljsafterdark.com' },
          to: [{ email: 'live@cooljsafterdark.com', name: 'Cool J\'s AfterDARK' }],
          subject: `New Private Event Inquiry — ${form.eventType}`,
          htmlContent: `
            <h2>New Private Event Inquiry</h2>
            <p><strong>Name:</strong> ${form.name}</p>
            <p><strong>Email:</strong> ${form.email}</p>
            <p><strong>Phone:</strong> ${form.phone}</p>
            <p><strong>Event Type:</strong> ${form.eventType}</p>
            <p><strong>Guest Count:</strong> ${form.guestCount}</p>
            <p><strong>Preferred Date:</strong> ${form.preferredDate}</p>
            <p><strong>Message:</strong> ${form.message}</p>
            <p><strong>VIP Opt-in:</strong> ${form.vipOptIn ? 'Yes' : 'No'}</p>
          `,
        }),
      });

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
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
