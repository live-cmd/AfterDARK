// TEMPORARY DIAGNOSTICS VERSION -- see PR description. Revert once the
// runtime failure is identified.

const SUPABASE_URL = 'https://psxvjiuufwwcqrkdpueh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_M6rVL6iN53U8DyZkCi9oMQ_Mm4FjfLm';
const SITE_URL = 'https://cooljsafterdark.com';

function convertTo24(timeStr) {
  try {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${hours.padStart(2, '0')}:${minutes || '00'}:00`;
  } catch {
    return '20:00:00';
  }
}

async function fetchSupabaseShows() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/shows?select=*&order=date.asc`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

async function fetchEventbriteEvents(apiKey, orgId) {
  if (!apiKey || !orgId) throw new Error(`Missing Eventbrite credentials (apiKey present: ${!!apiKey}, orgId present: ${!!orgId})`);
  const url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&expand=venue,logo&order_by=start_asc&token=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Eventbrite error: ${res.status} ${await res.text().catch(() => '')}`);
  const json = await res.json();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (json.events || []).map(ev => {
    const start = new Date(ev.start.local);
    return {
      id: `eb_${ev.id}`,
      name: ev.name.text,
      date: ev.start.local.split('T')[0],
      month: months[start.getMonth()],
      day: String(start.getDate()),
      year: String(start.getFullYear()),
      time: start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      venue: ev.venue?.name || 'TBA',
      image_url: ev.logo?.url || null,
      eventbrite_url: ev.url,
      is_free: ev.is_free,
      is_private: false,
      sold_out: ev.capacity_is_custom ? false : ev.capacity <= (ev.quantity_sold || 0),
    };
  });
}

function buildEventLd(show) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: show.name,
    startDate: show.date + (show.time ? 'T' + convertTo24(show.time) : 'T20:00:00'),
    endDate: show.date + 'T23:59:00',
    eventStatus: show.sold_out ? 'https://schema.org/EventSoldOut' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: show.venue || "Cool J's AfterDARK Venue",
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bear',
        addressRegion: 'DE',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: "Cool J's AfterDARK",
      url: SITE_URL,
    },
    image: show.image_url || `${SITE_URL}/og-image.jpg`,
    ...(show.eventbrite_url && !show.is_free && !show.is_private
      ? {
          offers: {
            '@type': 'Offer',
            url: show.eventbrite_url,
            price: show.price ?? '0',
            priceCurrency: 'USD',
            availability: show.sold_out ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            validFrom: new Date().toISOString(),
          },
        }
      : {}),
  };
}

export default async (request, context) => {
  const response = await context.next();
  const diag = { steps: [] };

  try {
    const contentType = response.headers.get('content-type') || '';
    diag.contentType = contentType;
    if (!contentType.includes('text/html')) return response;

    const apiKey = Netlify.env.get('REACT_APP_EVENTBRITE_API_KEY');
    const orgId = Netlify.env.get('REACT_APP_EVENTBRITE_ORG_ID');
    diag.apiKeyPresent = !!apiKey;
    diag.orgIdPresent = !!orgId;

    const [supabaseResult, eventbriteResult] = await Promise.allSettled([
      fetchSupabaseShows(),
      fetchEventbriteEvents(apiKey, orgId),
    ]);

    diag.supabaseStatus = supabaseResult.status;
    diag.supabaseCount = supabaseResult.status === 'fulfilled' ? supabaseResult.value.length : undefined;
    diag.supabaseError = supabaseResult.status === 'rejected' ? String(supabaseResult.reason) : undefined;

    diag.eventbriteStatus = eventbriteResult.status;
    diag.eventbriteCount = eventbriteResult.status === 'fulfilled' ? eventbriteResult.value.length : undefined;
    diag.eventbriteError = eventbriteResult.status === 'rejected' ? String(eventbriteResult.reason) : undefined;

    const supabaseShows = supabaseResult.status === 'fulfilled' ? supabaseResult.value : [];
    const ebShows = eventbriteResult.status === 'fulfilled' ? eventbriteResult.value : [];

    const ebKeys = new Set(ebShows.map(e => `${e.date}|${e.name.toLowerCase()}`));
    const filteredSupabase = supabaseShows.filter(s => !ebKeys.has(`${s.date}|${(s.name || '').toLowerCase()}`));

    const merged = [...ebShows, ...filteredSupabase].sort((a, b) => new Date(a.date) - new Date(b.date));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = merged.filter(s => new Date(s.date + 'T00:00:00') >= today);
    diag.mergedCount = merged.length;
    diag.upcomingCount = upcoming.length;

    const diagComment = `<!-- event-schema-debug ${JSON.stringify(diag).replace(/-->/g, '')} -->`;

    if (upcoming.length === 0) {
      class DiagOnlyInjector {
        element(element) {
          element.append(diagComment, { html: true });
        }
      }
      return new HTMLRewriter().on('head', new DiagOnlyInjector()).transform(response);
    }

    const scriptTags = upcoming
      .map(show => `<script type="application/ld+json">${JSON.stringify(buildEventLd(show))}</script>`)
      .join('\n');

    class HeadInjector {
      element(element) {
        element.append(diagComment + '\n' + scriptTags, { html: true });
      }
    }

    return new HTMLRewriter().on('head', new HeadInjector()).transform(response);
  } catch (err) {
    diag.topLevelError = String(err && err.stack || err);
    const diagComment = `<!-- event-schema-debug ${JSON.stringify(diag).replace(/-->/g, '')} -->`;
    try {
      class ErrInjector {
        element(element) {
          element.append(diagComment, { html: true });
        }
      }
      return new HTMLRewriter().on('head', new ErrInjector()).transform(response);
    } catch {
      return response;
    }
  }
};

export const config = {
  path: ['/events', '/tickets'],
};
