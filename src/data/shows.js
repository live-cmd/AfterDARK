// ============================================
//   AFTERDARK — Shows Data
//   Edit this file to update events across
//   the Events and Tickets pages.
// ============================================

export const SHOWS = [
  {
    id: 'afd-jun-14',
    month: 'JUN',
    day: '14',
    year: '2026',
    date: '2026-06-14',
    name: 'AfterDARK Summer Kickoff',
    venue: 'Bear, DE',
    time: 'Doors 7PM · Show 8PM',
    desc: 'Kick off summer the right way. Headliner TBA.',
    longDesc: 'The summer season starts here. Cool J\'s AfterDARK brings Delaware\'s best night out to kick off the hottest months of the year. Headliner to be announced — you already know it\'s going to be a night.',
    eventbriteUrl: 'https://www.eventbrite.com', // replace with actual URL
    soldOut: false,
    featured: true,
    tags: ['Summer', 'Live Comedy'],
  },
  {
    id: 'afd-jun-28',
    month: 'JUN',
    day: '28',
    year: '2026',
    date: '2026-06-28',
    name: "Cool J's AfterDARK",
    venue: 'Bear, DE',
    time: 'Doors 7PM · Show 8PM',
    desc: "Delaware's longest-running comedy show returns.",
    longDesc: 'Seven years and still the best night out in Delaware. Cool J\'s AfterDARK is back with another stacked lineup of professional comedians from the Mid-Atlantic and beyond.',
    eventbriteUrl: 'https://www.eventbrite.com', // replace with actual URL
    soldOut: false,
    featured: false,
    tags: ['Live Comedy'],
  },
  {
    id: 'afd-jul-12',
    month: 'JUL',
    day: '12',
    year: '2026',
    date: '2026-07-12',
    name: 'Independence Laughs',
    venue: 'Bear, DE',
    time: 'Doors 7PM · Show 8PM',
    desc: 'A July tradition. Fire comedy, no fireworks required.',
    longDesc: 'Every July, AfterDARK delivers the kind of laughs that make the whole month worth it. No fireworks needed — just professional comedians and a crowd that\'s ready to have a real night out.',
    eventbriteUrl: 'https://www.eventbrite.com', // replace with actual URL
    soldOut: false,
    featured: false,
    tags: ['Live Comedy', 'July'],
  },
];

// Utility: get only upcoming shows (today or later)
export function getUpcomingShows() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return SHOWS.filter(show => new Date(show.date) >= today);
}

// Utility: get featured show
export function getFeaturedShow() {
  return SHOWS.find(show => show.featured) || SHOWS[0];
}
