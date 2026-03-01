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
        <div className="text-center mb-10">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">What's Next</p>
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Races</h2>
        </div>

        <div className="space-y-3">
          {races.map(race => (
            <div key={race.id} className="bg-gray-50 rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4">
              <div className="bg-teal-600 text-white rounded-xl px-3 py-2 text-center shrink-0 w-14">
                <p className="text-xs font-bold uppercase leading-none mb-1">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingRaces;
