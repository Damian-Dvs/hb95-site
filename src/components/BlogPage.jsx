import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

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
        const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(result);
      } catch (err) {
        setError('Could not load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-teal-600 hover:text-teal-800 text-sm font-semibold underline"
          >
            Back to Home
          </button>
        </div>

        <h2 className="text-4xl font-bold text-center text-black mb-12">
          Blog
        </h2>

        {loading && (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-28" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-4 text-center">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-500 py-8">No posts yet — check back soon!</p>
        )}

        {!loading && !error && posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 p-6 rounded-2xl shadow-md mb-8"
          >
            <h3 className="text-2xl font-bold text-black mb-2">{post.title}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {new Date(post.publishedAt).toLocaleDateString("en-GB")}
            </p>

            <div className="text-gray-800">
              {expanded === post.id ? (
                <>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{post.body}</ReactMarkdown>
                  </div>
                  <button
                    onClick={() => setExpanded(null)}
                    className="text-teal-600 mt-4 underline hover:text-teal-800"
                  >
                    Show Less
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setExpanded(post.id)}
                  className="text-teal-600 font-semibold hover:text-teal-800"
                >
                  Read More
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogPage;
