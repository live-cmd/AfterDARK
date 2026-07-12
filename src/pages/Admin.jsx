import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { fetchEventbriteEvents } from '../lib/eventbriteClient';
import './Admin.css';

const ADMIN_PASSWORD = 'afterdark2026';

const EMPTY_FORM = {
  name: '', date: '', venue: 'Bear, DE', time: 'Doors 7PM · Show 8PM',
  description: '', image_url: '', eventbrite_url: '', featured: false, sold_out: false, tags: '',
};

const EMPTY_CLIP_FORM = { performer_name: '', youtube_url: '', thumbnail_url: '', event_date: '' };
const EMPTY_LEGEND_FORM = { name: '', headshot_url: '', induction_date: '', bio: '' };
const EMPTY_POPUP_FORM = { enabled: true, type: 'image', headline: '', subtext: '', image_url: '', youtube_url: '', cta_label: '', cta_url: '' };

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState('');
  const fileInputRef = useRef();

  const [allEvents, setAllEvents] = useState([]);
  const [featuredConfig, setFeaturedConfig] = useState(null);
  const [featuredForm, setFeaturedForm] = useState({ source: 'supabase', event_id: '', promo_code: '', promo_text: '', custom_cta_label: '' });
  const [featuredSaving, setFeaturedSaving] = useState(false);
  const [featuredMessage, setFeaturedMessage] = useState('');
  const [featuredLoading, setFeaturedLoading] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState('all');

  const [clips, setClips] = useState([]);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [clipForm, setClipForm] = useState(EMPTY_CLIP_FORM);
  const [clipEditingId, setClipEditingId] = useState(null);
  const [clipSaving, setClipSaving] = useState(false);
  const [clipMessage, setClipMessage] = useState('');

  const [legends, setLegends] = useState([]);
  const [legendsLoading, setLegendsLoading] = useState(false);
  const [legendForm, setLegendForm] = useState(EMPTY_LEGEND_FORM);
  const [legendEditingId, setLegendEditingId] = useState(null);
  const [legendSaving, setLegendSaving] = useState(false);
  const [legendMessage, setLegendMessage] = useState('');
  const [legendUploading, setLegendUploading] = useState(false);
  const legendFileInputRef = useRef();

  const [popupConfig, setPopupConfig] = useState(null);
  const [popupForm, setPopupForm] = useState(EMPTY_POPUP_FORM);
  const [popupSaving, setPopupSaving] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupUploading, setPopupUploading] = useState(false);
  const popupFileInputRef = useRef();

  useEffect(() => {
    if (authed) {
      fetchShows(); loadFeaturedConfig(); loadAllEvents();
      fetchSubmissions(); fetchClips(); fetchLegends(); loadPopupConfig();
    }
  }, [authed]);

  async function loadPopupConfig() {
    const { data, error } = await supabase.from('promo_popup').select('*').eq('site', 'afterdark').limit(1).maybeSingle();
    if (!error && data) {
      setPopupConfig(data);
      setPopupForm({
        enabled: data.enabled ?? true, type: data.type || 'image',
        headline: data.headline || '', subtext: data.subtext || '',
        image_url: data.image_url || '', youtube_url: data.youtube_url || '',
        cta_label: data.cta_label || '', cta_url: data.cta_url || '',
      });
    }
  }

  async function handlePopupImageUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) { setPopupMessage('❌ Please upload a JPG, PNG, WebP, or GIF image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setPopupMessage('❌ Image must be under 5MB.'); return; }
    setPopupUploading(true); setPopupMessage('');
    const ext = file.name.split('.').pop();
    const fileName = `promo/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('afterdark-media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { setPopupMessage('❌ Upload failed: ' + error.message); setPopupUploading(false); return; }
    const { data: urlData } = supabase.storage.from('afterdark-media').getPublicUrl(fileName);
    setPopupForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setPopupMessage('✓ Image uploaded successfully.'); setPopupUploading(false);
  }

  function clearPopupImage() { setPopupForm(prev => ({ ...prev, image_url: '' })); if (popupFileInputRef.current) popupFileInputRef.current.value = ''; }

  async function handlePopupSave(e) {
    e.preventDefault(); setPopupSaving(true); setPopupMessage('');
    const payload = {
      site: 'afterdark',
      enabled: popupForm.enabled, type: popupForm.type,
      headline: popupForm.headline || null, subtext: popupForm.subtext || null,
      image_url: popupForm.image_url || null, youtube_url: popupForm.youtube_url || null,
      cta_label: popupForm.cta_label || null, cta_url: popupForm.cta_url || null,
    };
    let error;
    if (popupConfig) { ({ error } = await supabase.from('promo_popup').update(payload).eq('id', popupConfig.id)); }
    else { ({ error } = await supabase.from('promo_popup').insert([payload])); }
    if (error) { setPopupMessage('❌ Error: ' + error.message); }
    else { setPopupMessage('✓ Popup updated.'); loadPopupConfig(); }
    setPopupSaving(false);
  }

  async function fetchShows() {
    setLoading(true);
    const { data, error } = await supabase.from('shows').select('*').order('date', { ascending: true });
    if (!error) setShows(data || []);
    setLoading(false);
  }

  async function loadFeaturedConfig() {
    const { data, error } = await supabase.from('featured_event').select('*').limit(1);
    if (!error && data && data.length > 0) {
      setFeaturedConfig(data[0]);
      setFeaturedForm({ source: data[0].source || 'supabase', event_id: String(data[0].event_id || ''), promo_code: data[0].promo_code || '', promo_text: data[0].promo_text || '', custom_cta_label: data[0].custom_cta_label || '' });
    }
  }

  async function loadAllEvents() {
    setFeaturedLoading(true);
    try {
      const [sbResult, ebResult] = await Promise.allSettled([
        supabase.from('shows').select('id, name, date').order('date', { ascending: true }),
        fetchEventbriteEvents()
      ]);
      const sbShows = sbResult.status === 'fulfilled' && !sbResult.value.error ? (sbResult.value.data || []).map(s => ({ ...s, source: 'supabase' })) : [];
      const ebShows = ebResult.status === 'fulfilled' ? ebResult.value.map(e => ({ id: e.id, name: e.name, date: e.date, source: 'eventbrite' })) : [];
      setAllEvents([...ebShows, ...sbShows].sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch { setAllEvents([]); }
    setFeaturedLoading(false);
  }

  async function handleFeaturedSave(e) {
    e.preventDefault(); setFeaturedSaving(true); setFeaturedMessage('');
    const payload = { source: featuredForm.source, event_id: featuredForm.event_id, promo_code: featuredForm.promo_code || null, promo_text: featuredForm.promo_text || null, custom_cta_label: featuredForm.custom_cta_label || null };
    let error;
    if (featuredConfig) { ({ error } = await supabase.from('featured_event').update(payload).eq('id', featuredConfig.id)); }
    else { ({ error } = await supabase.from('featured_event').insert([payload])); }
    if (error) { setFeaturedMessage('❌ Error saving: ' + error.message); } else { setFeaturedMessage('✓ Featured event updated.'); loadFeaturedConfig(); }
    setFeaturedSaving(false);
  }

  async function handleFeaturedClear() {
    if (!featuredConfig) return;
    if (!window.confirm('Clear the featured event?')) return;
    const { error } = await supabase.from('featured_event').delete().eq('id', featuredConfig.id);
    if (!error) { setFeaturedConfig(null); setFeaturedForm({ source: 'supabase', event_id: '', promo_code: '', promo_text: '', custom_cta_label: '' }); setFeaturedMessage('✓ Featured event cleared.'); }
    else { setFeaturedMessage('❌ Error clearing: ' + error.message); }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setAuthError(''); } else { setAuthError('Incorrect password.'); }
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) { setMessage('❌ Please upload a JPG, PNG, WebP, or GIF image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setMessage('❌ Image must be under 5MB.'); return; }
    setUploading(true); setMessage('');
    const ext = file.name.split('.').pop();
    const fileName = `shows/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('afterdark-media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { setMessage('❌ Upload failed: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('afterdark-media').getPublicUrl(fileName);
    setForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setUploadPreview(urlData.publicUrl); setMessage('✓ Image uploaded successfully.'); setUploading(false);
  }

  function clearImage() { setForm(prev => ({ ...prev, image_url: '' })); setUploadPreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }

  function parseDate(dateStr) {
    if (!dateStr) return { month: '', day: '', year: '' };
    const d = new Date(dateStr + 'T00:00:00');
    return { month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(), day: String(d.getDate()), year: String(d.getFullYear()) };
  }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setMessage('');
    const { month, day, year } = parseDate(form.date);
    const payload = { name: form.name, date: form.date, month, day, year, venue: form.venue, time: form.time, description: form.description, image_url: form.image_url, eventbrite_url: form.eventbrite_url, featured: form.featured, sold_out: form.sold_out, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
    let error;
    if (editingId) { ({ error } = await supabase.from('shows').update(payload).eq('id', editingId)); }
    else { ({ error } = await supabase.from('shows').insert([payload])); }
    if (error) { setMessage('❌ Error saving show: ' + error.message); }
    else { setMessage(editingId ? '✓ Show updated.' : '✓ Show added.'); setForm(EMPTY_FORM); setEditingId(null); setUploadPreview(''); fetchShows(); }
    setSaving(false);
  }

  function handleEdit(show) {
    setEditingId(show.id);
    setForm({ name: show.name || '', date: show.date || '', venue: show.venue || 'Bear, DE', time: show.time || 'Doors 7PM · Show 8PM', description: show.description || '', image_url: show.image_url || '', eventbrite_url: show.eventbrite_url || '', featured: show.featured || false, sold_out: show.sold_out || false, tags: (show.tags || []).join(', ') });
    setUploadPreview(show.image_url || ''); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() { setForm(EMPTY_FORM); setEditingId(null); setMessage(''); setUploadPreview(''); }

  async function handleDelete(id) {
    if (!window.confirm('Delete this show? This cannot be undone.')) return;
    setDeleting(id);
    const { error } = await supabase.from('shows').delete().eq('id', id);
    if (!error) { setMessage('✓ Show deleted.'); fetchShows(); } else { setMessage('❌ Error deleting show.'); }
    setDeleting(null);
  }

  async function toggleFeatured(show) { await supabase.from('shows').update({ featured: !show.featured }).eq('id', show.id); fetchShows(); }
  async function toggleSoldOut(show) { await supabase.from('shows').update({ sold_out: !show.sold_out }).eq('id', show.id); fetchShows(); }

  async function fetchSubmissions() {
    setSubmissionsLoading(true);
    const { data, error } = await supabase.from('performer_submissions').select('*').order('created_at', { ascending: false });
    if (!error) setSubmissions(data || []);
    setSubmissionsLoading(false);
  }

  async function updateRanking(id, ranking) { await supabase.from('performer_submissions').update({ ranking }).eq('id', id); fetchSubmissions(); }
  async function deleteSubmission(id) { if (!window.confirm('Delete this submission?')) return; await supabase.from('performer_submissions').delete().eq('id', id); fetchSubmissions(); }
  const filteredSubmissions = submissionFilter === 'all' ? submissions : submissions.filter(s => (s.ranking || 'unranked') === submissionFilter);

  async function fetchClips() {
    setClipsLoading(true);
    const { data, error } = await supabase.from('performance_clips').select('*').order('event_date', { ascending: false });
    if (!error) setClips(data || []);
    setClipsLoading(false);
  }

  function handleClipFormChange(e) { const { name, value } = e.target; setClipForm(prev => ({ ...prev, [name]: value })); }

  async function handleClipSave(e) {
    e.preventDefault(); setClipSaving(true); setClipMessage('');
    const payload = { performer_name: clipForm.performer_name, youtube_url: clipForm.youtube_url, thumbnail_url: clipForm.thumbnail_url || null, event_date: clipForm.event_date || null };
    let error;
    if (clipEditingId) { ({ error } = await supabase.from('performance_clips').update(payload).eq('id', clipEditingId)); }
    else { ({ error } = await supabase.from('performance_clips').insert([payload])); }
    if (error) { setClipMessage('❌ Error saving clip: ' + error.message); }
    else { setClipMessage(clipEditingId ? '✓ Clip updated.' : '✓ Clip added.'); setClipForm(EMPTY_CLIP_FORM); setClipEditingId(null); fetchClips(); }
    setClipSaving(false);
  }

  function handleClipEdit(clip) { setClipEditingId(clip.id); setClipForm({ performer_name: clip.performer_name || '', youtube_url: clip.youtube_url || '', thumbnail_url: clip.thumbnail_url || '', event_date: clip.event_date || '' }); }
  function handleClipCancel() { setClipForm(EMPTY_CLIP_FORM); setClipEditingId(null); setClipMessage(''); }
  async function handleClipDelete(id) { if (!window.confirm('Delete this clip?')) return; const { error } = await supabase.from('performance_clips').delete().eq('id', id); if (!error) { setClipMessage('✓ Clip deleted.'); fetchClips(); } }

  async function fetchLegends() {
    setLegendsLoading(true);
    const { data, error } = await supabase.from('legends_afterdark').select('*').order('induction_date', { ascending: false });
    if (!error) setLegends(data || []);
    setLegendsLoading(false);
  }

  function handleLegendFormChange(e) { const { name, value } = e.target; setLegendForm(prev => ({ ...prev, [name]: value })); }

  async function handleHeadshotUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setLegendMessage('❌ Please upload a JPG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setLegendMessage('❌ Headshot must be under 5MB.'); return; }
    setLegendUploading(true); setLegendMessage('');
    const ext = file.name.split('.').pop();
    const fileName = `legends/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('afterdark-media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { setLegendMessage('❌ Upload failed: ' + error.message); setLegendUploading(false); return; }
    const { data: urlData } = supabase.storage.from('afterdark-media').getPublicUrl(fileName);
    setLegendForm(prev => ({ ...prev, headshot_url: urlData.publicUrl }));
    setLegendUploading(false);
  }

  async function handleLegendSave(e) {
    e.preventDefault(); setLegendSaving(true); setLegendMessage('');
    const payload = { name: legendForm.name, headshot_url: legendForm.headshot_url, induction_date: legendForm.induction_date, bio: legendForm.bio || null };
    let error;
    if (legendEditingId) { ({ error } = await supabase.from('legends_afterdark').update(payload).eq('id', legendEditingId)); }
    else { ({ error } = await supabase.from('legends_afterdark').insert([payload])); }
    if (error) { setLegendMessage('❌ Error saving: ' + error.message); }
    else { setLegendMessage(legendEditingId ? '✓ Legend updated.' : '✓ Legend inducted.'); setLegendForm(EMPTY_LEGEND_FORM); setLegendEditingId(null); fetchLegends(); }
    setLegendSaving(false);
  }

  function handleLegendEdit(legend) { setLegendEditingId(legend.id); setLegendForm({ name: legend.name || '', headshot_url: legend.headshot_url || '', induction_date: legend.induction_date || '', bio: legend.bio || '' }); }
  function handleLegendCancel() { setLegendForm(EMPTY_LEGEND_FORM); setLegendEditingId(null); setLegendMessage(''); if (legendFileInputRef.current) legendFileInputRef.current.value = ''; }
  async function handleLegendDelete(id) { if (!window.confirm('Remove this Legend?')) return; const { error } = await supabase.from('legends_afterdark').delete().eq('id', id); if (!error) { setLegendMessage('✓ Legend removed.'); fetchLegends(); } }

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__box">
          <div className="admin-login__logo"><span className="admin-login__brand">AfterDARK</span><span className="admin-login__sub">Admin</span></div>
          <form onSubmit={handleLogin} className="admin-login__form">
            <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} className="admin-input" autoFocus />
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" className="admin-btn-primary">Enter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header__inner">
          <div><span className="admin-header__brand">AfterDARK</span><span className="admin-header__label">Show Manager</span></div>
          <button className="admin-btn-ghost" onClick={() => { setAuthed(false); window.location.href = '/'; }}>Sign Out</button>
        </div>
      </div>

      <div className="admin-body">

        {/* ── PROMO POPUP ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">📢 Promo Popup</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '20px' }}>Displays on every page load. Toggle off to hide without deleting content.</p>
          {popupMessage && <div className={`admin-message ${popupMessage.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>{popupMessage}</div>}
          <form onSubmit={handlePopupSave} className="admin-form">
            <div className="admin-form__toggles" style={{ marginBottom: '20px' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={popupForm.enabled} onChange={e => setPopupForm(prev => ({ ...prev, enabled: e.target.checked }))} />
                <span className="admin-toggle__track" /><span className="admin-toggle__label">Popup Enabled</span>
              </label>
            </div>
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-label">Type</label>
                <select className="admin-input" value={popupForm.type} onChange={e => setPopupForm(prev => ({ ...prev, type: e.target.value }))}>
                  <option value="image">Image</option><option value="video">Video (YouTube)</option>
                </select>
              </div>
              <div className="admin-form__field">
                <label className="admin-label">Headline</label>
                <input className="admin-input" value={popupForm.headline} onChange={e => setPopupForm(prev => ({ ...prev, headline: e.target.value }))} placeholder="e.g. This Saturday — Don't Miss It" />
              </div>
            </div>
            <div className="admin-form__field">
              <label className="admin-label">Subtext</label>
              <input className="admin-input" value={popupForm.subtext} onChange={e => setPopupForm(prev => ({ ...prev, subtext: e.target.value }))} placeholder="Short supporting copy" />
            </div>
            {popupForm.type === 'image' ? (
              <div className="admin-form__field">
                <label className="admin-label">Image</label>
                <div className="admin-upload">
                  {popupForm.image_url ? (
                    <div className="admin-upload__preview">
                      <img src={popupForm.image_url} alt="Preview" className="admin-upload__img" />
                      <div className="admin-upload__preview-actions">
                        <button type="button" className="admin-pill" onClick={() => popupFileInputRef.current.click()} disabled={popupUploading}>Replace</button>
                        <button type="button" className="admin-pill admin-pill--delete" onClick={clearPopupImage}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-upload__dropzone" onClick={() => popupFileInputRef.current.click()}>
                      <div className="admin-upload__icon">↑</div>
                      <p className="admin-upload__text">{popupUploading ? 'Uploading...' : 'Click to upload image'}</p>
                      <p className="admin-upload__hint">JPG, PNG, WebP — max 5MB</p>
                    </div>
                  )}
                  <input ref={popupFileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePopupImageUpload} style={{ display: 'none' }} />
                  {!popupForm.image_url && <div className="admin-upload__url"><label className="admin-label">Or paste URL</label><input value={popupForm.image_url} onChange={e => setPopupForm(prev => ({ ...prev, image_url: e.target.value }))} className="admin-input" placeholder="https://..." /></div>}
                </div>
              </div>
            ) : (
              <div className="admin-form__field">
                <label className="admin-label">YouTube URL</label>
                <input className="admin-input" value={popupForm.youtube_url} onChange={e => setPopupForm(prev => ({ ...prev, youtube_url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
              </div>
            )}
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-label">CTA Label</label>
                <input className="admin-input" value={popupForm.cta_label} onChange={e => setPopupForm(prev => ({ ...prev, cta_label: e.target.value }))} placeholder="e.g. Get Tickets →" />
              </div>
              <div className="admin-form__field">
                <label className="admin-label">CTA URL</label>
                <input className="admin-input" value={popupForm.cta_url} onChange={e => setPopupForm(prev => ({ ...prev, cta_url: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn-primary" disabled={popupSaving || popupUploading}>{popupSaving ? 'Saving...' : popupConfig ? 'Update Popup' : 'Create Popup'}</button>
            </div>
          </form>
        </section>

        {/* ── FEATURED EVENT ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">⭐ Featured Event</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '20px' }}>The featured block appears at the top of the Events and Tickets pages.</p>
          {featuredMessage && <div className={`admin-message ${featuredMessage.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>{featuredMessage}</div>}
          <form onSubmit={handleFeaturedSave} className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-label">Source</label>
                <select className="admin-input" value={featuredForm.source} onChange={e => setFeaturedForm(prev => ({ ...prev, source: e.target.value, event_id: '' }))}>
                  <option value="supabase">Supabase (free/private shows)</option>
                  <option value="eventbrite">Eventbrite (ticketed shows)</option>
                </select>
              </div>
              <div className="admin-form__field">
                <label className="admin-label">Event</label>
                {featuredLoading ? <p className="admin-loading" style={{ fontSize: '0.85rem' }}>Loading...</p> : (
                  <select className="admin-input" value={featuredForm.event_id} onChange={e => setFeaturedForm(prev => ({ ...prev, event_id: e.target.value }))} required>
                    <option value="">— Select an event —</option>
                    {allEvents.filter(e => e.source === featuredForm.source).map(e => <option key={`${e.source}-${e.id}`} value={String(e.id)}>{e.date} · {e.name}</option>)}
                  </select>
                )}
              </div>
            </div>
            <div className="admin-form__row">
              <div className="admin-form__field"><label className="admin-label">Promo Code</label><input className="admin-input" placeholder="e.g. AFTERDARK10" value={featuredForm.promo_code} onChange={e => setFeaturedForm(prev => ({ ...prev, promo_code: e.target.value }))} /></div>
              <div className="admin-form__field"><label className="admin-label">Promo Label</label><input className="admin-input" placeholder="e.g. 10% off at checkout" value={featuredForm.promo_text} onChange={e => setFeaturedForm(prev => ({ ...prev, promo_text: e.target.value }))} /></div>
            </div>
            <div className="admin-form__field"><label className="admin-label">Custom CTA Label</label><input className="admin-input" placeholder="Default: Get Tickets →" value={featuredForm.custom_cta_label} onChange={e => setFeaturedForm(prev => ({ ...prev, custom_cta_label: e.target.value }))} /></div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn-primary" disabled={featuredSaving}>{featuredSaving ? 'Saving...' : featuredConfig ? 'Update Featured Event' : 'Set Featured Event'}</button>
              {featuredConfig && <button type="button" className="admin-btn-ghost" onClick={handleFeaturedClear}>Clear Featured</button>}
            </div>
          </form>
        </section>

        {/* ── ADD / EDIT SHOW ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">{editingId ? 'Edit Show' : 'Add New Show'}</h2>
          {message && <div className={`admin-message ${message.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>{message}</div>}
          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field"><label className="admin-label">Show Name *</label><input name="name" value={form.name} onChange={handleFormChange} className="admin-input" placeholder="e.g. Cool J's AfterDARK" required /></div>
              <div className="admin-form__field"><label className="admin-label">Date *</label><input type="date" name="date" value={form.date} onChange={handleFormChange} className="admin-input" required /></div>
            </div>
            <div className="admin-form__row">
              <div className="admin-form__field"><label className="admin-label">Venue</label><input name="venue" value={form.venue} onChange={handleFormChange} className="admin-input" /></div>
              <div className="admin-form__field"><label className="admin-label">Time</label><input name="time" value={form.time} onChange={handleFormChange} className="admin-input" /></div>
            </div>
            <div className="admin-form__field"><label className="admin-label">Description</label><textarea name="description" value={form.description} onChange={handleFormChange} className="admin-input admin-textarea" rows={3} /></div>
            <div className="admin-form__field">
              <label className="admin-label">Show Image</label>
              <div className="admin-upload">
                {uploadPreview ? (
                  <div className="admin-upload__preview">
                    <img src={uploadPreview} alt="Preview" className="admin-upload__img" />
                    <div className="admin-upload__preview-actions">
                      <button type="button" className="admin-pill" onClick={() => fileInputRef.current.click()} disabled={uploading}>Replace</button>
                      <button type="button" className="admin-pill admin-pill--delete" onClick={clearImage}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-upload__dropzone" onClick={() => fileInputRef.current.click()}>
                    <div className="admin-upload__icon">↑</div>
                    <p className="admin-upload__text">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                    <p className="admin-upload__hint">JPG, PNG, WebP — max 5MB</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} style={{ display: 'none' }} />
                {!uploadPreview && <div className="admin-upload__url"><label className="admin-label">Or paste URL</label><input name="image_url" value={form.image_url} onChange={handleFormChange} className="admin-input" placeholder="https://..." /></div>}
              </div>
            </div>
            <div className="admin-form__field"><label className="admin-label">Eventbrite URL</label><input name="eventbrite_url" value={form.eventbrite_url} onChange={handleFormChange} className="admin-input" placeholder="https://www.eventbrite.com/e/..." /></div>
            <div className="admin-form__field"><label className="admin-label">Tags (comma separated)</label><input name="tags" value={form.tags} onChange={handleFormChange} className="admin-input" placeholder="Live Comedy, Summer, July" /></div>
            <div className="admin-form__toggles">
              <label className="admin-toggle"><input type="checkbox" name="featured" checked={form.featured} onChange={handleFormChange} /><span className="admin-toggle__track" /><span className="admin-toggle__label">Featured</span></label>
              <label className="admin-toggle"><input type="checkbox" name="sold_out" checked={form.sold_out} onChange={handleFormChange} /><span className="admin-toggle__track" /><span className="admin-toggle__label">Sold Out</span></label>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn-primary" disabled={saving || uploading}>{saving ? 'Saving...' : editingId ? 'Update Show' : 'Add Show'}</button>
              {editingId && <button type="button" className="admin-btn-ghost" onClick={handleCancel}>Cancel</button>}
            </div>
          </form>
        </section>

        {/* ── SHOWS LIST ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">Current Shows {shows.length > 0 && <span className="admin-count">{shows.length}</span>}</h2>
          {loading ? <p className="admin-loading">Loading...</p> : shows.length === 0 ? <p className="admin-empty">No shows yet.</p> : (
            <div className="admin-shows">
              {shows.map(show => (
                <div key={show.id} className={`admin-show-row ${show.featured ? 'admin-show-row--featured' : ''}`}>
                  <div className="admin-show-row__thumb" style={show.image_url ? { backgroundImage: `url(${show.image_url})` } : {}} />
                  <div className="admin-show-row__date"><span className="admin-show-row__month">{show.month}</span><span className="admin-show-row__day">{show.day}</span></div>
                  <div className="admin-show-row__info">
                    <h3 className="admin-show-row__name">{show.name}</h3>
                    <p className="admin-show-row__meta">{show.venue} · {show.time}</p>
                    <div className="admin-show-row__badges">
                      {show.featured && <span className="admin-badge admin-badge--featured">Featured</span>}
                      {show.sold_out && <span className="admin-badge admin-badge--sold-out">Sold Out</span>}
                      {show.eventbrite_url && <span className="admin-badge admin-badge--live">Eventbrite ✓</span>}
                    </div>
                  </div>
                  <div className="admin-show-row__actions">
                    <button className={`admin-pill ${show.featured ? 'admin-pill--active' : ''}`} onClick={() => toggleFeatured(show)}>★</button>
                    <button className={`admin-pill ${show.sold_out ? 'admin-pill--sold-out' : ''}`} onClick={() => toggleSoldOut(show)}>{show.sold_out ? 'Sold Out' : 'Available'}</button>
                    <button className="admin-pill" onClick={() => handleEdit(show)}>Edit</button>
                    <button className="admin-pill admin-pill--delete" onClick={() => handleDelete(show.id)} disabled={deleting === show.id}>{deleting === show.id ? '...' : 'Delete'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── PERFORMER SUBMISSIONS ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">🎤 Performer Submissions {submissions.length > 0 && <span className="admin-count">{submissions.length}</span>}</h2>
          <div className="admin-form__row" style={{ marginBottom: '16px' }}>
            <div className="admin-form__field"><label className="admin-label">Filter</label>
              <select className="admin-input" value={submissionFilter} onChange={e => setSubmissionFilter(e.target.value)}>
                <option value="all">All</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option><option value="unranked">Unranked</option>
              </select>
            </div>
          </div>
          {submissionsLoading ? <p className="admin-loading">Loading...</p> : filteredSubmissions.length === 0 ? <p className="admin-empty">No submissions match this filter.</p> : (
            <div className="admin-shows">
              {filteredSubmissions.map(sub => (
                <div key={sub.id} className="admin-show-row">
                  <div className="admin-show-row__thumb" style={sub.photo_url ? { backgroundImage: `url(${sub.photo_url})` } : {}} />
                  <div className="admin-show-row__info">
                    <h3 className="admin-show-row__name">{sub.name}</h3>
                    <p className="admin-show-row__meta">{sub.email} {sub.phone ? `· ${sub.phone}` : ''}</p>
                    {sub.bio && <p className="admin-show-row__meta" style={{ marginTop: '4px' }}>{sub.bio}</p>}
                    <div className="admin-show-row__badges">{sub.media_url && <a href={sub.media_url} target="_blank" rel="noreferrer" className="admin-badge admin-badge--live">Media Link</a>}</div>
                  </div>
                  <div className="admin-show-row__actions">
                    <select className="admin-input" value={sub.ranking || 'unranked'} onChange={e => updateRanking(sub.id, e.target.value)} style={{ minWidth: '110px' }}>
                      <option value="unranked">Unranked</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                    </select>
                    <button className="admin-pill admin-pill--delete" onClick={() => deleteSubmission(sub.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── PERFORMANCE CLIPS ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">🎬 {clipEditingId ? 'Edit Clip' : 'Add Performance Clip'}</h2>
          {clipMessage && <div className={`admin-message ${clipMessage.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>{clipMessage}</div>}
          <form onSubmit={handleClipSave} className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field"><label className="admin-label">Performer Name *</label><input name="performer_name" value={clipForm.performer_name} onChange={handleClipFormChange} className="admin-input" required /></div>
              <div className="admin-form__field"><label className="admin-label">Event Date</label><input type="date" name="event_date" value={clipForm.event_date} onChange={handleClipFormChange} className="admin-input" /></div>
            </div>
            <div className="admin-form__field"><label className="admin-label">YouTube URL *</label><input name="youtube_url" value={clipForm.youtube_url} onChange={handleClipFormChange} className="admin-input" placeholder="https://youtube.com/watch?v=..." required /></div>
            <div className="admin-form__field"><label className="admin-label">Custom Thumbnail URL (optional)</label><input name="thumbnail_url" value={clipForm.thumbnail_url} onChange={handleClipFormChange} className="admin-input" /></div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn-primary" disabled={clipSaving}>{clipSaving ? 'Saving...' : clipEditingId ? 'Update Clip' : 'Add Clip'}</button>
              {clipEditingId && <button type="button" className="admin-btn-ghost" onClick={handleClipCancel}>Cancel</button>}
            </div>
          </form>
          {clips.length > 0 && (
            <div className="admin-shows" style={{ marginTop: '24px' }}>
              {clips.map(clip => (
                <div key={clip.id} className="admin-show-row">
                  <div className="admin-show-row__info"><h3 className="admin-show-row__name">{clip.performer_name}</h3><p className="admin-show-row__meta">{clip.event_date || 'No date'}</p></div>
                  <div className="admin-show-row__actions">
                    <button className="admin-pill" onClick={() => handleClipEdit(clip)}>Edit</button>
                    <button className="admin-pill admin-pill--delete" onClick={() => handleClipDelete(clip.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── LEGENDS AFTERDARK ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">🏆 {legendEditingId ? 'Edit Legend' : 'Induct a Legend'}</h2>
          {legendMessage && <div className={`admin-message ${legendMessage.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>{legendMessage}</div>}
          <form onSubmit={handleLegendSave} className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field"><label className="admin-label">Name *</label><input name="name" value={legendForm.name} onChange={handleLegendFormChange} className="admin-input" required /></div>
              <div className="admin-form__field"><label className="admin-label">Induction Date *</label><input type="date" name="induction_date" value={legendForm.induction_date} onChange={handleLegendFormChange} className="admin-input" required /></div>
            </div>
            <div className="admin-form__field">
              <label className="admin-label">Headshot *</label>
              <div className="admin-upload">
                {legendForm.headshot_url ? (
                  <div className="admin-upload__preview">
                    <img src={legendForm.headshot_url} alt="Preview" className="admin-upload__img" />
                    <div className="admin-upload__preview-actions">
                      <button type="button" className="admin-pill" onClick={() => legendFileInputRef.current.click()} disabled={legendUploading}>Replace</button>
                      <button type="button" className="admin-pill admin-pill--delete" onClick={() => setLegendForm(prev => ({ ...prev, headshot_url: '' }))}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-upload__dropzone" onClick={() => legendFileInputRef.current.click()}>
                    <div className="admin-upload__icon">↑</div>
                    <p className="admin-upload__text">{legendUploading ? 'Uploading...' : 'Click to upload headshot'}</p>
                    <p className="admin-upload__hint">JPG, PNG, WebP — max 5MB</p>
                  </div>
                )}
                <input ref={legendFileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleHeadshotUpload} style={{ display: 'none' }} />
              </div>
            </div>
            <div className="admin-form__field"><label className="admin-label">Bio (optional)</label><textarea name="bio" value={legendForm.bio} onChange={handleLegendFormChange} className="admin-input admin-textarea" rows={3} /></div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn-primary" disabled={legendSaving || legendUploading || !legendForm.headshot_url}>{legendSaving ? 'Saving...' : legendEditingId ? 'Update Legend' : 'Induct Legend'}</button>
              {legendEditingId && <button type="button" className="admin-btn-ghost" onClick={handleLegendCancel}>Cancel</button>}
            </div>
          </form>
          {legends.length > 0 && (
            <div className="admin-shows" style={{ marginTop: '24px' }}>
              {legends.map(legend => (
                <div key={legend.id} className="admin-show-row">
                  <div className="admin-show-row__thumb" style={{ backgroundImage: `url(${legend.headshot_url})` }} />
                  <div className="admin-show-row__info"><h3 className="admin-show-row__name">{legend.name}</h3><p className="admin-show-row__meta">Inducted {legend.induction_date}</p></div>
                  <div className="admin-show-row__actions">
                    <button className="admin-pill" onClick={() => handleLegendEdit(legend)}>Edit</button>
                    <button className="admin-pill admin-pill--delete" onClick={() => handleLegendDelete(legend.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
