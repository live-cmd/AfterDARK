import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SHOWS, getUpcomingShows } from '../data/shows';
import './Events.css';

export default function Events() {
  const [filter, setFilter] = useState('all');
  const upcoming = getUpcomingShows();
  const past = SHOWS.filter(s => !getUpcomingShows().includes(s));

  const displayed = filter === 'past' ? past : upcoming;

  return (
    <div className="events-page">

      {/* ── HERO ── */}
      <section className="events-hero">
        <div className="events-hero__bg" />
        <div className="container events-hero__content">
          <p className="section-label">Live Entertainment · Bear, Delaware</p>
          <h1 className="display text-blue events-hero__title">
            Upcoming<br />Shows
          </h1>
          <p className="events-hero__sub text-dim">
            Every show is one night only. Don't find out you missed it.
          </p>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="events-tabs">
        <div className="container events-tabs__inner">
          <button
            className={`events-tab ${filter === 'all' ? 'events-tab--active' : ''}`}
            onClick={() => setFilter('all')}
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

      {/* ── SHOW LIST ── */}
      <section className="events-list section">
        <div className="container">
          {displayed.length === 0 ? (
            <div className="events-empty">
              <p className="text-dim">No shows to display right now. Check back soon.</p>
            </div>
          ) : (
            <div className="events-grid">
              {displayed.map((show, i) => (
                <article key={show.id} className={`event-card ${show.featured ? 'event-card--featured' : ''} ${show.soldOut ? 'event-card--sold-out' : ''}`}>

                  {show.featured && (
                    <div className="event-card__badge">Featured</div>
                  )}

                  <div className="event-card__date">
                    <span className="event-card__month">{show.month}</span>
                    <span className="event-card__day">{show.day}</span>
                    <span className="event-card__year">{show.year}</span>
                  </div>

                  <div className="event-card__body">
                    <h2 className="event-card__name">{show.name}</h2>
                    <p className="event-card__meta">
                      <span>{show.venue}</span>
                      <span className="event-card__dot">·</span>
                      <span>{show.time}</span>
                    </p>
                    <p className="event-card__desc">{show.longDesc}</p>
                    <div className="event-card__tags">
                      {show.tags.map(tag => (
                        <span key={tag} className="event-card__tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="event-card__action">
                    {show.soldOut ? (
                      <span className="event-card__sold-out">Sold Out</span>
                    ) : filter === 'past' ? (
                      <span className="event-card__past">Show Completed</span>
                    ) : (
                      <a
                        href={show.eventbriteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-blue"
                      >
                        Get Tickets
                      </a>
                    )}
                  </div>

                </article>
              ))}
            </div>
          )}

          {/* ── PRIVATE EVENTS CTA ── */}
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
