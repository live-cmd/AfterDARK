const nodemailer = require('nodemailer');

const RECIPIENTS = [
  'dghamlinesq@gmail.com',
  'jabookieb@gmail.com',
  'legendenterprises@me.com',
];

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // Supabase Database Webhooks send { type, table, record, old_record }
    const record = payload.record || payload;

    const name = record.name || 'Unknown';
    const email = record.email || 'No email provided';
    const phone = record.phone || 'No phone provided';
    const bio = record.bio || '';
    const mediaUrl = record.media_url || '';
    const socials = record.socials || '';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const html = `
      <h2>New Performer Submission — Cool J's AfterDARK</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Bio:</strong> ${bio}</p>
      ${mediaUrl ? `<p><strong>Video/Audio Sample:</strong> <a href="${mediaUrl}">${mediaUrl}</a></p>` : ''}
      ${socials ? `<p><strong>Socials:</strong> ${socials}</p>` : ''}
      <p style="margin-top: 24px;"><a href="https://coolsafterdark.netlify.app/admin">Review and rank in Admin →</a></p>
    `;

    await transporter.sendMail({
      from: `"Cool J's AfterDARK" <${process.env.GMAIL_USER}>`,
      to: RECIPIENTS.join(', '),
      subject: `New Performer Submission: ${name}`,
      html,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('notify-submission error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
