import { useEffect } from 'react';

export default function EventSchema({ shows = [] }) {
  useEffect(() => {
    const upcoming = shows.filter(s => new Date(s.date + 'T00:00:00') >= new Date());

    const events = upcoming.map(show => ({
      "@type": "Event",
      "name": show.name,
      "startDate": show.date + (show.time ? 'T' + convertTo24(show.time) : 'T20:00:00'),
      "endDate": show.date + 'T23:59:00',
      "eventStatus": show.sold_out
        ? "https://schema.org/EventSoldOut"
        : "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": show.venue || "Cool J's AfterDARK Venue",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bear",
          "addressRegion": "DE",
          "addressCountry": "US"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "Cool J's AfterDARK",
        "url": "https://cooljsafterdark.com"
      },
      "image": show.image_url || "https://cooljsafterdark.com/og-image.jpg",
      ...(show.eventbrite_url && !show.is_free && !show.is_private ? {
        "offers": {
          "@type": "Offer",
          "url": show.eventbrite_url,
          "availability": show.sold_out
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          "validFrom": new Date().toISOString()
        }
      } : {})
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Cool J's AfterDARK — Upcoming Shows",
      "url": "https://cooljsafterdark.com/events",
      "itemListElement": events.map((ev, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": ev
      }))
    };

    const id = 'event-schema-ld';
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement('script');
      tag.id = id;
      tag.type = 'application/ld+json';
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [shows]);

  return null;
}

function convertTo24(timeStr) {
  try {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${hours.padStart(2,'0')}:${minutes || '00'}:00`;
  } catch {
    return '20:00:00';
  }
}
