import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const INITIAL_VISIBLE = 5;

const isWin = (pos) => ['p1', '1st', '1'].includes((pos || '').toLowerCase().replace(/\s/g, ''));
const isPodium = (pos) => ['p1', 'p2', 'p3', '1st', '2nd', '3rd', '1', '2', '3'].includes((pos || '').toLowerCase().replace(/\s/g, ''));

const positionStyle = (pos) => {
  const p = (pos || '').toLowerCase().replace(/\s/g, '');
  if (['p1', '1st', '1'].includes(p)) return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-300 shadow-sm';
  if (['p2', '2nd', '2'].includes(p)) return 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-300 shadow-sm';
  if (['p3', '3rd', '3'].includes(p)) return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-300 shadow-sm';
  if (['dnf', 'dns', 'dsq'].includes(p)) return 'bg-red-50 text-red-600 border border-red-200';
  return 'bg-teal-50 text-teal-700 border border-teal-200';
};

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EventCard = ({ event, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const finalSession = event.sessions?.find(s => s.type === 'Final');
  const hasNotes = event.sessions?.some(s => s.notes);
  const finalPos = finalSession?.position || '';
  const isWinResult = isWin(finalPos);

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
      open
        ? 'bg-white shadow-lg ring-1 ring-gray-200'
        : 'bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200'
    }`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50/50"
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 shadow-sm">
            {new Date(event.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <div className="min-w-0">
            <span className="font-semibold text-gray-900 block truncate">{event.track}</span>
            {event.championship && (
              <span className="text-xs text-gray-400 block">{event.championship}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          {finalSession && !open && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${positionStyle(finalPos)}`}>
              {isWinResult && (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2.2 5-5 5h-.2c-.5 1.5-1.5 2.7-2.8 3.5V18h3c.6 0 1 .4 1 1v2H7v-2c0-.6.4-1 1-1h3v-3.5C9.7 13.7 8.7 12.5 8.2 11H8c-2.8 0-5-2.2-5-5V4c0-.6.4-1 1-1zm1 2v1c0 1.7 1.3 3 3 3h.3c0-.3.1-.7.1-1V5H6zm12 0h-3.4v3c0 .3 0 .7.1 1H15c1.7 0 3-1.3 3-3V5z" />
                </svg>
              )}
              Final: {finalPos}
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-100 px-5 py-4">
          {event.sessions && event.sessions.length > 0 ? (
            <div className="space-y-1">
              {event.sessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium w-24">{s.type}</span>
                    {hasNotes && s.notes && (
                      <span className="text-gray-400 text-xs hidden sm:inline">{s.notes}</span>
                    )}
                  </div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${positionStyle(s.position)}`}>
                    {s.position}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No session data recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const YearSeparator = ({ year }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent flex-1" />
    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{year} Season</span>
    <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent flex-1" />
  </div>
);

const Results = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

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

  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  const getYear = (dateStr) => new Date(dateStr + 'T12:00:00').getFullYear();

  return (
    <section id="results" className="bg-gray-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Season Stats</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Race Results</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4" />
        </div>

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
            {[
              { label: 'Races', value: totalEvents },
              { label: 'Wins', value: wins },
              { label: 'Podiums', value: podiums },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl text-center py-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
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
              <div key={n} className="h-16 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-gray-400 text-center py-8">No race results yet — check back soon!</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-3">
            {visibleEvents.map((event, i) => {
              const showYearSeparator = i === 0 || getYear(event.date) !== getYear(visibleEvents[i - 1].date);
              return (
                <React.Fragment key={event.id}>
                  {showYearSeparator && <YearSeparator year={getYear(event.date)} />}
                  <EventCard event={event} defaultOpen={i === 0} />
                </React.Fragment>
              );
            })}
          </div>
        )}

        {!loading && !error && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(c => c + INITIAL_VISIBLE)}
              className="group inline-flex items-center gap-2 bg-white text-teal-600 border-2 border-teal-200 px-7 py-3 rounded-full font-semibold text-sm hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-300 shadow-sm"
            >
              Show More Results
              <span className="text-xs text-gray-400 group-hover:text-teal-100">
                ({events.length - visibleCount} remaining)
              </span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {!loading && !error && !hasMore && events.length > INITIAL_VISIBLE && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setVisibleCount(INITIAL_VISIBLE);
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-600 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;
