import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

const ADMIN_PASSWORD = 'afterdark2026';

const EMPTY_FORM = {
  name: '',
  date: '',
  venue: 'Bear, DE',
  time: 'Doors 7PM · Show 8PM',
  description: '',
  image_url: '',
  eventbrite_url: '',
  featured: false,
  sold_out: false,
  tags: '',
};

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

  useEffect(() => {
    if (authed) fetchShows();
  }, [authed]);

  async function fetchShows() {
    setLoading(true);
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('date', { ascending: true });
    if (!error) setShows(data || []);
    setLoading(false);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password.');
    }
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function parseDate(dateStr) {
    if (!dateStr) return { month: '', day: '', year: '' };
    const d = new Date(dateStr + 'T00:00:00');
    return {
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()),
      year: String(d.getFullYear()),
    };
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { month, day, year } = parseDate(form.date);
    const payload = {
      name: form.name,
      date: form.date,
      month, day, year,
      venue: form.venue,
      time: form.time,
      description: form.description,
      image_url: form.image_url,
      eventbrite_url: form.eventbrite_url,
      featured: form.featured,
      sold_out: form.sold_out,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('shows').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('shows').insert([payload]));
    }

    if (error) {
      setMessage('❌ Error saving show: ' + error.message);
    } else {
      setMessage(editingId ? '✓ Show updated.' : '✓ Show added.');
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchShows();
    }
    setSaving(false);
  }

  function handleEdit(show) {
    setEditingId(show.id);
    setForm({
      name: show.name || '',
      date: show.date || '',
      venue: show.venue || 'Bear, DE',
      time: show.time || 'Doors 7PM · Show 8PM',
      description: show.description || '',
      image_url: show.image_url || '',
      eventbrite_url: show.eventbrite_url || '',
      featured: show.featured || false,
      sold_out: show.sold_out || false,
      tags: (show.tags || []).join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this show? This cannot be undone.')) return;
    setDeleting(id);
    const { error } = await supabase.from('shows').delete().eq('id', id);
    if (!error) {
      setMessage('✓ Show deleted.');
      fetchShows();
    } else {
      setMessage('❌ Error deleting show.');
    }
    setDeleting(null);
  }

  async function toggleFeatured(show) {
    await supabase.from('shows').update({ featured: !show.featured }).eq('id', show.id);
    fetchShows();
  }

  async function toggleSoldOut(show) {
    await supabase.from('shows').update({ sold_out: !show.sold_out }).eq('id', show.id);
    fetchShows();
  }

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__box">
          <div className="admin-login__logo">
            <span className="admin-login__brand">AfterDARK</span>
            <span className="admin-login__sub">Admin</span>
          </div>
          <form onSubmit={handleLogin} className="admin-login__form">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
              autoFocus
            />
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" className="admin-btn-primary">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header__inner">
          <div>
            <span className="admin-header__brand">AfterDARK</span>
            <span className="admin-header__label">Show Manager</span>
          </div>
          <button className="admin-btn-ghost" onClick={() => setAuthed(false)}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-body">

        {/* ── FORM ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">
            {editingId ? 'Edit Show' : 'Add New Show'}
          </h2>
          {message && (
            <div className={`admin-message ${message.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-label">Show Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="admin-input"
                  placeholder="e.g. Cool J's AfterDARK"
                  required
                />
              </div>
              <div className="admin-form__field">
                <label className="admin-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className="admin-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-label">Venue</label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleFormChange}
                  className="admin-input"
                  placeholder="Bear, DE"
                />
              </div>
              <div className="admin-form__field">
                <label className="admin-label">Time</label>
                <input
                  name="time"
                  value={form.time}
                  onChange={handleFormChange}
                  className="admin-input"
                  placeholder="Doors 7PM · Show 8PM"
                />
              </div>
            </div>

            <div className="admin-form__field">
              <label className="admin-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="admin-input admin-textarea"
                placeholder="Show description..."
                rows={3}
              />
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-label">Image URL</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleFormChange}
                  className="admin-input"
                  placeholder="https://lh3.googleusercontent.com/d/..."
                />
              </div>
              <div className="admin-form__field">
                <label className="admin-label">Eventbrite URL</label>
                <input
                  name="eventbrite_url"
                  value={form.eventbrite_url}
                  onChange={handleFormChange}
                  className="admin-input"
                  placeholder="https://www.eventbrite.com/e/..."
                />
              </div>
            </div>

            <div className="admin-form__field">
              <label className="admin-label">Tags (comma separated)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleFormChange}
                className="admin-input"
                placeholder="Live Comedy, Summer, July"
              />
            </div>

            <div className="admin-form__toggles">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleFormChange}
                />
                <span className="admin-toggle__track" />
                <span className="admin-toggle__label">Featured Show</span>
              </label>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  name="sold_out"
                  checked={form.sold_out}
                  onChange={handleFormChange}
                />
                <span className="admin-toggle__track" />
                <span className="admin-toggle__label">Sold Out</span>
              </label>
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Show' : 'Add Show'}
              </button>
              {editingId && (
                <button type="button" className="admin-btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── SHOWS LIST ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">
            Current Shows {shows.length > 0 && <span className="admin-count">{shows.length}</span>}
          </h2>

          {loading ? (
            <p className="admin-loading">Loading shows...</p>
          ) : shows.length === 0 ? (
            <p className="admin-empty">No shows yet. Add one above.</p>
          ) : (
            <div className="admin-shows">
              {shows.map(show => (
                <div key={show.id} className={`admin-show-row ${show.featured ? 'admin-show-row--featured' : ''}`}>
                  <div className="admin-show-row__date">
                    <span className="admin-show-row__month">{show.month}</span>
                    <span className="admin-show-row__day">{show.day}</span>
                  </div>
                  <div className="admin-show-row__info">
                    <h3 className="admin-show-row__name">{show.name}</h3>
                    <p className="admin-show-row__meta">{show.venue} · {show.time}</p>
                    <div className="admin-show-row__badges">
                      {show.featured && <span className="admin-badge admin-badge--featured">Featured</span>}
                      {show.sold_out && <span className="admin-badge admin-badge--sold-out">Sold Out</span>}
                      {show.eventbrite_url && <span className="admin-badge admin-badge--live">Eventbrite ✓</span>}
                      {show.image_url && <span className="admin-badge admin-badge--live">Image ✓</span>}
                    </div>
                  </div>
                  <div className="admin-show-row__actions">
                    <button
                      className={`admin-pill ${show.featured ? 'admin-pill--active' : ''}`}
                      onClick={() => toggleFeatured(show)}
                      title="Toggle Featured"
                    >
                      ★
                    </button>
                    <button
                      className={`admin-pill ${show.sold_out ? 'admin-pill--sold-out' : ''}`}
                      onClick={() => toggleSoldOut(show)}
                      title="Toggle Sold Out"
                    >
                      {show.sold_out ? 'Sold Out' : 'Available'}
                    </button>
                    <button className="admin-pill" onClick={() => handleEdit(show)}>
                      Edit
                    </button>
                    <button
                      className="admin-pill admin-pill--delete"
                      onClick={() => handleDelete(show.id)}
                      disabled={deleting === show.id}
                    >
                      {deleting === show.id ? '...' : 'Delete'}
                    </button>
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
