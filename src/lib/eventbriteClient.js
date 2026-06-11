const EB_API_KEY = process.env.REACT_APP_EVENTBRITE_API_KEY;
const EB_ORG_ID = process.env.REACT_APP_EVENTBRITE_ORG_ID;

const CACHE_KEY = 'eb_events_cache';
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

function getCached() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // storage full or unavailable — fail silently
  }
}

function normalizeEvent(ev) {
  const start = new Date(ev.start.local);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    id: `eb_${ev.id}`,
    source: 'eventbrite',
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
    sold_out: ev.capacity_is_custom ? false : (ev.capacity <= (ev.quantity_sold || 0)),
    featured: false,
    tags: [],
  };
}

export async function fetchEventbriteEvents() {
  const cached = getCached();
  if (cached) return cached;

  const url = `https://www.eventbriteapi.com/v3/organizations/${EB_ORG_ID}/events/?status=live&expand=venue,logo&order_by=start_asc&token=${EB_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Eventbrite API error: ${res.status}`);

  const json = await res.json();
  const normalized = (json.events || []).map(normalizeEvent);

  setCache(normalized);
  return normalized;
}
