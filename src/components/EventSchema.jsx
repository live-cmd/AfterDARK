import { useEffect } from 'react';

export default function EventSchema({ shows = [] }) {
  useEffect(() => {
    const upcoming = shows.filter(s => new Date(s.date + 'T00:00:00') >= new Date());

    const events = upcoming.map(show => ({
      "@context": "https://schema.org",
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
          "price": show.price ?? "0",
          "priceCurrency": "USD",
          "availability": show.sold_out
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          "validFrom": new Date().toISOString()
        }
      } : {})
    }));

    // Google's Event rich-result spec wants standalone Event objects —
    // NOT events nested inside an ItemList/ListItem wrapper. Each show
    // gets its own <script type="application/ld+json"> tag so Googlebot
    // can parse them as independent, valid Event entities.
    const containerId = 'event-schema-ld-container';
    let container = document.getElementById(containerId);
    if (container) container.remove();

    if (events.length > 0) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.display = 'none';

      events.forEach((ev, i) => {
        const tag = document.createElement('script');
        tag.type = 'application/ld+json';
        tag.id = `event-schema-ld-${i}`;
        tag.textContent = JSON.stringify(ev);
        container.appendChild(tag);
      });

      document.head.appendChild(container);
    }

    return () => {
      const el = document.getElementById(containerId);
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
