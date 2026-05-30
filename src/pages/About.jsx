import './PageShell.css';

export default function About() {
  const titles = {
    Events: 'Upcoming Events',
    Performers: 'Performers',
    Tickets: 'Get Tickets',
    PrivateEvents: 'Private Events',
    Radar: 'AfterDARK Radar',
    About: 'Our Story',
    Submit: 'Performer Submissions',
  };
  return (
    <div className="page-shell">
      <div className="container">
        <h1 className="page-shell__title display text-gold">About</h1>
        <p className="page-shell__sub text-dim">Coming soon — this page is under construction.</p>
      </div>
    </div>
  );
}
