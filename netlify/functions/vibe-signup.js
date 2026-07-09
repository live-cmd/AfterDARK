// Handles /vibe landing page signups.
// Writes interest + UTM data to Supabase (internal use), and email to Brevo VIP list.
const SUPABASE_URL = 'https://psxvjiuufwwcqrkdpueh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_M6rVL6iN53U8DyZkCi9oMQ_Mm4FjfLm';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { email = '', interests = [], utm_source = null, utm_medium = null, utm_campaign = null } = data;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Valid email required' }) };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const VIP_LIST = 10;

    // 1. Write to Supabase (internal preference data) — RLS allows anon insert only
    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/social_landing_signups`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        interests,
        utm_source,
        utm_medium,
        utm_campaign,
      }),
    });

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      console.error('Supabase insert failed:', supabaseRes.status, errText);
      // Continue to Brevo even if Supabase fails — don't lose the email capture
    }

    // 2. Add to Brevo VIP list
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [VIP_LIST],
        updateEnabled: true,
        attributes: {
          INTERESTS: interests.join(', '),
        },
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error('Brevo contact creation failed:', brevoRes.status, errText);
      return { statusCode: 502, body: JSON.stringify({ success: false, error: 'Brevo contact error' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('vibe-signup error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
