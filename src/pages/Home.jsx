import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__gradient" />
          <div className="hero__noise" />
        </div>
        <div className="container hero__content">
          <p className="section-label hero__eyebrow">Delaware's Longest-Running Comedy Show</p>
          <h1 className="hero__headline display">
            Everything<br />
            Changes<br />
            <span className="text-gold">AfterDARK</span>
          </h1>
          <p className="hero__sub">
            Get off the couch, we'll handle the rest.
          </p>
          <div className="hero__actions">
            <Link to="/tickets" className="btn btn-gold">Get Tickets</Link>
            <Link to="/events" className="btn btn-outline-white">See All Shows</Link>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── NEXT SHOW TICKER ── */}
      <div className="ticker">
        <div className="ticker__track">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="ticker__item">
              Live Comedy &bull; Bear, Delaware &bull; Doors Open 7PM &bull; Show Starts 8PM &bull;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── UPCOMING SHOWS ── */}
      <section className="section shows">
        <div className="container">
          <p className="section-label">On The Calendar</p>
          <span className="gold-line" />
          <h2 className="shows__title">Upcoming Shows</h2>

          <div className="shows__grid">
            {SHOWS.map((show, i) => (
              <div key={i} className="show-card">
                <div className="show-card__date">
                  <span className="show-card__month">{show.month}</span>
                  <span className="show-card__day">{show.day}</span>
                </div>
                <div className="show-card__info">
                  <h3 className="show-card__name">{show.name}</h3>
                  <p className="show-card__meta">{show.venue} &bull; {show.time}</p>
                  <p className="show-card__desc">{show.desc}</p>
                </div>
                <div className="show-card__action">
                  {show.soldOut
                    ? <span className="show-card__sold-out">Sold Out</span>
                    : <Link to="/tickets" className="btn btn-outline-gold">Tickets</Link>
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="shows__more">
            <Link to="/events" className="btn btn-outline-white">View Full Calendar</Link>
          </div>
        </div>
      </section>

      {/* ── WHY AFTERDARK ── */}
      <section className="section pillars">
        <div className="pillars__bg" />
        <div className="container">
          <p className="section-label text-center">Why AfterDARK</p>
          <span className="gold-line centered" />
          <h2 className="pillars__title text-center">
            A Night Out That Actually<br />
            <span className="text-gold">Delivers</span>
          </h2>
          <div className="pillars__grid">
            {PILLARS.map((p, i) => (
              <div key={i} className="pillar">
                <div className="pillar__icon">{p.icon}</div>
                <h3 className="pillar__name">{p.name}</h3>
                <p className="pillar__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVATE EVENTS ── */}
      <section className="section private">
        <div className="container private__inner">
          <div className="private__text">
            <p className="section-label">Private Events</p>
            <span className="gold-line" />
            <h2 className="private__title">
              Make It a<br />
              <span className="text-gold">Private Show</span>
            </h2>
            <p className="private__desc">
              Birthdays. Corporate events. Celebrations. We bring Delaware's
              best comedy talent to your private event — fully customized,
              professionally produced, unforgettable.
            </p>
            <Link to="/private-events" className="btn btn-gold">Request a Quote</Link>
          </div>
          <div className="private__visual">
            <div className="private__card">
              <div className="private__card-label">Starting at</div>
              <div className="private__card-price">Custom Packages</div>
              <ul className="private__card-features">
                <li>✓ Dedicated Show Host</li>
                <li>✓ Professional Comedians</li>
                <li>✓ Custom Run of Show</li>
                <li>✓ Flexible Venue Options</li>
                <li>✓ Full Event Coordination</li>
              </ul>
              <Link to="/private-events" className="btn btn-outline-gold" style={{width:'100%'}}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RADAR CTA ── */}
      <section className="section radar-cta">
        <div className="container radar-cta__inner">
          <div className="radar-cta__badge">NEW</div>
          <h2 className="radar-cta__title">
            Discover What's Happening<br />
            <span className="text-blue">Tonight, Right Now</span>
          </h2>
          <p className="radar-cta__desc">
            AfterDARK Radar — the app built for people who decide what
            they're doing within 72 hours. Find live events near you, instantly.
          </p>
          <div className="radar-cta__actions">
            <Link to="/radar" className="btn btn-blue">Download the App</Link>
            <Link to="/radar" className="btn btn-outline-white">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── EMAIL SIGNUP ── */}
      <section className="section email-signup">
        <div className="container email-signup__inner">
          <p className="section-label text-center">Stay in the Loop</p>
          <span className="gold-line centered" />
          <h2 className="email-signup__title text-center">
            Never Miss a Show
          </h2>
          <p className="email-signup__desc text-center">
            Get early access to tickets, exclusive offers, and AfterDARK news
            delivered straight to your inbox.
          </p>
          <form className="email-signup__form" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="email-signup__input"
              aria-label="Email address"
              required
            />
            <button type="submit" className="btn btn-gold">
              Sign Me Up
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

/* ── SAMPLE DATA (replace with live data / CMS) ── */
const SHOWS = [
  {
    month: 'JUN',
    day: '14',
    name: 'AfterDARK Summer Kickoff',
    venue: 'Bear, DE',
    time: 'Doors 7PM · Show 8PM',
    desc: 'Kick off summer the right way. Headliner TBA.',
    soldOut: false,
  },
  {
    month: 'JUN',
    day: '28',
    name: "Cool J's AfterDARK",
    venue: 'Bear, DE',
    time: 'Doors 7PM · Show 8PM',
    desc: 'Delaware's longest-running comedy show returns.',
    soldOut: false,
  },
  {
    month: 'JUL',
    day: '12',
    name: 'Independence Laughs',
    venue: 'Bear, DE',
    time: 'Doors 7PM · Show 8PM',
    desc: 'A July tradition. Fire comedy, no fireworks required.',
    soldOut: false,
  },
];

const PILLARS = [
  {
    icon: '🎤',
    name: 'Real Comedians',
    desc: 'Professional talent from the Mid-Atlantic and beyond — comics who actually make you laugh.',
  },
  {
    icon: '🏆',
    name: '7+ Years Running',
    desc: "Delaware's longest-running comedy show. We've been here since before it was cool.",
  },
  {
    icon: '🌙',
    name: 'AfterDARK Energy',
    desc: 'The night has a different feel. We built our show around it — and so did your city.',
  },
  {
    icon: '🎟️',
    name: 'Easy Ticketing',
    desc: 'Grab your seat in seconds. Reserve ahead or show up — we make it simple.',
  },
];
