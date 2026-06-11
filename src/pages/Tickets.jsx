import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { fetchEventbriteEvents } from '../lib/eventbriteClient';
import './Tickets.css';

function getTicketCTA(show, variant = 'list') {
  const btnClass = variant === 'featured' ? 'btn btn-blue tickets-featured__cta' : 'btn btn-outline-blue';
  const label = variant === 'featured' ? 'Get Tickets on Eventbrite ↗' : 'Tickets ↗';

  if (show.sold_out) return <span className="tickets-sold-out">Sold Out</span>;
  if (show.is_private) return <Link to="/private-events" className={btnClass}>Request Booking</Link>;
  if (show.is_free) return <span className="tickets-free">Free Admission</span>;
  return (
    <a href={show.eventbrite_url} target="_blank" rel="noopener noreferrer" className={btnClass}>
      {label}
    </a>
  );
}

export default function Tickets() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchShows();
  }, []);

  async function fetchShows() {
    setLoading(true);
    setError(false);

    try {
      const [supabaseResult, ebResult] = await Promise.allSettled([
        supabase.from('shows').select('*').order('date', { ascending: true }),
        fetchEventbriteEvents()
      ]);

      const supabaseShows =
        supabaseResult.status === 'fulfilled' && !supabaseResult.value.error
          ? supabaseResult.value.data || []
          : [];

      const ebShows = ebResult.status === 'fulfilled' ? ebResult.value : [];

      const ebKeys = new Set(ebShows.map(e => `${e.date}|${e.name.toLowerCase()}`));
      const filteredSupabase = supabaseShows.filter(
        s => !ebKeys.has(`${s.date}|${s.name?.toLowerCase()}`)
      );

      const merged = [...ebShows, ...filteredSupabase].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setShows(merged);
    } catch {
      setError(true);
    }

    setLoading(false);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = shows.filter(s => new Date(s.date + 'T00:00:00') >= today);
  const featured = upcoming.find(s => s.featured) || upcoming[0];

  return (
    <div className="tickets-page">

      {/* HERO */}
      <section className="tickets-hero">
        <div className="tickets-hero__bg" />
        <div className="container tickets-hero__content">
          <p className="section-label">Secure Your Seat</p>
          <h1 className="display text-blue tickets-hero__title">
            Get<br />Tickets
          </h1>
          <p className="tickets-hero__sub text-dim">
            All tickets sold through Eventbrite — secure checkout, instant confirmation.
          </p>
        </div>
      </section>

      {/* FEATURED SHOW */}
      {!loading && featured && (
        <section className="tickets-featured section">
          <div className="container">
            <p className="section-label">Next Up</p>
            <span className="blue-line" />
            <div className="tickets-featured__card">
              <div className="tickets-featured__left">
                <div className="tickets-featured__date-block">
                  <span className="tickets-featured__month">{featured.month}</span>
                  <span className="tickets-featured__day">{featured.day}</span>
                  <span className="tickets-featured__year">{featured.year}</span>
                </div>
              </div>
              <div className="tickets-featured__body">
                <h2 className="tickets-featured__name">{featured.name}</h2>
                <p className="tickets-featured__meta">{featured.venue} · {featured.time}</p>
                <p className="tickets-featured__desc">{featured.description}</p>
                <div className="tickets-featured__actions">
                  {getTicketCTA(featured, 'featured')}
                  <Link to="/events" className="btn btn-outline-white">View All Shows</Link>
                </div>
                {!featured.is_private && !featured.is_free && !featured.sold_out && (
                  <p className="tickets-eventbrite-note text-dim">
                    You'll be taken to Eventbrite to complete your purchase securely.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL UPCOMING SHOWS */}
      <section className="tickets-all section">
        <div className="container">
          <p className="section-label">All Upcoming Shows</p>
          <span className="blue-line" />
          {loading ? (
            <p className="text-dim" style={{padding:'40px 0'}}>Loading shows...</p>
          ) : error ? (
            <p className="text-dim" style={{padding:'40px 0'}}>Couldn't load shows right now. Check back soon.</p>
          ) : upcoming.length === 0 ? (
            <p className="text-dim" style={{padding:'40px 0'}}>No upcoming shows right now. Check back soon.</p>
          ) : (
            <div className="tickets-list">
              {upcoming.map(show => (
                <div key={show.id} className="ticket-row">
                  <div className="ticket-row__date">
                    <span className="ticket-row__month">{show.month}</span>
                    <span className="ticket-row__day">{show.day}</span>
                  </div>
                  <div className="ticket-row__info">
                    <h3 className="ticket-row__name">{show.name}</h3>
                    <p className="ticket-row__meta text-dim">{show.venue} · {show.time}</p>
                  </div>
                  <div className="ticket-row__action">
                    {getTicketCTA(show, 'list')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="tickets-faq section">
        <div className="container tickets-faq__inner">
          <p className="section-label">Good to Know</p>
          <span className="blue-line" />
          <div className="tickets-faq__grid">
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item">
                <h4 className="faq-item__q">{item.q}</h4>
                <p className="faq-item__a text-dim">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVATE CTA */}
      <section className="tickets-private section">
        <div className="container tickets-private__inner">
          <div>
            <p className="section-label">Private Events</p>
            <h3 className="tickets-private__title">
              Want the Whole Show<br />
              <span className="text-blue">to Yourself?</span>
            </h3>
            <p className="text-dim">Book AfterDARK for your private event. Birthdays, corporate nights, celebrations — fully produced and unforgettable.</p>
          </div>
          <Link to="/private-events" className="btn btn-blue">Request a Quote</Link>
        </div>
      </section>

    </div>
  );
}

const FAQ = [
  { q: 'Where do I buy tickets?', a: 'All tickets are sold through Eventbrite. Click any "Get Tickets" button and you\'ll be taken directly to the secure checkout page.' },
  { q: 'Is there a will-call or door policy?', a: 'Yes — show your Eventbrite confirmation on your phone at the door. We recommend arriving by doors open time to get your seat.' },
  { q: 'What\'s the refund policy?', a: 'Refund policies are managed through Eventbrite and vary by show. Check the individual event page for details before purchasing.' },
  { q: 'Are shows 21+?', a: 'Most AfterDARK shows are 18+. Age requirements are listed on each event page on Eventbrite.' },
  { q: 'Can I buy tickets at the door?', a: 'Door tickets may be available if the show is not sold out, but we strongly recommend buying in advance to guarantee your seat.' },
  { q: 'What time should I arrive?', a: 'Doors open at 7PM, show starts at 8PM. We recommend arriving by 7:30PM to settle in.' },
];
