import SEO from '../components/SEO';
import './ComedyChallenge.css';
import {
  COMEDIAN_APPLICATION_URL,
  AUDIENCE_TICKETS_URL,
  ENTRY_FEE,
  AUDIENCE_PRICING,
  ROUNDS,
  ELIMINATION_STEPS,
  CHECK_IN,
  JUDGING_CRITERIA,
  TIE_BREAKER_ORDER,
  PRIZES,
  RULES_PDF_PATH,
  PROMOTERS,
  GALLERY,
} from '../data/comedyChallenge';

export default function ComedyChallenge() {
  return (
    <div className="cc-page">
      <SEO
        path="/officially-funny"
        title="Officially Funny | Delaware's Stand-Up Comedy Competition — Cool J's, Bear, Delaware"
        description="Officially Funny is Delaware's stand-up comedy competition, spotlighting the state's next great voice. Apply to compete or get audience tickets at Cool J's AfterDARK."
      />

      {/* HERO */}
      <section className="cc-hero">
        <div className="cc-hero__bg" />
        <div className="container cc-hero__inner">
          <p className="section-label text-gold">Cool J's Presents</p>
          <h1 className="display cc-hero__title">
            Officially<br /><span className="text-gold">Funny</span>
          </h1>
          <p className="cc-hero__tagline">Delaware's Stand-Up Comedy Competition</p>
          <p className="cc-hero__stats">32 Comedians. 5 Rounds. 1 Name to Watch.</p>
          <p className="cc-hero__sub text-dim">
            Delaware's stand-up comedy competition, spotlighting the state's next great voice.
            Original material, five rounds, one comedian who walks away Officially Funny.
          </p>
          <div className="cc-hero__ctas">
            <a href={COMEDIAN_APPLICATION_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Apply to Compete ↗
            </a>
            <a href="#tickets" className="btn btn-outline-white">
              Get Audience Tickets
            </a>
          </div>
        </div>
      </section>

      {/* PROMOTED BY */}
      {PROMOTERS.length > 0 && (
        <section className="cc-promoters">
          <div className="container cc-promoters__inner">
            <p className="cc-promoters__label text-dim">In Partnership With</p>
            <div className="cc-promoters__row">
              {PROMOTERS.map((p, i) => (
                p.url ? (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cc-promoters__logo-link"
                    aria-label={p.name}
                  >
                    <img src={p.logo} alt={p.name} className="cc-promoters__logo" />
                  </a>
                ) : (
                  <img key={i} src={p.logo} alt={p.name} className="cc-promoters__logo" />
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {GALLERY.length > 0 && (
        <section className="cc-gallery section">
          <div className="container">
            <div className="cc-gallery__grid">
              {GALLERY.map((g, i) => (
                <div key={i} className="cc-gallery__item">
                  <img src={g.src} alt={g.alt} className="cc-gallery__img" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SCHEDULE */}
      <section className="cc-schedule section">
        <div className="container">
          <p className="section-label">Competition Framework</p>
          <span className="gold-line" />
          <h2 className="cc-section-title">Schedule & Venues</h2>

          <div className="cc-rounds">
            {ROUNDS.map(r => (
              <div key={r.round} className="cc-round-card">
                <div className="cc-round-card__num">Round {r.round}</div>
                <h3 className="cc-round-card__name">{r.name}</h3>
                <p className="cc-round-card__date">{r.dateLabel}</p>
                <div className="cc-round-card__venue-row">
                  {r.logo && <img src={r.logo} alt={`${r.venue} logo`} className="cc-round-card__logo" />}
                  <p className="cc-round-card__venue">{r.venue}</p>
                </div>
                <p className="cc-round-card__venue-type text-dim">{r.venueType}</p>
                <p className="cc-round-card__address text-dim">{r.address}</p>
                <div className="cc-round-card__meta">
                  <span>{r.comedians} Comedians</span>
                  <span>{r.setTime}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cc-elimination">
            {ELIMINATION_STEPS.map((step, i) => (
              <div className="cc-elimination__step" key={i}>
                <span className="cc-elimination__value">{step.value}</span>
                <span className="cc-elimination__label">{step.label}</span>
                {i < ELIMINATION_STEPS.length - 1 && <span className="cc-elimination__arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECK-IN */}
      <section className="cc-checkin section">
        <div className="container cc-checkin__inner">
          <div className="cc-checkin__item">
            <p className="section-label">Check-In Begins</p>
            <p className="cc-checkin__value">{CHECK_IN.checkInBegins}</p>
          </div>
          <div className="cc-checkin__item">
            <p className="section-label">Check-In Deadline</p>
            <p className="cc-checkin__value">{CHECK_IN.checkInDeadline}</p>
          </div>
          <div className="cc-checkin__item">
            <p className="section-label">Show Starts</p>
            <p className="cc-checkin__value">{CHECK_IN.showStarts} Sharp</p>
          </div>
          <p className="cc-checkin__warning">
            Comedians not checked in by {CHECK_IN.checkInDeadline} will be disqualified. No exceptions.
          </p>
        </div>
      </section>

      {/* JUDGING CRITERIA */}
      <section className="cc-judging section">
        <div className="container">
          <p className="section-label">How Winners Are Chosen</p>
          <span className="gold-line" />
          <h2 className="cc-section-title">Judging Criteria</h2>
          <p className="text-dim cc-judging__note">
            Each category is scored 0–10 points per judge, for a maximum possible score of
            50 points per judge.
          </p>

          <div className="cc-judging__grid">
            {JUDGING_CRITERIA.map(c => (
              <div key={c.num} className="cc-judging__card">
                <span className="cc-judging__num">{c.num}</span>
                <h3 className="cc-judging__name">{c.name}</h3>
                <p className="cc-judging__desc text-dim">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="cc-tiebreak">
            <p className="section-label">Tie-Breakers</p>
            <ol className="cc-tiebreak__list text-dim">
              {TIE_BREAKER_ORDER.map((t, i) => <li key={i}>{t}</li>)}
            </ol>
          </div>
        </div>
      </section>

      {/* PRIZES */}
      <section className="cc-prizes section">
        <div className="container">
          <p className="section-label">What's At Stake</p>
          <span className="gold-line" />
          <h2 className="cc-section-title">Prizes</h2>

          <div className="cc-prizes__grid">
            {PRIZES.map((p, i) => (
              <div key={i} className={`cc-prize-card${i === 0 ? ' cc-prize-card--first' : ''}`}>
                <h3 className="cc-prize-card__place">{p.place}</h3>
                {p.highlight && <p className="cc-prize-card__highlight text-gold">{p.highlight}</p>}
                <ul className="cc-prize-card__items">
                  {p.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTRY / APPLY */}
      <section className="cc-entry section" id="apply">
        <div className="container cc-entry__inner">
          <div>
            <p className="section-label">For Comedians</p>
            <span className="gold-line" />
            <h2 className="cc-section-title">Enter the Competition</h2>
            <ul className="cc-entry__list text-dim">
              <li>Entry fee: ${ENTRY_FEE}, paid at registration</li>
              <li>Entrants must be 18 years of age or older</li>
              <li>32 Round 1 spots are awarded through a selection process</li>
              <li>A 30–60 second video of your comedy performance is required as part of your application</li>
              <li>Entry fees are non-refundable under all circumstances</li>
            </ul>
            <a href={COMEDIAN_APPLICATION_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Apply to Compete ↗
            </a>
            <p className="cc-entry__note text-dim">
              Applications are reviewed privately and are not listed publicly on Eventbrite.
            </p>
          </div>
          <div className="cc-entry__rules">
            <p className="section-label">Full Details</p>
            <span className="gold-line" />
            <h3 className="cc-entry__rules-title">Official Rules</h3>
            <p className="text-dim">
              Eligibility, judging, code of conduct, media release, and everything else that
              governs the competition.
            </p>
            <a href={RULES_PDF_PATH} target="_blank" rel="noopener noreferrer" className="btn btn-outline-white">
              Download Official Rules (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* AUDIENCE TICKETS */}
      <section className="cc-tickets section" id="tickets">
        <div className="container">
          <p className="section-label">For Audiences</p>
          <span className="gold-line" />
          <h2 className="cc-section-title">Watch Live</h2>
          <p className="text-dim cc-tickets__note">
            Audience tickets are sold separately from comedian registration through Eventbrite.
          </p>

          <div className="cc-tickets__grid">
            {AUDIENCE_PRICING.map((t, i) => (
              <div key={i} className="cc-ticket-card">
                <h3 className="cc-ticket-card__label">{t.label}</h3>
                <p className="cc-ticket-card__price">
                  <span className="text-blue">${t.price}</span>
                </p>
                <p className="text-dim">{t.unit}</p>
              </div>
            ))}
          </div>

          <a href={AUDIENCE_TICKETS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
            Get Audience Tickets ↗
          </a>
        </div>
      </section>
    </div>
  );
}
