exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const { token } = JSON.parse(event.body || '{}');
    if (!token) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing token' }) };
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const params = new URLSearchParams({ secret, response: token });

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();

    // v3 returns a score 0.0 (bot) - 1.0 (human). 0.5 is Google's recommended default threshold.
    const passed = data.success && (data.score === undefined || data.score >= 0.5);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: passed, score: data.score || null }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
