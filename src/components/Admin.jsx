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
const LoginForm = ({ onLogin }) => {
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
      onLogin();
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
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Race Events Tab ───────────────────────────────────────────────────────────
const SESSION_TYPES = ['Qualifying', 'Heat 1', 'Heat 2', 'Heat 3', 'Pre-Final', 'Final', 'Other'];

const defaultSessions = () => [
  { type: 'Qualifying', position: '', notes: '' },
  { type: 'Heat 1', position: '', notes: '' },
  { type: 'Final', position: '', notes: '' },
];

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ResultsTab = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', track: '', championship: '' });
  const [sessions, setSessions] = useState(defaultSessions());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    const q = query(collection(db, 'raceEvents'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const updateSession = (i, field, value) => {
    setSessions(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const addSession = () => {
    setSessions(prev => [...prev, { type: 'Heat 2', position: '', notes: '' }]);
  };

  const removeSession = (i) => {
    setSessions(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.track) { setError('Date and track are required.'); return; }
    const validSessions = sessions.filter(s => s.position.trim());
    if (validSessions.length === 0) { setError('Add a position for at least one session.'); return; }
    setError('');
    setSaving(true);
    try {
      await addDoc(collection(db, 'raceEvents'), {
        date: form.date,
        track: form.track.trim(),
        championship: form.championship.trim(),
        sessions: validSessions.map(s => ({
          type: s.type,
          position: s.position.trim(),
          notes: s.notes.trim(),
        })),
        createdAt: serverTimestamp(),
      });
      setForm({ date: '', track: '', championship: '' });
      setSessions(defaultSessions());
      await fetchEvents();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this race event and all its sessions?')) return;
    await deleteDoc(doc(db, 'raceEvents', id));
    await fetchEvents();
  };

  return (
    <div>
      {/* Add Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-teal-900 mb-4">Add Race Event</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleAdd} className="space-y-5">
          {/* Event meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Track / Venue</label>
              <input
                type="text"
                placeholder="e.g. Whilton Mill"
                value={form.track}
                onChange={e => setForm({ ...form, track: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Championship <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. British Cadet"
                value={form.championship}
                onChange={e => setForm({ ...form, championship: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Sessions builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Sessions</label>
              <button
                type="button"
                onClick={addSession}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium"
              >
                + Add session
              </button>
            </div>
            <div className="space-y-2">
              <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide px-1">
                <span className="col-span-4">Type</span>
                <span className="col-span-3">Position</span>
                <span className="col-span-4">Notes (optional)</span>
              </div>
              {sessions.map((s, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <select
                      value={s.type}
                      onChange={e => updateSession(i, 'type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="P1 / DNF…"
                      value={s.position}
                      onChange={e => updateSession(i, 'position', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g. Pole position"
                      value={s.notes}
                      onChange={e => updateSession(i, 'notes', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSession(i)}
                        className="text-red-400 hover:text-red-600 text-xl leading-none"
                        title="Remove session"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Add Event'}
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h3 className="text-lg font-bold text-teal-900 p-6 pb-3">Race Events</h3>
        {loading ? (
          <div className="p-6 space-y-2 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-10 bg-gray-100 rounded" />)}
          </div>
        ) : events.length === 0 ? (
          <p className="px-6 pb-6 text-gray-500 text-sm">No events yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map(ev => (
              <div key={ev.id}>
                <div
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{ev.track}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ev.date).toLocaleDateString('en-GB')}
                      {ev.championship && ` · ${ev.championship}`}
                      {' · '}{ev.sessions?.length || 0} session{ev.sessions?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(ev.id); }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                    <ChevronIcon open={expandedId === ev.id} />
                  </div>
                </div>

                {expandedId === ev.id && ev.sessions && (
                  <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                          <th className="pb-1 font-medium">Session</th>
                          <th className="pb-1 font-medium">Position</th>
                          <th className="pb-1 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ev.sessions.map((s, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-1.5 text-gray-700">{s.type}</td>
                            <td className="py-1.5 font-bold text-teal-700">{s.position}</td>
                            <td className="py-1.5 text-gray-400">{s.notes || '—'}</td>
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', excerpt: '', body: '', publishedAt: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
    const snapshot = await getDocs(q);
    setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.publishedAt) {
      setError('Title, body and date are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        body: form.body.trim(),
        publishedAt: form.publishedAt,
        createdAt: serverTimestamp(),
      });
      setForm({ title: '', excerpt: '', body: '', publishedAt: '' });
      await fetchPosts();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    await deleteDoc(doc(db, 'blogPosts', id));
    await fetchPosts();
  };

  return (
    <div>
      {/* Add Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-teal-900 mb-4">Add Blog Post</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Great race at Whilton!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Summary <span className="text-gray-400">(shown on preview cards)</span>
            </label>
            <textarea
              rows={2}
              placeholder="A brief one-line teaser shown before 'Read More'…"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Post Body{' '}
              <span className="text-gray-400 font-normal">
                — supports Markdown: **bold**, # Heading, - bullet
              </span>
            </label>
            <textarea
              rows={10}
              placeholder={`# Race Day at Whilton Mill\n\nWhat a fantastic day out on the track...\n\n## Qualifying\n\nStarted from P4 after a clean qualifying session...`}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60"
          >
            {saving ? 'Publishing…' : 'Publish Post'}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h3 className="text-lg font-bold text-teal-900 p-6 pb-3">Published Posts</h3>
        {loading ? (
          <div className="p-6 space-y-2 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-12 bg-gray-100 rounded" />)}
          </div>
        ) : posts.length === 0 ? (
          <p className="px-6 pb-6 text-gray-500 text-sm">No posts yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map(p => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(p.publishedAt).toLocaleDateString('en-GB')}
                    {p.excerpt && ` — ${p.excerpt.slice(0, 60)}${p.excerpt.length > 60 ? '…' : ''}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Admin Component ──────────────────────────────────────────────────────
const Admin = () => {
  const [user, setUser] = useState(undefined); // undefined = checking auth
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u || null));
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-teal-700 font-semibold">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/HB95.png" alt="HB95" className="h-10" />
          <div>
            <h1 className="font-bold text-lg leading-tight">HB95 Admin</h1>
            <p className="text-teal-300 text-xs">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === 'results'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Race Events
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === 'blog'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Blog Posts
          </button>
        </div>

        {activeTab === 'results' ? <ResultsTab /> : <BlogTab />}
      </div>
    </div>
  );
};

export default Admin;
