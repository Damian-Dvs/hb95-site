import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// ─── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/HB95.png" alt="HB95" className="h-16 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-teal-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">HB95 Race Management</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Shared ────────────────────────────────────────────────────────────────────
const ChevronIcon = ({ open }) => (
  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500';
const cardCls = 'bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5';
const btnPrimary = 'w-full sm:w-auto bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60';
const ErrorBanner = ({ msg }) => msg ? (
  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm mb-4">{msg}</div>
) : null;

// ─── Race Events Tab ───────────────────────────────────────────────────────────
const SESSION_TYPES = ['Qualifying', 'Heat 1', 'Heat 2', 'Heat 3', 'Pre-Final', 'Final', 'Other'];
const defaultSessions = () => [
  { type: 'Qualifying', position: '', notes: '' },
  { type: 'Heat 1',     position: '', notes: '' },
  { type: 'Final',      position: '', notes: '' },
];

const ResultsTab = () => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ date: '', track: '', championship: '' });
  const [sessions, setSessions] = useState(defaultSessions());
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'raceEvents'), orderBy('date', 'desc')));
    setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };
  useEffect(() => { fetchEvents(); }, []);

  const updateSession = (i, field, val) =>
    setSessions(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.track) { setError('Date and track are required.'); return; }
    const valid = sessions.filter(s => s.position.trim());
    if (!valid.length) { setError('Add a position for at least one session.'); return; }
    setError(''); setSaving(true);
    try {
      await addDoc(collection(db, 'raceEvents'), {
        date: form.date, track: form.track.trim(), championship: form.championship.trim(),
        sessions: valid.map(s => ({ type: s.type, position: s.position.trim(), notes: s.notes.trim() })),
        createdAt: serverTimestamp(),
      });
      setForm({ date: '', track: '', championship: '' });
      setSessions(defaultSessions());
      await fetchEvents();
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this race event?')) return;
    await deleteDoc(doc(db, 'raceEvents', id));
    await fetchEvents();
  };

  return (
    <div>
      <div className={cardCls}>
        <h3 className="text-base font-bold text-teal-900 mb-4">Add Race Event</h3>
        <ErrorBanner msg={error} />
        <form onSubmit={handleAdd} className="space-y-4">
          {/* Event meta — 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Track / Venue</label>
              <input type="text" placeholder="e.g. Whilton Mill" value={form.track} onChange={e => setForm({ ...form, track: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Championship <span className="normal-case font-normal text-gray-400">(optional)</span></label>
              <input type="text" placeholder="e.g. British Cadet" value={form.championship} onChange={e => setForm({ ...form, championship: e.target.value })} className={inputCls} />
            </div>
          </div>

          {/* Sessions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sessions</label>
              <button type="button" onClick={() => setSessions(p => [...p, { type: 'Heat 2', position: '', notes: '' }])}
                className="text-teal-600 hover:text-teal-800 text-sm font-semibold">
                + Add session
              </button>
            </div>

            {/* Desktop header (hidden on mobile) */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 px-1">
              <span className="col-span-4">Type</span>
              <span className="col-span-3">Position</span>
              <span className="col-span-4">Notes (optional)</span>
            </div>

            <div className="space-y-2">
              {sessions.map((s, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0">
                  {/* Type — full width on mobile (col-span-2), 4 cols on desktop */}
                  <div className="col-span-2 sm:col-span-4">
                    <select value={s.type} onChange={e => updateSession(i, 'type', e.target.value)} className={inputCls}>
                      {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {/* Position — half width on mobile, 3 cols on desktop */}
                  <div className="col-span-1 sm:col-span-3">
                    <input type="text" placeholder="P1 / DNF…" value={s.position} onChange={e => updateSession(i, 'position', e.target.value)} className={inputCls} />
                  </div>
                  {/* Notes — half width on mobile, 4 cols on desktop */}
                  <div className="col-span-1 sm:col-span-4">
                    <input type="text" placeholder="Notes…" value={s.notes} onChange={e => updateSession(i, 'notes', e.target.value)} className={inputCls} />
                  </div>
                  {/* Remove */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end sm:justify-center">
                    {sessions.length > 1 && (
                      <button type="button" onClick={() => setSessions(p => p.filter((_, idx) => idx !== i))}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold py-1 px-2 sm:px-0">
                        <span className="sm:hidden">Remove</span>
                        <span className="hidden sm:inline text-lg leading-none">×</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Saving…' : 'Add Event'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="text-base font-bold text-teal-900 px-5 py-4 border-b border-gray-100">Race Events</h3>
        {loading ? (
          <div className="p-5 space-y-2 animate-pulse">{[1,2,3].map(n => <div key={n} className="h-12 bg-gray-100 rounded-lg" />)}</div>
        ) : events.length === 0 ? (
          <p className="px-5 py-4 text-gray-400 text-sm">No events yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map(ev => (
              <div key={ev.id}>
                <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 active:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}>
                  <div className="min-w-0 mr-3">
                    <p className="font-semibold text-gray-900 truncate">{ev.track}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ev.date).toLocaleDateString('en-GB')}{ev.championship && ` · ${ev.championship}`}
                      {' · '}{ev.sessions?.length || 0} session{ev.sessions?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={e => { e.stopPropagation(); handleDelete(ev.id); }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium py-1 px-2">Delete</button>
                    <ChevronIcon open={expandedId === ev.id} />
                  </div>
                </div>
                {expandedId === ev.id && ev.sessions && (
                  <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                          <th className="pb-1.5 font-semibold">Session</th>
                          <th className="pb-1.5 font-semibold">Position</th>
                          <th className="pb-1.5 font-semibold hidden sm:table-cell">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ev.sessions.map((s, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-2 text-gray-700">{s.type}</td>
                            <td className="py-2 font-bold text-teal-700">{s.position}</td>
                            <td className="py-2 text-gray-400 hidden sm:table-cell">{s.notes || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Blog Posts Tab ────────────────────────────────────────────────────────────
const BlogTab = () => {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]     = useState({ title: '', excerpt: '', body: '', publishedAt: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc')));
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };
  useEffect(() => { fetchPosts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.publishedAt) { setError('Title, body and date are required.'); return; }
    setError(''); setSaving(true);
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title: form.title.trim(), excerpt: form.excerpt.trim(),
        body: form.body.trim(), publishedAt: form.publishedAt, createdAt: serverTimestamp(),
      });
      setForm({ title: '', excerpt: '', body: '', publishedAt: '' });
      await fetchPosts();
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    await deleteDoc(doc(db, 'blogPosts', id));
    await fetchPosts();
  };

  return (
    <div>
      <div className={cardCls}>
        <h3 className="text-base font-bold text-teal-900 mb-4">Add Blog Post</h3>
        <ErrorBanner msg={error} />
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Title</label>
              <input type="text" placeholder="e.g. Great race at Whilton!" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Published Date</label>
              <input type="date" value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Short Summary <span className="normal-case font-normal text-gray-400">(shown on preview cards)</span>
            </label>
            <textarea rows={2} placeholder="A brief one-line teaser…" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Full Post Body <span className="normal-case font-normal text-gray-400">— Markdown supported: **bold**, # Heading, - bullet</span>
            </label>
            <textarea rows={10} placeholder={`# Race Day at Whilton Mill\n\nWhat a fantastic day...`} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className={`${inputCls} font-mono resize-y`} />
          </div>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Publishing…' : 'Publish Post'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="text-base font-bold text-teal-900 px-5 py-4 border-b border-gray-100">Published Posts</h3>
        {loading ? (
          <div className="p-5 space-y-2 animate-pulse">{[1,2,3].map(n => <div key={n} className="h-12 bg-gray-100 rounded-lg" />)}</div>
        ) : posts.length === 0 ? (
          <p className="px-5 py-4 text-gray-400 text-sm">No posts yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                <div className="min-w-0 mr-3">
                  <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(p.publishedAt).toLocaleDateString('en-GB')}
                    {p.excerpt && ` — ${p.excerpt.slice(0, 50)}${p.excerpt.length > 50 ? '…' : ''}`}
                  </p>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm font-medium py-1 px-2 shrink-0">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Gallery Tab (URL-based, no Firebase Storage needed) ──────────────────────
const GalleryTab = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'galleryImages'), orderBy('createdAt', 'desc')));
    setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };
  useEffect(() => { fetchImages(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (previewError) { setError('That URL does not appear to be a valid image.'); return; }
    setError(''); setSaving(true);
    try {
      await addDoc(collection(db, 'galleryImages'), { url: trimmed, createdAt: serverTimestamp() });
      setUrlInput('');
      setPreviewError(false);
      await fetchImages();
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image from the gallery?')) return;
    await deleteDoc(doc(db, 'galleryImages', id));
    await fetchImages();
  };

  return (
    <div>
      <div className={cardCls}>
        <h3 className="text-base font-bold text-teal-900 mb-1">Add Image</h3>
        <p className="text-sm text-gray-400 mb-4">
          Paste any public image URL — from <strong>Imgur</strong>, Google Photos (shared link), or anywhere else.
        </p>
        <ErrorBanner msg={error} />
        <form onSubmit={handleAdd}>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="url"
                placeholder="https://i.imgur.com/example.jpg"
                value={urlInput}
                onChange={e => { setUrlInput(e.target.value); setPreviewError(false); setError(''); }}
                className={inputCls}
              />
              {urlInput && !previewError && (
                <img
                  src={urlInput}
                  alt="Preview"
                  className="mt-2 h-20 w-20 object-cover rounded-lg border border-gray-200"
                  onError={() => setPreviewError(true)}
                />
              )}
              {urlInput && previewError && (
                <p className="mt-1.5 text-xs text-red-500">Could not load image — check the URL is correct and publicly accessible.</p>
              )}
            </div>
            <button type="submit" disabled={saving || !urlInput.trim() || previewError}
              className="bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 shrink-0">
              {saving ? '…' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-bold text-teal-900 mb-4">
          Gallery Images <span className="text-gray-400 font-normal text-sm">({images.length})</span>
        </h3>
        {loading ? (
          <div className="grid grid-cols-3 gap-3 animate-pulse">
            {[1,2,3].map(n => <div key={n} className="aspect-square bg-gray-100 rounded-xl" />)}
          </div>
        ) : images.length === 0 ? (
          <p className="text-gray-400 text-sm">No images yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map(img => (
              <div key={img.id} className="relative aspect-square group">
                <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl" />
                {/* Always visible on mobile, hover on desktop */}
                <button onClick={() => handleDelete(img.id)}
                  className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow transition sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Upcoming Races Tab ────────────────────────────────────────────────────────
const UpcomingTab = () => {
  const [races, setRaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]     = useState({ date: '', track: '', championship: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const fetchRaces = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'upcomingRaces'), orderBy('date', 'asc')));
    setRaces(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };
  useEffect(() => { fetchRaces(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.track) { setError('Date and track are required.'); return; }
    setError(''); setSaving(true);
    try {
      await addDoc(collection(db, 'upcomingRaces'), {
        date: form.date, track: form.track.trim(),
        championship: form.championship.trim(), notes: form.notes.trim(),
        createdAt: serverTimestamp(),
      });
      setForm({ date: '', track: '', championship: '', notes: '' });
      await fetchRaces();
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this upcoming race?')) return;
    await deleteDoc(doc(db, 'upcomingRaces', id));
    await fetchRaces();
  };

  return (
    <div>
      <div className={cardCls}>
        <h3 className="text-base font-bold text-teal-900 mb-4">Add Upcoming Race</h3>
        <ErrorBanner msg={error} />
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Track / Venue</label>
              <input type="text" placeholder="e.g. Whilton Mill" value={form.track} onChange={e => setForm({ ...form, track: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Championship <span className="normal-case font-normal text-gray-400">(optional)</span></label>
              <input type="text" placeholder="e.g. British Cadet" value={form.championship} onChange={e => setForm({ ...form, championship: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes <span className="normal-case font-normal text-gray-400">(optional)</span></label>
              <input type="text" placeholder="e.g. Round 3 of 6" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputCls} />
            </div>
          </div>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Saving…' : 'Add Race'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="text-base font-bold text-teal-900 px-5 py-4 border-b border-gray-100">Upcoming Races</h3>
        {loading ? (
          <div className="p-5 space-y-2 animate-pulse">{[1,2,3].map(n => <div key={n} className="h-12 bg-gray-100 rounded-lg" />)}</div>
        ) : races.length === 0 ? (
          <p className="px-5 py-4 text-gray-400 text-sm">No upcoming races added yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {races.map(r => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                <div className="min-w-0 mr-3">
                  <p className="font-semibold text-gray-900 truncate">{r.track}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(r.date + 'T12:00:00').toLocaleDateString('en-GB')}
                    {r.championship && ` · ${r.championship}`}
                    {r.notes && ` · ${r.notes}`}
                  </p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-sm font-medium py-1 px-2 shrink-0">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Admin Component ──────────────────────────────────────────────────────
const TABS = [
  { key: 'results',  label: 'Race Events' },
  { key: 'blog',     label: 'Blog Posts' },
  { key: 'gallery',  label: 'Gallery' },
  { key: 'upcoming', label: 'Upcoming Races' },
];

const Admin = () => {
  const [user, setUser] = useState(undefined);
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u || null));
    return unsub;
  }, []);

  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-teal-700 font-semibold">Loading…</div>
    </div>;
  }

  if (!user) return <LoginForm />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-900 text-white px-5 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/HB95.png" alt="HB95" className="h-9" />
          <div>
            <h1 className="font-bold text-base leading-tight">HB95 Admin</h1>
            <p className="text-teal-300 text-xs truncate max-w-[140px] sm:max-w-none">{user.email}</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)}
          className="bg-teal-700 hover:bg-teal-600 active:bg-teal-500 px-3 py-2 rounded-lg text-sm font-medium transition">
          Sign Out
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        {/* Tab bar — 2×2 grid on mobile, single row on desktop */}
        <div className="grid grid-cols-2 sm:flex gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition text-center ${
                activeTab === tab.key
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100 shadow-sm border border-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'results'  && <ResultsTab />}
        {activeTab === 'blog'     && <BlogTab />}
        {activeTab === 'gallery'  && <GalleryTab />}
        {activeTab === 'upcoming' && <UpcomingTab />}
      </div>
    </div>
  );
};

export default Admin;
