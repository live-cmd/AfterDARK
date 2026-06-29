import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import './Home.css';

const SUPABASE_IMG = (filename) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/website-images/${filename}`;

const EVENT_SLIDES = [
  { color: '#00BFFF', image: SUPABASE_IMG('comedy_comedian-onstage-1.jpeg'), label: 'Comedy Night', position: 'center' },
  { color: '#C9A84C', image: SUPABASE_IMG('spoken-word_poet-1.JPG'), label: 'Spoken Word', position: 'center' },
  { color: '#904dc9', image: SUPABASE_IMG('karaoke_crowd-shot.jpeg'), label: 'Karaoke', position: 'right center' },
  { color: '#00BFFF', image: SUPABASE_IMG('open-mic_behind-stage.JPG'), label: 'Open Mic', position: 'center' },
  { color: '#C9A84C', image: SUPABASE_IMG('dancing_party-goers.jpeg'), label: 'Live Music', position: 'center' },
  { color: '#00BFFF', image: SUPABASE_IMG('dancing_Dj.jpeg'), label: 'DJ Night', position: 'center' },
];

const REVIEWS = [
  { author: 'Sheryl I Shackelford', text: 'Went for comedy. Left needing stitches!! 🤣 Great owners, Amazing drinks, mature vibe. Its on my calendar for every week now.' },
  { author: 'Trina', text: "Always a great show! Worth more than $25 for these comedy shows! Never say there's not anything to do in Delaware!! This the spot!!!" },
  { author: 'Miranda Matthews', text: 'Always a great experience! The owners and staff are lovely people. Best water ice and the nightlife is always fun! Their comedy shows are fantastic.' },
  { author: 'Autumn Hayes', text: "It was the best decision I made that night. I love the intimate close knit vibe of the place. The comedians were hilarious. Can't wait to come back!" },
];

const SHOWS = [
  {
    month: 'JUN', day: '14', name: 'AfterDARK Summer Kickoff', venue: 'Bear, DE', time: 'Doors 7PM · Show 8PM',
    desc: 'Kick off summer the right way. Headliner TBA.',
    tags: ['Comedy', 'All Ages', 'Bear, DE'], soldOut: false,
  },
  {
    month: 'JUN', day: '28', name: "Cool J's AfterDARK", venue: 'Bear, DE', time: 'Doors 7PM · Show 8PM',
    desc: "Delaware's longest-running comedy show returns.",
    tags: ['Comedy', 'Open Mic', 'Bear, DE'], soldOut: false,
  },
  {
    month: 'JUL', day: '12', name: 'Independence Laughs', venue: 'Bear, DE', time: 'Doors 7PM · Show 8PM',
    desc: 'A July tradition. Fire comedy, no fireworks required.',
    tags: ['Comedy', 'Special Event', 'Bear, DE'], soldOut: false,
  },
];

const GALLERY_PHOTOS = [
  { src: SUPABASE_IMG('comedy_comedian-wide-shot-1.jpeg'), alt: 'AfterDARK crowd' },
  { src: SUPABASE_IMG('comedy_comedy@cooljs-brand-card.png'), alt: "Comedy Night at Cool J's AfterDARK", isBrandCard: true },
  { src: SUPABASE_IMG('comedy_comedian-wide-shot-2.JPG'), alt: 'AfterDARK atmosphere' },
  { src: SUPABASE_IMG('karaoke_brand-card.png'), alt: 'Karaoke at AfterDARK', isBrandCard: true },
  { src: SUPABASE_IMG('comedy_comedian-onstage-2.JPG'), alt: 'Comedy night crowd' },
  { src: SUPABASE_IMG('open-mic_brand-card.png'), alt: 'Open Mic at AfterDARK', isBrandCard: true },
  { src: SUPABASE_IMG('spoken-word_brand-card.png'), alt: 'Spoken Word at AfterDARK', isBrandCard: true },
];

const PILLARS = [
  { icon: '🎤', name: 'Real Comedians', desc: 'Professional talent from the Mid-Atlantic and beyond — comics who actually make you laugh.' },
  { icon: '🏆', name: '7+ Years Running', desc: "Delaware's longest-running comedy show. We've been here since before it was cool." },
  { icon: '🌙', name: 'AfterDARK Energy', desc: 'The night has a different feel. We built our show around it — and so did your city.' },
  { icon: '🎟️', name: 'Easy Ticketing', desc: 'Grab your seat in seconds. Reserve ahead or show up — we make it simple.' },
];

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(i => (i + 1) % EVENT_SLIDES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i) => setSlideIndex(i);

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div
            className="hero__photo"
            style={{ backgroundImage: `url(https://static.wixstatic.com/media/711317_cd60ddf81c464493ade1652087f31a45~mv2.jpg/v1/fill/w_2500,h_1875,al_c/711317_cd60ddf81c464493ade1652087f31a45~mv2.jpg)` }}
          />
          <div className="hero__overlay" />
          <div className="hero__spotlights">
            <div className="spotlight spotlight--left" />
            <div className="spotlight spotlight--right" />
          </div>
          <div className="hero__noise" />
        </div>

        <div className="container hero__content">
          <div className="hero__left">
            <p className="section-label hero__eyebrow">Home of Delaware's Longest-Running Comedy Show</p>
            <h1 className="hero__headline display">
              Everything<br />
              <span className="hero__changes-line">
                Changes
                <img
                  src={SUPABASE_IMG('Afterdark_martini-glass-2.png')}
                  alt=""
                  className="hero__martini"
                  aria-hidden="true"
                />
              </span>
              <br />
              <span className="text-blue">AfterDARK</span>
            </h1>
            <p className="hero__sub">Get off the couch, we'll handle the rest.</p>
            <div className="hero__actions">
              <Link to="/tickets" className="btn btn-blue">Get Tickets</Link>
              <Link to="/events" className="btn btn-outline-white">See All Shows</Link>
            </div>
          </div>

          {/* Right: true crossfade slideshow */}
          <div className="hero__right">
            <div className="event-slideshow">
              <div
                className="event-slideshow__accent"
                style={{ background: EVENT_SLIDES[slideIndex].color }}
              />
              {EVENT_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`event-slideshow__photo ${i === slideIndex ? 'event-slideshow__photo--active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: slide.position }}
                />
              ))}
              <div className="event-slideshow__dots">
                {EVENT_SLIDES.map((slide, i) => (
                  <button
                    key={i}
                    className={`event-slideshow__dot ${i === slideIndex ? 'event-slideshow__dot--active' : ''}`}
                    style={i === slideIndex ? { background: slide.color, width: '24px' } : {}}
                    onClick={() => goTo(i)}
                    aria-label={slide.label}
                  />
                ))}
              </div>
            </div>
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
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker__segment">
              <span className="ticker__item ticker__item--show">Live Comedy &bull; Spoken Word &bull; Karaoke &bull; Open Mic &bull; Bear, Delaware &bull;</span>
              {REVIEWS.map((r, j) => (
                <span key={j} className="ticker__item ticker__item--review">
                  ★★★★★ &ldquo;{r.text}&rdquo; — {r.author} &bull;
                </span>
              ))}
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
                    <span className="show-card__live">Live</span>
                    <h3 className="show-card__name">{show.name}</h3>
                    <p className="show-card__meta">{show.venue} &bull; {show.time}</p>
                    <p className="show-card__desc">{show.desc}</p>
                    <div className="show-card__tags">
                      {show.tags.map((tag, t) => (
                        <span key={t} className="show-card__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="show-card__action">
                    {show.soldOut
                      ? <span className="show-card__sold-out">Sold Out</span>
                      : (
                        <Link to="/tickets" className="show-card__ticket-btn">
                          <span className="show-card__ticket-notch show-card__ticket-notch--left" />
                          <span className="show-card__ticket-text">🎟 Tickets</span>
                          <span className="show-card__ticket-notch show-card__ticket-notch--right" />
                        </Link>
                      )
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
      <section className="photo-strip" aria-label="AfterDARK atmosphere">
        <div className="photo-strip__track">
          {GALLERY_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className={`photo-strip__tile${photo.isBrandCard ? ' photo-strip__tile--brand' : ''}`}
              style={{ backgroundImage: `url(${photo.src})` }}
              aria-label={photo.alt}
            />
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
              <h2 className="private__title">Make It a<br /><span className="text-blue">Private Show</span></h2>
              <p className="private__desc">
                Birthdays. Corporate events. Celebrations. We bring Delaware's best comedy talent
                to your private event — fully customized, professionally produced, unforgettable.
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
                <Link to="/private-events" className="btn btn-outline-blue" style={{width:'100%'}}>Learn More</Link>
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
            <h2 className="radar-cta__title">Discover What's Happening<br /><span className="text-purple">Tonight, Right Now</span></h2>
            <p className="radar-cta__desc">
              AfterDARK Radar — the app built for people who decide what they're doing within 72 hours.
              Find live events near you, instantly.
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
            <h2 className="email-signup__title text-center">Never Miss a Show</h2>
            <p className="email-signup__desc text-center">
              Get early access to tickets, exclusive offers, and AfterDARK news delivered straight to your inbox.
            </p>
            <form className="email-signup__form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className="email-signup__input" aria-label="Email address" required />
              <button type="submit" className="btn btn-blue">Sign Me Up</button>
            </form>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
