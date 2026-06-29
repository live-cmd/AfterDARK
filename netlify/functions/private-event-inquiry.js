// Handles Private Event / VIP inquiries server-side.
// Brevo API key stays on the server — never exposed to the browser.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      name = '',
      email = '',
      phone = '',
      eventType = '',
      guestCount = '',
      preferredDate = '',
      message = '',
      vipOptIn = false,
    } = data;

    if (!email || !name || !eventType) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing required fields' }) };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const PRIVATE_EVENTS_LIST = 13;
    const VIP_LIST = 10;

    const listIds = [PRIVATE_EVENTS_LIST];
    if (vipOptIn) listIds.push(VIP_LIST);

    // Add/update contact in Brevo
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        phone,
        listIds,
        updateEnabled: true,
        attributes: {
          EVENT_TYPE: eventType,
          GUEST_COUNT: guestCount,
          PREFERRED_DATE: preferredDate,
          MESSAGE: message,
        },
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error('Brevo contact creation failed:', brevoRes.status, errText);
      return { statusCode: 502, body: JSON.stringify({ success: false, error: 'Brevo contact error' }) };
    }

    // Send notification email to AfterDARK
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'AfterDARK Website', email: 'live@cooljsafterdark.com' },
        to: [{ email: 'live@cooljsafterdark.com', name: "Cool J's AfterDARK" }],
        subject: `New Private Event Inquiry — ${eventType}`,
        htmlContent: `
          <h2>New Private Event Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Event Type:</strong> ${eventType}</p>
          <p><strong>Guest Count:</strong> ${guestCount}</p>
          <p><strong>Preferred Date:</strong> ${preferredDate}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>VIP Opt-in:</strong> ${vipOptIn ? 'Yes' : 'No'}</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Brevo notification email failed:', emailRes.status, errText);
      // Contact was still saved — don't fail the whole request over the notification email.
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('private-event-inquiry error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
