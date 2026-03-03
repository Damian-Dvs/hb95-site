import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

/* ── helpers ─────────────────────────────────────────────── */

const posToNum = (pos) => {
  if (!pos) return null;
  const p = pos.toLowerCase().replace(/\s/g, '');
  if (['dnf', 'dns', 'dsq'].includes(p)) return null;
  const m = p.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
};

const isWin = (pos) => posToNum(pos) === 1;
const isPodium = (pos) => { const n = posToNum(pos); return n !== null && n <= 3; };

const positionStyle = (pos) => {
  const n = posToNum(pos);
  const p = (pos || '').toLowerCase().replace(/\s/g, '');
  if (n === 1) return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-300';
  if (n === 2) return 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-300';
  if (n === 3) return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-300';
  if (['dnf', 'dns', 'dsq'].includes(p)) return 'bg-red-50 text-red-600 border border-red-200';
  return 'bg-teal-50 text-teal-700 border border-teal-200';
};

const getFinalPos = (event) => {
  const final = event.sessions?.find(s => s.type === 'Final');
  return final?.position || null;
};

const trendArrow = (trend) => {
  if (trend === 'improving') return { icon: '\u2191', color: 'text-green-600', bg: 'bg-green-50', label: 'Improving' };
  if (trend === 'declining') return { icon: '\u2193', color: 'text-red-500', bg: 'bg-red-50', label: 'Declining' };
  return { icon: '\u2192', color: 'text-gray-400', bg: 'bg-gray-50', label: 'Stable' };
};

/* ── mini position chart (pure CSS) ──────────────────────── */

const PositionChart = ({ positions }) => {
  const nums = positions.map(p => posToNum(p)).filter(n => n !== null);
  if (nums.length < 2) return null;
  const max = Math.max(...nums, 10);

  return (
    <div className="flex items-end gap-1 h-16 mt-3">
      {nums.map((n, i) => {
        const height = Math.max(((max - n + 1) / max) * 100, 12);
        const isFirst = n === 1;
        const isPod = n <= 3;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
            <span className="text-[10px] text-gray-400 leading-none">{n}</span>
            <div
              className={`w-full rounded-t transition-all duration-300 ${
                isFirst ? 'bg-amber-400' : isPod ? 'bg-teal-400' : 'bg-gray-300'
              }`}
              style={{ height: `${height}%`, minHeight: '4px' }}
            />
          </div>
        );
      })}
    </div>
  );
};

/* ── track card ──────────────────────────────────────────── */

const TrackCard = ({ track, events, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);

  const sorted = useMemo(() =>
    [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events]
  );

  const finals = sorted.map(e => getFinalPos(e)).filter(Boolean);
  const finalNums = finals.map(posToNum).filter(n => n !== null);

  const best = finalNums.length > 0 ? Math.min(...finalNums) : null;
  const wins = finals.filter(isWin).length;
  const podiums = finals.filter(isPodium).length;
  const latest = finals.length > 0 ? finals[finals.length - 1] : null;

  // Trend: compare first half avg to second half avg (lower = better)
  let trend = 'stable';
  if (finalNums.length >= 3) {
    const mid = Math.floor(finalNums.length / 2);
    const firstHalf = finalNums.slice(0, mid);
    const secondHalf = finalNums.slice(mid);
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (avgSecond < avgFirst - 0.5) trend = 'improving';
    else if (avgSecond > avgFirst + 0.5) trend = 'declining';
  }

  const t = trendArrow(trend);

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
      open ? 'bg-white shadow-lg ring-1 ring-gray-200' : 'bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200'
    }`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-5 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 text-lg">{track}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.bg} ${t.color}`}>
                {t.icon} {t.label}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-gray-500">{events.length} race{events.length !== 1 ? 's' : ''}</span>
              {best !== null && (
                <span className="text-gray-500">Best: <strong className="text-gray-900">P{best}</strong></span>
              )}
              {wins > 0 && (
                <span className="text-amber-600 font-semibold">{wins} win{wins !== 1 ? 's' : ''}</span>
              )}
              {podiums > wins && (
                <span className="text-teal-600 font-semibold">{podiums} podium{podiums !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1">
            {latest && !open && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${positionStyle(latest)}`}>
                Latest: {latest}
              </span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-100 px-5 py-4">
          {/* Mini stats row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Races', value: events.length },
              { label: 'Wins', value: wins },
              { label: 'Podiums', value: podiums },
              { label: 'Best', value: best !== null ? `P${best}` : '-' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl py-3 text-center">
                <p className="text-lg font-black text-teal-600">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Position chart */}
          {finals.length >= 2 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 font-medium mb-1">Final Position History (oldest &rarr; newest)</p>
              <PositionChart positions={finals} />
            </div>
          )}

          {/* All visits */}
          <div className="space-y-1">
            {sorted.map((event, i) => {
              const pos = getFinalPos(event);
              return (
                <div key={event.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium w-20">
                      {new Date(event.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </span>
                    {event.championship && (
                      <span className="text-xs text-gray-400 hidden sm:inline">{event.championship}</span>
                    )}
                  </div>
                  {pos ? (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${positionStyle(pos)}`}>
                      {pos}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">-</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── main page ───────────────────────────────────────────── */

const StatsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('visits'); // visits | best | name
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'raceEvents'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError('Could not load stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Group by track
  const trackGroups = useMemo(() => {
    const groups = {};
    events.forEach(e => {
      const key = e.track?.trim() || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  }, [events]);

  // Sort tracks
  const sortedTracks = useMemo(() => {
    const entries = Object.entries(trackGroups);
    if (sortBy === 'name') return entries.sort((a, b) => a[0].localeCompare(b[0]));
    if (sortBy === 'best') {
      return entries.sort((a, b) => {
        const bestA = Math.min(...a[1].map(e => posToNum(getFinalPos(e))).filter(n => n !== null).concat([999]));
        const bestB = Math.min(...b[1].map(e => posToNum(getFinalPos(e))).filter(n => n !== null).concat([999]));
        return bestA - bestB;
      });
    }
    // default: by visit count (desc)
    return entries.sort((a, b) => b[1].length - a[1].length);
  }, [trackGroups, sortBy]);

  // Overall stats
  const totalRaces = events.length;
  const totalTracks = sortedTracks.length;
  const totalWins = events.filter(e => isWin(getFinalPos(e))).length;
  const totalPodiums = events.filter(e => isPodium(getFinalPos(e))).length;
  const allFinalNums = events.map(e => posToNum(getFinalPos(e))).filter(n => n !== null);
  const avgPos = allFinalNums.length > 0 ? (allFinalNums.reduce((a, b) => a + b, 0) / allFinalNums.length).toFixed(1) : '-';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-1.5 text-teal-600 hover:text-teal-800 text-sm font-semibold mb-10 transition-colors"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-12">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Performance</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Track Stats</h1>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4" />
          <p className="text-gray-400 text-sm mt-3">Results broken down by circuit — track improvements over time.</p>
        </div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-20 bg-gray-200 rounded-2xl" />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm text-center">{error}</div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-center text-gray-400 py-8">No race data yet — check back after some races!</p>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            {/* Career overview */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-10">
              {[
                { label: 'Races', value: totalRaces },
                { label: 'Tracks', value: totalTracks },
                { label: 'Wins', value: totalWins },
                { label: 'Podiums', value: totalPodiums },
                { label: 'Avg Pos', value: avgPos },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl text-center py-5 shadow-sm border border-gray-100">
                  <p className="text-xl sm:text-2xl font-black bg-gradient-to-br from-teal-600 to-teal-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Sort controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{totalTracks} circuit{totalTracks !== 1 ? 's' : ''} visited</p>
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                {[
                  { key: 'visits', label: 'Most Raced' },
                  { key: 'best', label: 'Best Result' },
                  { key: 'name', label: 'A-Z' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      sortBy === opt.key
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Track cards */}
            <div className="space-y-3">
              {sortedTracks.map(([track, trackEvents], i) => (
                <TrackCard key={track} track={track} events={trackEvents} defaultOpen={i === 0} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
