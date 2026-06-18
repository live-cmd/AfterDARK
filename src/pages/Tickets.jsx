import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { fetchEventbriteEvents } from '../lib/eventbriteClient';
import FeaturedEvent from '../components/FeaturedEvent';
import './Tickets.css';
import EventSchema from '../components/EventSchema';

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

  return (
    <div className="tickets-page">
      <EventSchema shows={shows} />

      {/* HERO — text left, featured card right */}
      <section className="tickets-hero">
        <div className="tickets-hero__bg" />
        <div className="container tickets-hero__inner">
          <div className="tickets-hero__text">
            <p className="section-label">Secure Your Seat</p>
            <h1 className="display text-blue tickets-hero__title">
              Get<br />Tickets
            </h1>
            <p className="tickets-hero__sub text-dim">
              All tickets sold through Eventbrite — secure checkout, instant confirmation.
            </p>
          </div>
          <div className="tickets-hero__featured">
            <FeaturedEvent />
          </div>
        </div>
      </section>

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
