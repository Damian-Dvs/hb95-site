import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const isWin = (pos) => ['p1', '1st', '1'].includes((pos || '').toLowerCase().replace(/\s/g, ''));
const isPodium = (pos) => ['p1', 'p2', 'p3', '1st', '2nd', '3rd', '1', '2', '3'].includes((pos || '').toLowerCase().replace(/\s/g, ''));

const positionStyle = (pos) => {
  const p = (pos || '').toLowerCase().replace(/\s/g, '');
  if (['p1', '1st', '1'].includes(p)) return 'bg-amber-100 text-amber-800 border border-amber-300';
  if (['p2', '2nd', '2'].includes(p)) return 'bg-slate-100 text-slate-700 border border-slate-300';
  if (['p3', '3rd', '3'].includes(p)) return 'bg-orange-100 text-orange-700 border border-orange-300';
  if (['dnf', 'dns', 'dsq'].includes(p)) return 'bg-red-50 text-red-600 border border-red-200';
  return 'bg-teal-50 text-teal-700 border border-teal-200';
};

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EventCard = ({ event, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const finalSession = event.sessions?.find(s => s.type === 'Final');
  const hasNotes = event.sessions?.some(s => s.notes);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded shrink-0">
            {new Date(event.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span className="font-semibold text-gray-900">{event.track}</span>
          {event.championship && (
            <span className="text-xs text-gray-400">{event.championship}</span>
          )}
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          {finalSession && !open && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${positionStyle(finalSession.position)}`}>
              Final: {finalSession.position}
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          {event.sessions && event.sessions.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                  <th className="pb-2 font-medium w-32">Session</th>
                  <th className="pb-2 font-medium w-24">Position</th>
                  {hasNotes && <th className="pb-2 font-medium">Notes</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {event.sessions.map((s, i) => (
                  <tr key={i}>
                    <td className="py-2 text-gray-700 font-medium">{s.type}</td>
                    <td className="py-2">
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${positionStyle(s.position)}`}>
                        {s.position}
                      </span>
                    </td>
                    {hasNotes && (
                      <td className="py-2 text-gray-400 text-xs">{s.notes || ''}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No session data recorded.</p>
          )}
        </div>
      )}
    </div>
  );
};

const Results = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'raceEvents'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError('Could not load race results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const totalEvents = events.length;
  const wins = events.filter(ev => ev.sessions?.some(s => s.type === 'Final' && isWin(s.position))).length;
  const podiums = events.filter(ev => ev.sessions?.some(s => s.type === 'Final' && isPodium(s.position))).length;

  return (
    <section id="results" className="bg-gray-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Season Stats</p>
          <h2 className="text-3xl font-bold text-gray-900">Race Results</h2>
        </div>

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Races', value: totalEvents },
              { label: 'Wins', value: wins },
              { label: 'Podiums', value: podiums },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl text-center py-5 shadow-sm border border-gray-100">
                <p className="text-3xl font-black text-teal-600">{stat.value}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mb-6">
          Tap any event to see the full session breakdown.
        </p>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-14 bg-gray-200 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-gray-400 text-center py-8">No race results yet — check back soon!</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-3">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} defaultOpen={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;
