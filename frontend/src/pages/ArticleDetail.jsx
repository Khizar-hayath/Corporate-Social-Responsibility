import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import api from '../services/api';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/news/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Link to="/news" className="btn-primary">
          Back to News
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Link to="/news" className="btn-primary">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <Link to="/news" className="inline-flex items-center text-primary-600 mb-8 hover:underline">
          <FiArrowLeft className="mr-2" />
          Back to News
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center mr-6 mb-2">
              <FiCalendar className="mr-2" />
              <span>{new Date(article.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mb-2">
              <FiUser className="mr-2" />
              <span>{article.author}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags && article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <FiTag className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {article.image && (
          <div className="mb-8 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* If content is HTML */}
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            /* Fallback to fullText if content is not available */
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {article.fullText || article.excerpt}
            </p>
          )}
        </div>
      </article>
    </PageTransition>
  );
}

export default ArticleDetail; 