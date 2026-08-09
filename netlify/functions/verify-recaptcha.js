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
    if (!secret) {
      console.error('verify-recaptcha: RECAPTCHA_SECRET_KEY is not set in the environment');
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, score: null, configError: true }),
      };
    }

    const params = new URLSearchParams({ secret, response: token });

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();

    if (!data.success && data['error-codes']) {
      console.error('verify-recaptcha: Google siteverify rejected token:', data['error-codes']);
    }

    const hasScore = typeof data.score === 'number';

    // v3 returns a score 0.0 (bot) - 1.0 (human). 0.5 is Google's recommended default threshold.
    const passed = data.success && (!hasScore || data.score >= 0.5);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: passed,
        score: hasScore ? data.score : null,
        // True when reCAPTCHA never actually scored the interaction (bad/missing
        // secret key, invalid token, Google API error) as opposed to a real,
        // confirmed low-score bot detection.
        configError: !data.success && !hasScore,
      }),
    };
  } catch (err) {
    console.error('verify-recaptcha error:', err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, score: null, configError: true, error: err.message }),
    };
  }
};
