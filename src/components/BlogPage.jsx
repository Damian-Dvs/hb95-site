import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError('Could not load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-teal-600 hover:text-teal-800 text-sm font-semibold mb-10 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-10">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">From the Track</p>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        </div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-16 bg-gray-100 rounded-2xl" />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-400 py-8">No posts yet — check back soon!</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpanded(prev => prev === post.id ? null : post.id)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded shrink-0">
                      {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <p className="font-semibold text-gray-900 flex-1 min-w-0 truncate">{post.title}</p>
                    <ChevronIcon open={expanded === post.id} />
                  </div>
                  {expanded !== post.id && post.excerpt && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-1">{post.excerpt}</p>
                  )}
                </button>

                {expanded === post.id && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="prose prose-sm max-w-none text-gray-700 mt-4">
                      <ReactMarkdown>{post.body}</ReactMarkdown>
                    </div>
                    <button
                      onClick={() => setExpanded(null)}
                      className="mt-4 text-teal-600 text-sm font-semibold hover:text-teal-800"
                    >
                      Show Less
                    </button>
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

export default BlogPage;
