import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">

        <div className="footer__top">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img
                src={require('../assets/cooljsscript.png')}
                alt="Cool J's"
                className="footer__logo-script"
              />
              <div className="footer__logo-ad">
                <span className="footer__logo-after">AFTER</span><span className="footer__logo-dark">DARK</span>
              </div>
            </div>
            <p className="footer__tagline">Everything Changes AfterDARK</p>
            <p className="footer__sub">
              Delaware's longest-running comedy show. Live entertainment,
              live laughs, live community.
            </p>
            <div className="footer__socials">
              <a href="https://instagram.com/cooljsafterdark" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://facebook.com/cooljsafterdark" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@cooljsafterdark" target="_blank" rel="noreferrer" aria-label="TikTok" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="footer__nav">
            <div className="footer__col">
              <h4 className="footer__col-title">Shows</h4>
              <ul>
                <li><Link to="/events">Upcoming Events</Link></li>
                <li><Link to="/tickets">Get Tickets</Link></li>
                <li><Link to="/performers">Performers</Link></li>
                <li><Link to="/private-events">Private Events</Link></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Company</h4>
              <ul>
                <li><Link to="/about">Our Story</Link></li>
                <li><Link to="/radar">AfterDARK Radar</Link></li>
                <li><Link to="/submit">Performer Submissions</Link></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Contact</h4>
              <ul>
                <li><a href="mailto:info@cooljsafterdark.com">info@cooljsafterdark.com</a></li>
                <li><span className="footer__location">Bear, Delaware</span></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} Cool J's AfterDARK. All rights reserved. A CJP Ventures brand.
          </p>
          <p className="footer__statement">
            Get off the couch, we'll handle the rest.
          </p>
        </div>

      </div>
    </footer>
  );
}
