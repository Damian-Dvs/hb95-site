import React, { useEffect, useState } from "react";
import { client } from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import { useNavigate } from "react-router-dom";

const BlogPreview = () => {
  const [posts, setPosts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc)[0...3]{
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          body
        }`;
        const result = await client.fetch(query);
        setPosts(result);
      } catch (err) {
        setError('Could not load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-16 bg-white" id="blog-preview">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-black mb-12">
          Latest Blog Posts
        </h2>

        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-xl h-24" />
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
          <div key={post._id} className="bg-gray-50 p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-black mb-2">{post.title}</h3>
            <p className="text-gray-500 text-sm mb-2">
              {new Date(post.publishedAt).toLocaleDateString("en-GB")}
            </p>
            {expandedId === post._id ? (
              <>
                <PortableText value={post.body} />
                <button
                  className="text-teal-600 mt-3 underline hover:text-teal-800"
                  onClick={() => toggleExpand(post._id)}
                >
                  Show Less
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-2">{post.excerpt}</p>
                <button
                  className="text-teal-600 font-semibold hover:text-teal-800"
                  onClick={() => toggleExpand(post._id)}
                >
                  Read More
                </button>
              </>
            )}
          </div>
        ))}

        <div className="text-center mt-8">
          <button
            className="bg-teal-600 text-white px-6 py-3 rounded shadow hover:bg-teal-700"
            onClick={() => navigate("/blog")}
          >
            View All Blog Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
