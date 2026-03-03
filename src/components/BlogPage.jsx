import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const POSTS_PER_PAGE = 6;

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
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
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetched);
        if (fetched.length > 0) setExpanded(fetched[0].id);
      } catch {
        setError('Could not load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

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
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">From the Track</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Blog</h1>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4" />
          {!loading && posts.length > 0 && (
            <p className="text-sm text-gray-400 mt-3">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-20 bg-gray-200 rounded-2xl" />)}
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
            {visiblePosts.map(post => {
              const isExpanded = expanded === post.id;
              return (
                <div
                  key={post.id}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? 'bg-white shadow-lg ring-1 ring-gray-200'
                      : 'bg-white border border-gray-100 hover:shadow-md hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setExpanded(prev => prev === post.id ? null : post.id)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 shadow-sm">
                        {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <p className="font-semibold text-gray-900 flex-1 min-w-0 truncate">{post.title}</p>
                      <ChevronIcon open={isExpanded} />
                    </div>
                    {!isExpanded && post.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-1">{post.excerpt}</p>
                    )}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="prose prose-sm max-w-none text-gray-700 mt-4">
                        <ReactMarkdown>{post.body}</ReactMarkdown>
                      </div>
                      <button
                        onClick={() => setExpanded(null)}
                        className="mt-4 text-teal-600 text-sm font-semibold hover:text-teal-800 transition-colors"
                      >
                        Show Less
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(c => c + POSTS_PER_PAGE)}
              className="group inline-flex items-center gap-2 bg-white text-teal-600 border-2 border-teal-200 px-7 py-3 rounded-full font-semibold text-sm hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-300 shadow-sm"
            >
              Load More Posts
              <span className="text-xs text-gray-400 group-hover:text-teal-100">
                ({posts.length - visibleCount} remaining)
              </span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
