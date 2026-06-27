import './PageShell.css';
import './About.css';

export default function About() {
  return (
    <div className="story-page">
      {/* HERO */}
      <section className="story-hero">
        <div className="story-hero__bg" />
        <div className="container story-hero__content">
          <p className="section-label">Our Story</p>
          <h1 className="display text-blue story-hero__title">
            Everything Changes<br />AfterDARK
          </h1>
          <p className="story-hero__sub text-dim">
            From a single Saturday night in Bear, Delaware, to the state's
            longest-running comedy show — this is how Cool J's AfterDARK
            became the place where the city comes alive.
          </p>
        </div>
      </section>

      {/* ORIGIN */}
      <section className="section">
        <div className="container story-split">
          <div>
            <p className="section-label">How It Started</p>
            <span className="gold-line" />
            <h2 className="story-section__title">A Side Room With Big Ambitions</h2>
          </div>
          <div className="story-section__body text-dim">
            <p>
              Cool J's AfterDARK didn't start as a venue — it started as an idea
              scribbled on the back of a napkin: Delaware deserved a real night
              out. Not a one-off show in a borrowed banquet hall, but a place
              people could count on, week after week, for something live, loud,
              and unapologetically fun.
            </p>
            <p>
              The first comedy night drew a handful of regulars and a borrowed
              mic stand. There was no stage lighting to speak of, no fog
              machine, no line out the door — just a room full of people
              willing to laugh together in Bear, Delaware. That night became a
              second night. A second night became a residency. And that
              residency is now the longest continuously running comedy show in
              the state.
            </p>
            <p>
              Somewhere along the way, "the comedy show" stopped being the
              whole story. Karaoke nights packed the room. Live bands started
              asking to play. Poets and spoken word artists found a stage that
              actually listened. AfterDARK stopped being one thing and became
              a banner for all of it.
            </p>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOOD / COMMUNITY */}
      <section className="section" style={{ background: 'rgba(201,168,76,0.03)' }}>
        <div className="container story-split">
          <div>
            <p className="section-label">More Than A Venue</p>
            <span className="blue-line" />
            <h2 className="story-section__title">The Neighborhood's Living Room</h2>
          </div>
          <div className="story-section__body text-dim">
            <p>
              Bear doesn't have a downtown strip lined with marquees — what it
              has is AfterDARK. We're not trying to be a destination people
              drive an hour for and never come back to. We're trying to be
              the spot regulars walk past three times a week and finally walk
              into, the place where the bartender remembers your order and
              the comic on stage might be your neighbor.
            </p>
            <p>
              That's on purpose. Every show we book, every night we run, is
              built around the idea that a community needs somewhere to
              actually gather — not just scroll past on a feed. Local
              performers get a real stage to grow on. Local businesses get a
              partner for fundraisers and private events. Local regulars get
              a reason to leave the house on a Saturday that isn't a chain
              restaurant or a parking lot.
            </p>
            <p>
              We measure success the same way a neighborhood does — not by
              how far people traveled to get here, but by how many of them
              keep coming back.
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY / PILLARS */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="container">
          <p className="section-label">What We Believe</p>
          <span className="blue-line" />
          <h2 className="story-section__title">The AfterDARK Difference</h2>
          <p className="story-section__body text-dim">
            The name isn't just branding — it's the whole philosophy. Ordinary
            rooms, ordinary nights, ordinary crowds. Then the lights go down,
            the mic gets hot, and everything changes.
          </p>

          <div className="story-pillars">
            <div className="story-pillar">
              <div className="story-pillar__icon">🎤</div>
              <h3 className="story-pillar__title">Real Stages, Real People</h3>
              <p className="story-pillar__text text-dim">
                No velvet-rope pretension. AfterDARK is built for performers
                taking a real shot and audiences who showed up to be part of
                something, not just watch it.
              </p>
            </div>
            <div className="story-pillar">
              <div className="story-pillar__icon">🏆</div>
              <h3 className="story-pillar__title">Earned, Not Given</h3>
              <p className="story-pillar__text text-dim">
                "Longest-running" isn't a marketing line — it's a streak we've
                protected one Saturday at a time. Every format we run has to
                earn its place on the calendar.
              </p>
            </div>
            <div className="story-pillar">
              <div className="story-pillar__icon">✨</div>
              <h3 className="story-pillar__title">One Stage, Every Format</h3>
              <p className="story-pillar__text text-dim">
                Comedy, karaoke, live music, spoken word — different nights,
                same energy. If it's worth performing live, it's worth a slot
                on the AfterDARK calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section">
        <div className="container">
          <p className="section-label">The Streak</p>
          <span className="gold-line" />
          <h2 className="story-section__title">Milestones Worth Mentioning</h2>

          <div className="story-timeline">
            <div className="story-timeline__item">
              <p className="story-timeline__label">The First Night</p>
              <p className="story-timeline__text text-dim">
                A small room, a borrowed mic, and a crowd that decided to come
                back the following week. The residency that became Delaware's
                longest-running comedy show was born.
              </p>
            </div>
            <div className="story-timeline__item">
              <p className="story-timeline__label">Beyond Comedy</p>
              <p className="story-timeline__text text-dim">
                Karaoke, live music, and spoken word joined the lineup —
                AfterDARK became a full entertainment brand instead of a
                single weekly show.
              </p>
            </div>
            <div className="story-timeline__item">
              <p className="story-timeline__label">Legends AfterDARK</p>
              <p className="story-timeline__text text-dim">
                An induction wall honoring the performers who brought the
                house down hardest — a permanent thank-you to the people who
                built the streak with us.
              </p>
            </div>
            <div className="story-timeline__item">
              <p className="story-timeline__label">Right Now</p>
              <p className="story-timeline__text text-dim">
                A growing roster of performers, a packed events calendar, and
                a community that keeps proving Bear, Delaware can hold its own
                against any nightlife scene in the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section story-cta">
        <div className="container">
          <h2 className="story-cta__title">Be Part of the Next Chapter</h2>
          <p className="story-cta__sub text-dim">
            Whether you're looking for a seat, a stage, or a private event
            space — there's a place for you AfterDARK.
          </p>
          <div className="story-cta__actions">
            <a href="/tickets" className="btn btn-blue">Get Tickets →</a>
            <a href="/submit" className="btn btn-gold">Take The Stage →</a>
          </div>
        </div>
      </section>
    </div>
  );
}
