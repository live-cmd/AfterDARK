import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Nav.css';

const NAV_LINKS = [
  { to: '/',              label: 'Home' },
  { to: '/events',        label: 'Events' },
  { to: '/performers',    label: 'Performers' },
  { to: '/tickets',       label: 'Tickets' },
  { to: '/private-events',label: 'Private Events' },
  { to: '/radar',         label: 'AfterDARK Radar' },
  { to: '/about',         label: 'Our Story' },
];

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${menuOpen ? ' nav--open' : ''}`}>
      <div className="nav__inner">

        {/* Logo */}
        <Link to="/" className="nav__logo">
          <div className="nav__logo-img-wrap">
            <img
              src={require('../assets/cooljsscript.png')}
              alt="Cool J's"
              className="nav__logo-script"
            />
          </div>
          <div className="nav__logo-divider" />
          <div className="nav__logo-text">
            <div className="nav__logo-ad">
              <span className="nav__logo-after">AFTER</span><span className="nav__logo-dark">DARK</span>
            </div>
            <div className="nav__logo-tag">LIVE ENTERTAINMENT</div>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="nav__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav__link${isActive ? ' nav__link--active' : ''}`
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <Link to="/tickets" className="btn btn-gold nav__cta">
          Get Tickets
        </Link>

        {/* Hamburger */}
        <button
          className="nav__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className="nav__mobile" aria-hidden={!menuOpen}>
        <nav className="nav__mobile-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav__mobile-link${isActive ? ' nav__mobile-link--active' : ''}`
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/tickets" className="btn btn-gold nav__mobile-cta">
            Get Tickets
          </Link>
        </nav>
      </div>
    </header>
  );
}
