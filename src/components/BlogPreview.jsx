import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const BlogPreview = () => {
  const [posts, setPosts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetched);
        if (fetched.length > 0) setExpandedId(fetched[0].id);
      } catch {
        setError('Could not load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="bg-white py-20 px-6" id="blog">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">From the Track</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Latest Posts</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4" />
        </div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-20 bg-gray-100 rounded-2xl" />)}
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
            {posts.map(post => {
              const isExpanded = expandedId === post.id;
              return (
                <div
                  key={post.id}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? 'bg-white shadow-lg ring-1 ring-gray-200'
                      : 'bg-gray-50 border border-gray-100 hover:shadow-md hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(prev => prev === post.id ? null : post.id)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 shadow-sm">
                        {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                      <p className="font-semibold text-gray-900 flex-1 min-w-0 truncate">{post.title}</p>
                      <ChevronIcon open={isExpanded} />
                    </div>
                    {!isExpanded && post.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 pl-0 line-clamp-1">{post.excerpt}</p>
                    )}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="prose prose-sm max-w-none text-gray-700 mt-4">
                        <ReactMarkdown>{post.body}</ReactMarkdown>
                      </div>
                      <button
                        onClick={() => setExpandedId(null)}
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

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/blog')}
            className="group inline-flex items-center gap-2 bg-teal-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-teal-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View All Posts
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
