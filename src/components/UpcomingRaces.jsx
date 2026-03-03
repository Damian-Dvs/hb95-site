import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const UpcomingRaces = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const q = query(collection(db, 'upcomingRaces'), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        const today = new Date().toISOString().split('T')[0];
        const upcoming = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(r => r.date >= today);
        setRaces(upcoming);
      } catch {
        // fail silently — section hides itself if unavailable
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  if (loading || races.length === 0) return null;

  return (
    <section id="upcoming" className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">What's Next</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Upcoming Races</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4" />
        </div>

        <div className="space-y-3">
          {races.map((race, i) => (
            <div
              key={race.id}
              className="bg-gray-50 rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-teal-600 to-teal-500 text-white rounded-xl px-3 py-2.5 text-center shrink-0 w-14 shadow-sm">
                <p className="text-[10px] font-bold uppercase leading-none mb-1 text-teal-100">
                  {new Date(race.date + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                </p>
                <p className="text-xl font-black leading-none">
                  {new Date(race.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit' })}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{race.track}</p>
                {(race.championship || race.notes) && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {[race.championship, race.notes].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              {i === 0 && (
                <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                  Next
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingRaces;
