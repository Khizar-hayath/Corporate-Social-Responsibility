import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiCalendar, FiUser, FiTag, FiArrowRight, FiPlus, FiX } from 'react-icons/fi';
import NewsForm from '../components/forms/NewsForm';

function News() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsRef, newsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'press', label: 'Press Releases' },
    { id: 'updates', label: 'Updates' },
    { id: 'stories', label: 'Success Stories' },
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const filteredArticles = news.filter((article) => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">News & Updates</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {showForm ? (
              <>
                <FiX className="w-5 h-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <FiPlus className="w-5 h-5 mr-2" />
                Submit News
              </>
            )}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <NewsForm />
          </motion.div>
        )}

        {/* News Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filter */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search news..."
                    className="input w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                        activeCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* News Grid */}
            <motion.div
              ref={newsRef}
              initial={{ opacity: 0 }}
              animate={newsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={newsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full text-sm font-semibold text-gray-900 dark:text-white">
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <FiCalendar className="mr-2" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                      <FiUser className="ml-4 mr-2" />
                      <span>{article.author}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          <FiTag className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="btn-secondary inline-flex items-center"
                    >
                      Read More
                      <FiArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default News; 