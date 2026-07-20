// ============================================
//   AFTERDARK — Comedy Challenge Championship
//   Edit this file to update competition details,
//   schedule, prizes, and registration/ticket links.
// ============================================

// Comedian applications go through a PRIVATE (unlisted) Eventbrite event —
// not publicly listed/searchable on Eventbrite. Share this link only via
// this page, socials, flyers, etc.
export const COMEDIAN_APPLICATION_URL = 'https://www.eventbrite.com'; // replace with actual private Eventbrite link

// Audience tickets go through a separate PUBLIC Eventbrite event/listing.
export const AUDIENCE_TICKETS_URL = 'https://www.eventbrite.com'; // replace with actual public Eventbrite link

export const ENTRY_FEE = 25;

export const AUDIENCE_PRICING = [
  { label: 'Single Round', price: 15, unit: '/ round' },
  { label: 'All-Event Pass', price: 50, unit: 'all 5 rounds' },
];

export const ROUNDS = [
  {
    round: 1,
    name: 'Preliminary',
    date: '2026-08-04',
    dateLabel: 'Tue, Aug 4',
    show: "Cool J's After Dark",
    venue: "Cool J's After Dark",
    venueType: 'Comedy Club',
    address: '1857 Pulaski Hwy, Bear, DE 19701',
    comedians: 32,
    setTime: '3:30 min/sec',
    logo: '/officially-funny/AfterDARK-officially-funny-icon.png',
  },
  {
    round: 2,
    name: 'Elimination',
    date: '2026-08-05',
    dateLabel: 'Wed, Aug 5',
    show: 'Plated Soul',
    venue: 'Plated Soul',
    venueType: 'Restaurant & Lounge',
    address: '2 Chesmar Plaza, Newark, DE 19713',
    comedians: 20,
    setTime: '3:30 min/sec',
    logo: '/partners/plated-soul.png',
  },
  {
    round: 3,
    name: 'Semifinals',
    date: '2026-08-06',
    dateLabel: 'Thu, Aug 6',
    show: 'Milk N Honey',
    venue: 'Milk N Honey',
    venueType: 'Coffeehouse',
    address: '239 Market St, Wilmington, DE 19801',
    comedians: 10,
    setTime: '5:00 min',
    logo: '/partners/milk-n-honey.png',
  },
  {
    round: 4,
    name: 'Championship Qualifier',
    date: '2026-08-07',
    dateLabel: 'Fri, Aug 7',
    show: "Cool J's After Dark",
    venue: "Cool J's After Dark",
    venueType: 'Comedy Club',
    address: '1857 Pulaski Hwy, Bear, DE 19701',
    comedians: 5,
    setTime: '5:00 min',
    logo: '/officially-funny/AfterDARK-officially-funny-icon.png',
  },
  {
    round: 5,
    name: 'Grand Finale',
    date: '2026-08-08',
    dateLabel: 'Sat, Aug 8',
    show: "Cool J's After Dark",
    venue: "Cool J's After Dark",
    venueType: 'Comedy Club',
    address: '1857 Pulaski Hwy, Bear, DE 19701',
    comedians: 3,
    setTime: '7:00 min',
    logo: '/officially-funny/AfterDARK-officially-funny-icon.png',
  },
];

export const ELIMINATION_STEPS = [
  { label: 'Start', value: 32 },
  { label: 'Advance', value: 20 },
  { label: 'Advance', value: 10 },
  { label: 'Advance', value: 5 },
  { label: 'Champion', value: 1 },
];

export const CHECK_IN = {
  checkInBegins: '7:30 PM',
  checkInDeadline: '7:55 PM',
  showStarts: '8:00 PM',
};

export const JUDGING_CRITERIA = [
  {
    num: 1,
    name: 'Originality & Authentic Voice',
    desc: "Original material and a unique comedic voice that is authentically the performer's own.",
    points: ['Original content', 'Distinctive style', 'Authenticity', 'Fresh perspective'],
  },
  {
    num: 2,
    name: 'Stage Command',
    desc: 'How well the comedian commands the stage, controls the audience, and delivers their set.',
    points: ['Presence & confidence', 'Pacing & timing', 'Moves the audience', 'Keeps attention'],
  },
  {
    num: 3,
    name: 'Comedic Competence',
    desc: 'Demonstrated ability and technical skill as a stand-up comedian.',
    points: ['Listening & crowd awareness', 'Voice/characters/impersonations', 'Callbacks & play-off errors', 'Improvisation & recovery', 'Transitions & delivery'],
  },
  {
    num: 4,
    name: 'Comedic Reach',
    desc: "How broadly the comedian's style appeals to different audiences and venues.",
    points: ['Mass appeal potential', 'Relatable across demographics', 'Works in various settings', 'Not limited to a niche'],
  },
  {
    num: 5,
    name: 'Professionalism',
    desc: 'Professional conduct from arrival to exit and everything in between.',
    points: ['Arrives prepared', 'Mic & stage awareness', 'Respects time & cues', 'Interacts professionally', 'Smooth entry & exit'],
  },
];

export const TIE_BREAKER_ORDER = [
  'Highest Comedic Competence score',
  'If still tied, highest Comedic Reach score',
  'If still tied, highest Professionalism score',
];

export const PRIZES = [
  {
    place: '1st Place',
    highlight: '$250 Cash',
    items: [
      "7-minute guest spot on the Comedy@Cool J's show",
      '90-minute comedy set workshop session',
      '15-minute headline set in the Comedy Showcase',
    ],
  },
  {
    place: '2nd & 3rd Place',
    highlight: null,
    items: [
      "7-minute guest spot on the Comedy@Cool J's show",
    ],
  },
];

export const RULES_PDF_PATH = '/cool-js-comedy-challenge-rules.pdf';

// Shown as a logo strip near the top of the page. Venue partners (Plated
// Soul, Milk N Honey) also get recognition contextually on their own round
// cards above. Logos with a `url` are clickable; Rani Daze has no website.
export const PROMOTERS = [
  { name: 'Plated Soul', logo: '/partners/plated-soul.png', url: 'https://platedsoulbyauntvonda.com' },
  { name: 'Milk N Honey', logo: '/partners/milk-n-honey.png', url: 'https://getmilkandhoney.com' },
  { name: 'Rani Daze Brings Laughter', logo: '/partners/rani-daze.png' },
  { name: "Zeola's Comedy Room", logo: '/partners/zeolas-comedy-room.png', url: 'https://zeolascomedyroom.com' },
];

// Live-show photos from Cool J's After Dark, shown in a gallery strip on
// the page to give it some energy/atmosphere.
export const GALLERY = [
  { src: '/officially-funny/performance_kareem-green-wide-1.jpg', alt: "Comedian performing to a packed room at Cool J's After Dark" },
  { src: '/officially-funny/performance_kool-bubba-ice-2.jpg', alt: "Comedian on stage under blue lights at Cool J's After Dark" },
  { src: '/officially-funny/performance_open-mic-speaker-2.jpg', alt: "Comedian mid-set with the crowd at Cool J's After Dark" },
];
