import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { fetchEventbriteEvents } from '../lib/eventbriteClient';
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
      // Fetch Supabase and Eventbrite in parallel
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

      // Merge: dedupe by date+name, Eventbrite takes precedence for ticketed shows
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
  const featured = upcoming.find(s => s.featured) || upcoming[0];
  const displayed = filter === 'past' ? past : upcoming;

  function getTicketCTA(show, size = 'normal') {
    const btnClass = size === 'featured' ? 'btn btn-blue' : 'btn btn-outline-blue';
    if (show.sold_out) return <span className="event-sold-out">Sold Out</span>;
    if (show.is_private) return <Link to="/private-events" className={btnClass}>Request Booking</Link>;
    if (show.is_free) return <span className="event-free">Free Admission</span>;
    return <a href={show.eventbrite_url} target="_blank" rel="noopener noreferrer" className={btnClass}>{size === 'featured' ? 'Get Tickets' : 'Tickets'}</a>;
  }

  return (
    <div className="events-page">
      <EventSchema shows={shows} />

      {/* HERO */}
      <section className="events-hero">
        <div className="events-hero__bg" />
        <div className="container events-hero__content">
          <p className="section-label">Live Comedy · Live Entertainment · Bear, Delaware</p>
          <h1 className="display text-blue events-hero__title">
            Upcoming<br />Shows
          </h1>
          <p className="events-hero__sub text-dim">
            Every show is one night only. Don't find out you missed it.
          </p>
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
              {featured && (
                <div className="events-featured">
                  <div className="events-featured__img" style={featured.image_url ? { backgroundImage: `url(${featured.image_url})` } : {}}>
                    <div className="events-featured__overlay" />
                    <div className="events-featured__badge">Featured</div>
                    <div className="events-featured__content">
                      <div className="events-featured__left">
                        <div className="events-featured__date">
                          <span className="events-featured__month">{featured.month}</span>
                          <span className="events-featured__day">{featured.day}</span>
                          <span className="events-featured__year">{featured.year}</span>
                        </div>
                        <h2 className="events-featured__name">{featured.name}</h2>
                        <p className="events-featured__meta">{featured.venue} · {featured.time}</p>
                      </div>
                      <div className="events-featured__action">
                        {getTicketCTA(featured, 'featured')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
