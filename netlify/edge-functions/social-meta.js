import { HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/base64.ts';

// Netlify Edge Function: overrides <title>, canonical, meta description,
// and og:*/twitter:* tags server-side, per route, for pages that need a
// distinct social share preview.
//
// Why this exists: this app is a pure client-side-rendered React SPA with
// no SSR/prerendering. src/components/SEO.jsx (react-helmet-async) only
// patches these tags into the DOM after the page mounts and JS runs. A
// real browser tab reflects that fine, and Google's renderer executes JS
// too -- but link-preview crawlers (Facebook, Twitter/X, iMessage, Slack,
// WhatsApp, etc.) fetch the raw HTML and do NOT execute JavaScript, so
// they only ever see whatever public/index.html shipped statically: the
// site-wide default title/description/og-image, regardless of which page
// was actually shared. Confirmed via a raw fetch of /vibe after the
// client-side-only fix (PR #15) -- og:image was still the generic
// default. Same root cause family as the EventSchema bug (see
// event-schema.js), just a different symptom (share cards vs. Rich
// Results Test).
//
// Fix: rewrite the actual HTML response at request time so the very
// first response byte already has the right tags -- no client JS
// execution required on the crawler's end.
//
// Fails open: if anything errors, the original (unmodified) response is
// returned untouched so this can never break the page for a real visitor.

const SITE_URL = 'https://cooljsafterdark.com';

// Add an entry here for any other page that needs its own share preview.
const PAGE_META = {
  '/vibe': {
    title: "Get the AfterDARK Vibe | Cool J's AfterDARK",
    description:
      "You found us. Tell us what you're into — comedy, karaoke, open mic, and more — and we'll make sure you never miss the vibe at Cool J's AfterDARK in Bear, DE.",
    image: 'https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/website-images/comedy_comedian-wide-shot-1.jpeg',
  },
};

function noStore(res) {
  const headers = new Headers(res.headers);
  headers.set('Cache-Control', 'no-store, must-revalidate');
  headers.delete('Age');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

class TitleHandler {
  constructor(value) { this.value = value; }
  element(element) { element.setInnerContent(this.value); }
}

class AttrHandler {
  constructor(attr, value) { this.attr = attr; this.value = value; }
  element(element) { element.setAttribute(this.attr, this.value); }
}

export default async (request, context) => {
  const response = await context.next();

  try {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const url = new URL(request.url);
    const meta = PAGE_META[url.pathname];
    if (!meta) return response;

    const pageUrl = `${SITE_URL}${url.pathname}`;

    const rewriter = new HTMLRewriter()
      .on('title', new TitleHandler(meta.title))
      .on('link[rel="canonical"]', new AttrHandler('href', pageUrl))
      .on('meta[name="description"]', new AttrHandler('content', meta.description))
      .on('meta[property="og:url"]', new AttrHandler('content', pageUrl))
      .on('meta[property="og:title"]', new AttrHandler('content', meta.title))
      .on('meta[property="og:description"]', new AttrHandler('content', meta.description))
      .on('meta[property="og:image"]', new AttrHandler('content', meta.image))
      .on('meta[name="twitter:title"]', new AttrHandler('content', meta.title))
      .on('meta[name="twitter:description"]', new AttrHandler('content', meta.description))
      .on('meta[name="twitter:image"]', new AttrHandler('content', meta.image));

    return noStore(rewriter.transform(response));
  } catch {
    return response;
  }
};

export const config = {
  path: ['/vibe'],
};
