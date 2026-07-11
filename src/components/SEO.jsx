import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://cooljsafterdark.com';
const DEFAULT_TITLE = "Cool J's AfterDARK | Delaware's Premier Comedy & Live Entertainment Show";
const DEFAULT_DESCRIPTION =
  "Cool J's AfterDARK — Delaware's longest-running comedy show in Bear, DE. Live comedy, karaoke, live music, and spoken word. Everything Changes AfterDARK.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

// Per-page <head> tags (title, description, canonical, OG/Twitter).
//
// Why this exists: the app is a pure client-side-rendered React SPA with no
// SSR/prerendering, and public/index.html is served as-is for every route
// (Netlify SPA rewrite). Before this component, that static HTML's
// hardcoded <link rel="canonical" href="https://cooljsafterdark.com">
// was shipped unchanged on /events, /tickets, etc. — telling Google those
// pages were duplicates of the homepage. Helmet overwrites these tags after
// mount, which Googlebot's renderer (and the Rich Results Test) will pick
// up since both execute JS.
export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
}) {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
