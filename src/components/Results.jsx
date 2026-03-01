import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const Results = () => {
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, 'raceResults'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRaceResults(data);
      } catch (err) {
        setError('Could not load race results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <section id="results" className="bg-gray-100 py-16 px-6 md:px-20 text-black">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Race Results</h2>

        {loading && (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-gray-300 rounded" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-4">
            {error}
          </div>
        )}

        {!loading && !error && raceResults.length === 0 && (
          <p className="text-gray-500 py-8">No race results yet — check back soon!</p>
        )}

        {!loading && !error && raceResults.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Position</th>
                </tr>
              </thead>
              <tbody>
                {raceResults.map((race) => (
                  <tr key={race.id} className="bg-white border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{new Date(race.date).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4">{race.track}</td>
                    <td className="py-3 px-4 font-bold">{race.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;
