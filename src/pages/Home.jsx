import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import './Home.css';

export default function Home() {
  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          {/*
           * TODO: Replace with a high-energy crowd/stage photo.
           * Ideal shot: wide angle, people in seats or standing, stage lights visible.
           * Drop file into public/ and update the url() below in Home.css → .hero__photo
           */}
          <div className="hero__photo" />
          <div className="hero__overlay" />
          <div className="hero__spotlights">
            <div className="spotlight spotlight--left" />
            <div className="spotlight spotlight--right" />
          </div>
          <div className="hero__noise" />
        </div>
        <div className="container hero__content">
          <p className="section-label hero__eyebrow">Home of Delaware's Longest-Running Comedy Show</p>
          <h1 className="hero__headline display">
            Everything<br />
            Changes<br />
            <span className="text-blue">AfterDARK</span>
          </h1>
          <p className="hero__sub">
            Get off the couch, we'll handle the rest.
          </p>
          <div className="hero__actions">
            <Link to="/tickets" className="btn btn-blue">Get Tickets</Link>
            <Link to="/events" className="btn btn-outline-white">See All Shows</Link>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker__track">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="ticker__item">
              Live Comedy &bull; Bear, Delaware &bull; Doors Open 7PM &bull; Show Starts 8PM &bull;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── UPCOMING SHOWS ── */}
      <section className="section shows">
        <div className="container">
          <ScrollReveal>
            <p className="section-label">On The Calendar</p>
            <span className="blue-line" />
            <h2 className="shows__title">Upcoming Shows</h2>
          </ScrollReveal>

          <div className="shows__grid">
            {SHOWS.map((show, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="show-card">
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
                      : <Link to="/tickets" className="btn btn-outline-blue">Tickets</Link>
                    }
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="shows__more">
            <Link to="/events" className="btn btn-outline-white">View Full Calendar</Link>
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ── */}
      {/*
       * TODO: Source 4–6 real photos from past shows.
       * Ideal mix: crowd laughing, performer on mic, drinks on table, people mingling.
       * Drop files into public/gallery/ and update GALLERY_PHOTOS below.
       * Until real photos are available, slots render as styled placeholder tiles.
       */}
      <section className="photo-strip" aria-label="AfterDARK atmosphere">
        <div className="photo-strip__track">
          {GALLERY_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="photo-strip__tile"
              style={photo.src ? { backgroundImage: `url(${photo.src})` } : {}}
              aria-label={photo.alt}
            >
              {!photo.src && (
                <span className="photo-strip__placeholder-label">{photo.alt}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY AFTERDARK ── */}
      <section className="section pillars">
        <div className="pillars__bg" />
        <div className="container">
          <ScrollReveal>
            <p className="section-label text-center">Why AfterDARK</p>
            <span className="blue-line centered" />
            <h2 className="pillars__title text-center">
              A Night Out That Actually<br />
              <span className="text-blue">Delivers</span>
            </h2>
          </ScrollReveal>
          <div className="pillars__grid">
            {PILLARS.map((p, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="pillar">
                  <div className="pillar__icon">{p.icon}</div>
                  <h3 className="pillar__name">{p.name}</h3>
                  <p className="pillar__desc">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVATE EVENTS ── */}
      <section className="section private">
        <div className="container private__inner">
          <ScrollReveal>
            <div className="private__text">
              <p className="section-label">Private Events</p>
              <span className="blue-line" />
              <h2 className="private__title">
                Make It a<br />
                <span className="text-blue">Private Show</span>
              </h2>
              <p className="private__desc">
                Birthdays. Corporate events. Celebrations. We bring Delaware's
                best comedy talent to your private event — fully customized,
                professionally produced, unforgettable.
              </p>
              <Link to="/private-events" className="btn btn-blue">Request a Quote</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
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
                <Link to="/private-events" className="btn btn-outline-blue" style={{width:'100%'}}>
                  Learn More
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── RADAR CTA ── */}
      <section className="section radar-cta">
        <div className="container radar-cta__inner">
          <ScrollReveal>
            <div className="radar-cta__badge">NEW</div>
            <h2 className="radar-cta__title">
              Discover What's Happening<br />
              <span className="text-purple">Tonight, Right Now</span>
            </h2>
            <p className="radar-cta__desc">
              AfterDARK Radar — the app built for people who decide what
              they're doing within 72 hours. Find live events near you, instantly.
            </p>
            <div className="radar-cta__actions">
              <Link to="/radar" className="btn btn-purple">Download the App</Link>
              <Link to="/radar" className="btn btn-outline-white">Learn More</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── EMAIL SIGNUP ── */}
      <section className="section email-signup">
        <div className="container email-signup__inner">
          <ScrollReveal>
            <p className="section-label text-center">Stay in the Loop</p>
            <span className="blue-line centered" />
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
              <button type="submit" className="btn btn-blue">
                Sign Me Up
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}

/* ── SAMPLE DATA (replace with live Eventbrite data) ── */
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
    desc: "Delaware's longest-running comedy show returns.",
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

/* ── GALLERY PHOTOS ── */
/* TODO: Replace src values with real photo paths once assets are ready.
 * Recommended shots:
 *   1. Crowd laughing — wide shot, energy visible
 *   2. Performer on mic — stage lights, crowd visible behind
 *   3. Drinks on table — cocktails/mocktails, atmospheric lighting
 *   4. People at tables — groups having a good time
 *   5. Comedian close-up — mid-set, mic in hand
 *   6. Venue atmosphere — room shot before show, mood lighting
 *
 * Drop files into public/gallery/ and set src: '/gallery/filename.jpg'
 */
const GALLERY_PHOTOS = [
  { src: null, alt: 'Crowd laughing at AfterDARK' },
  { src: null, alt: 'Performer on stage' },
  { src: null, alt: 'Drinks and good vibes' },
  { src: null, alt: 'Audience enjoying the show' },
  { src: null, alt: 'Comedian mid-set' },
  { src: null, alt: 'AfterDARK venue atmosphere' },
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
