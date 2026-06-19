import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PrivateEvents.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  bio: '',
  media_url: '',
  socials: '',
};

export default function Submit() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { setError('Please upload a JPG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Photo must be under 5MB.'); return; }
    setUploading(true); setError('');
    const ext = file.name.split('.').pop();
    const fileName = `submissions/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('afterdark-media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (uploadErr) { setError('Photo upload failed: ' + uploadErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('afterdark-media').getPublicUrl(fileName);
    setPhotoUrl(urlData.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error: insertErr } = await supabase.from('performer_submissions').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        photo_url: photoUrl || null,
        media_url: form.media_url || null,
        socials: form.socials || null,
        ranking: 'unranked',
      }]);

      if (insertErr) throw insertErr;

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setPhotoUrl('');
    } catch (err) {
      setError('Something went wrong. Please email us directly at live@cooljsafterdark.com');
    }

    setSubmitting(false);
  }

  return (
    <div className="private-page">
      <section className="private-hero">
        <div className="private-hero__bg" />
        <div className="container private-hero__content">
          <p className="section-label">Performer Submissions</p>
          <h1 className="display text-blue private-hero__title">
            Perform<br />AfterDARK
          </h1>
          <p className="private-hero__sub text-dim">
            Comedians, musicians, vocalists, and spoken word artists —
            tell us about yourself for consideration in future bookings
            at Delaware's longest-running live entertainment venue.
          </p>
        </div>
      </section>

      <section className="section private-form-section" id="inquiry-form">
        <div className="container private-form-section__inner">
          <div className="private-form-section__left">
            <p className="section-label">Get Considered</p>
            <span className="blue-line" />
            <h2 className="private-form-section__title">
              Submit Your Info
            </h2>
            <p className="text-dim">
              We review every submission as we book upcoming shows.
              There's no approval step here — just give us what we
              need to know your work and reach you when the timing's right.
            </p>
            <div className="private-form-section__contact">
              <p className="text-dim">Questions first?</p>
              <a href="mailto:live@cooljsafterdark.com" className="private-form-section__email">
                live@cooljsafterdark.com
              </a>
            </div>
          </div>

          <div className="private-form-section__right">
            {submitted ? (
              <div className="private-form__success">
                <div className="private-form__success-icon">✓</div>
                <h3 className="private-form__success-title">Submission Received</h3>
                <p className="text-dim">
                  Thanks for sharing your work. We'll be in touch if there's
                  a fit for an upcoming show.
                </p>
              </div>
            ) : (
              <form className="private-form" onSubmit={handleSubmit}>
                <div className="private-form__row">
                  <div className="private-form__field">
                    <label className="private-label">Full Name / Stage Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="private-input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="private-form__field">
                    <label className="private-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="private-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="private-form__field">
                  <label className="private-label">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="private-input"
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div className="private-form__field">
                  <label className="private-label">Bio *</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="private-input private-textarea"
                    placeholder="Tell us about your act — style, experience, notable spots you've performed."
                    rows={4}
                    required
                  />
                </div>

                <div className="private-form__field">
                  <label className="private-label">Photo</label>
                  {photoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={photoUrl} alt="Preview" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                      <button type="button" className="private-input" style={{ cursor: 'pointer' }} onClick={() => setPhotoUrl('')}>Remove</button>
                    </div>
                  ) : (
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="private-input"
                      disabled={uploading}
                    />
                  )}
                  {uploading && <p className="text-dim" style={{ fontSize: '0.85rem', marginTop: '6px' }}>Uploading...</p>}
                </div>

                <div className="private-form__field">
                  <label className="private-label">Video / Audio Sample Link</label>
                  <input
                    name="media_url"
                    value={form.media_url}
                    onChange={handleChange}
                    className="private-input"
                    placeholder="YouTube, Instagram Reel, SoundCloud, etc."
                  />
                </div>

                <div className="private-form__field">
                  <label className="private-label">Social Links</label>
                  <input
                    name="socials"
                    value={form.socials}
                    onChange={handleChange}
                    className="private-input"
                    placeholder="Instagram, TikTok, website — comma separated"
                  />
                </div>

                {error && <p className="private-form__error">{error}</p>}

                <button
                  type="submit"
                  className="btn btn-blue private-form__submit"
                  disabled={submitting || uploading}
                >
                  {submitting ? 'Submitting...' : 'Submit for Consideration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
