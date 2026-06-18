import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { fetchEventbriteEvents } from '../lib/eventbriteClient';
import FeaturedEvent from '../components/FeaturedEvent';
import './Events.css';
import EventSchema from '../components/EventSchema';

export default function Events() {
  const [filter, setFilter] = useState('upcoming');
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
      const [supabaseResult, eventbriteEvents] = await Promise.allSettled([
        supabase.from('shows').select('*').order('date', { ascending: true }),
        fetchEventbriteEvents()
      ]);

      const supabaseShows =
        supabaseResult.status === 'fulfilled' && !supabaseResult.value.error
          ? supabaseResult.value.data || []
          : [];

      const ebShows =
        eventbriteEvents.status === 'fulfilled' ? eventbriteEvents.value : [];

      const ebKeys = new Set(ebShows.map(e => `${e.date}|${e.name.toLowerCase()}`));
      const filteredSupabase = supabaseShows.filter(
        s => !ebKeys.has(`${s.date}|${s.name?.toLowerCase()}`)
      );

      const merged = [...ebShows, ...filteredSupabase].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      if (merged.length === 0 && supabaseResult.status === 'rejected' && eventbriteEvents.status === 'rejected') {
        setError(true);
      } else {
        setShows(merged);
      }
    } catch {
      setError(true);
    }

    setLoading(false);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = shows.filter(s => new Date(s.date + 'T00:00:00') >= today);
  const past = shows.filter(s => new Date(s.date + 'T00:00:00') < today);
  const displayed = filter === 'past' ? past : upcoming;

  function getTicketCTA(show, size = 'normal') {
    if (show.sold_out) return <span className="event-sold-out">Sold Out</span>;
    if (show.is_private) return <Link to="/private-events" className="event-row__ticket-btn"><span className="event-row__ticket-notch event-row__ticket-notch--left" /><span className="event-row__ticket-text">Request Booking</span><span className="event-row__ticket-notch event-row__ticket-notch--right" /></Link>;
    if (show.is_free) return <span className="event-free">Free Admission</span>;
    if (size === 'featured') {
      const href = show.eventbrite_url || '/tickets';
      const isExternal = href.startsWith('http');
      return isExternal
        ? <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-blue">Get Tickets</a>
        : <Link to={href} className="btn btn-blue">Get Tickets</Link>;
    }
    const href = show.eventbrite_url || '/tickets';
    const isExternal = href.startsWith('http');
    return isExternal
      ? <a href={href} target="_blank" rel="noopener noreferrer" className="event-row__ticket-btn"><span className="event-row__ticket-notch event-row__ticket-notch--left" /><span className="event-row__ticket-text">🏟 Tickets</span><span className="event-row__ticket-notch event-row__ticket-notch--right" /></a>
      : <Link to={href} className="event-row__ticket-btn"><span className="event-row__ticket-notch event-row__ticket-notch--left" /><span className="event-row__ticket-text">🏟 Tickets</span><span className="event-row__ticket-notch event-row__ticket-notch--right" /></Link>;
  }

  return (
    <div className="events-page">
      <EventSchema shows={shows} />

      {/* HERO — text left, featured card right */}
      <section className="events-hero">
        <div className="events-hero__bg" />
        <div className="container events-hero__inner">
          <div className="events-hero__text">
            <p className="section-label">Live Comedy · Live Entertainment · Bear, Delaware</p>
            <h1 className="display text-blue events-hero__title">
              Upcoming<br />Shows
            </h1>
            <p className="events-hero__sub text-dim">
              Every show is one night only. Don't find out you missed it.
            </p>
          </div>
          {filter === 'upcoming' && (
            <div className="events-hero__featured">
              <FeaturedEvent />
            </div>
          )}
        </div>
      </section>

      {/* FILTER TABS */}
      <div className="events-tabs">
        <div className="container events-tabs__inner">
          <button
            className={`events-tab ${filter === 'upcoming' ? 'events-tab--active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`events-tab ${filter === 'past' ? 'events-tab--active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past Shows
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <section className="events-list section">
        <div className="container">

          {loading && <div className="events-loading"><p className="text-dim">Loading shows...</p></div>}
          {error && <div className="events-empty"><p className="text-dim">Couldn't load shows right now. Check back soon.</p></div>}
          {!loading && !error && displayed.length === 0 && (
            <div className="events-empty">
              <p className="text-dim">{filter === 'past' ? 'No past shows to display.' : 'No upcoming shows right now. Check back soon.'}</p>
            </div>
          )}

          {!loading && !error && displayed.length > 0 && filter === 'upcoming' && (
            <>
              <p className="events-all-label section-label">All Upcoming Shows</p>
              <div className="events-grid">
                {displayed.map(show => (
                  <div key={show.id} className="event-row">
                    <div className="event-row__thumb" style={show.image_url ? { backgroundImage: `url(${show.image_url})` } : {}} />
                    <div className="event-row__date">
                      <span className="event-row__month">{show.month}</span>
                      <span className="event-row__day">{show.day}</span>
                      <span className="event-row__year">{show.year}</span>
                    </div>
                    <div className="event-row__info">
                      <h3 className="event-row__name">{show.name}</h3>
                      <p className="event-row__meta text-dim">{show.venue} · {show.time}</p>
                      {show.description && (
                        <p className="event-row__desc">
                          {show.description.length > 100
                            ? show.description.slice(0, 100).trimEnd() + '…'
                            : show.description}
                        </p>
                      )}
                      {show.tags?.length > 0 && (
                        <div className="event-row__tags">
                          {show.tags.map(tag => <span key={tag} className="event-row__tag">{tag}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="event-row__action">
                      {getTicketCTA(show)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && displayed.length > 0 && filter === 'past' && (
            <div className="events-grid">
              {displayed.map(show => (
                <div key={show.id} className="event-row event-row--past">
                  <div className="event-row__thumb" style={show.image_url ? { backgroundImage: `url(${show.image_url})` } : {}} />
                  <div className="event-row__date">
                    <span className="event-row__month">{show.month}</span>
                    <span className="event-row__day">{show.day}</span>
                    <span className="event-row__year">{show.year}</span>
                  </div>
                  <div className="event-row__info">
                    <h3 className="event-row__name">{show.name}</h3>
                    <p className="event-row__meta text-dim">{show.venue} · {show.time}</p>
                    {show.description && (
                      <p className="event-row__desc">
                        {show.description.length > 100
                          ? show.description.slice(0, 100).trimEnd() + '…'
                          : show.description}
                      </p>
                    )}
                  </div>
                  <div className="event-row__action">
                    <span className="event-past">Show Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="events-private-cta">
            <div className="events-private-cta__inner">
              <p className="section-label">Looking for Something Different?</p>
              <h3 className="events-private-cta__title">Book a Private Show</h3>
              <p className="text-dim">Birthdays, corporate events, celebrations — we bring the AfterDARK experience to your occasion.</p>
              <Link to="/private-events" className="btn btn-outline-blue">Learn More</Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
