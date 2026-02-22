import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { API_BASE_URL } from '../../config';
import NewsTable from './components/news/NewsTable';
import NewsForm from './components/news/NewsForm';
import NewsFilters from './components/news/NewsFilters';
import AdminSidebar from '../../components/layout/AdminSidebar';

/**
 * Admin News Management Page
 * 
 * Features:
 * - View all news articles in a table
 * - Search and filter news articles
 * - Create, edit, and delete news articles
 * - Preview news articles
 */
function AdminNews() {
  // State management
  const [newsItems, setNewsItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [view, setView] = useState('active'); // 'active', 'draft', 'archived'

  // Fetch news articles when component mounts or dependencies change
  useEffect(() => {
    fetchNews();
  }, [category, view]);

  /**
   * Fetch news articles from the API
   */
  const fetchNews = async () => {
    setLoading(true);
    try {
      // Construct query parameters for filtering
      const queryParams = new URLSearchParams();
      if (category !== 'all') queryParams.append('category', category);
      if (view !== 'all') queryParams.append('status', view);
      
      const response = await fetch(`${API_BASE_URL}/api/news?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news articles');
      }
      
      const data = await response.json();
      console.log('News API response:', data);
      
      // The news API returns either data.news (if paginated) or directly the data array
      setNewsItems(data.news || data); 
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news articles. Please try again.');
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission for creating or updating a news article
   */
  const handleSubmit = async (newsData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const url = editingNews
        ? `${API_BASE_URL}/api/news/${editingNews._id}`
        : `${API_BASE_URL}/api/news`;
      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save news article');
      }

      // Refresh the news list
      await fetchNews();
      
      // Reset form state
      setShowForm(false);
      setEditingNews(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving news:', err);
    }
  };

  /**
   * Handle editing a news article
   */
  const handleEdit = (news) => {
    setEditingNews(news);
    setShowForm(true);
  };

  /**
   * Handle deleting a news article
   */
  const handleDelete = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/news/${newsId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete news article');
      }

      // Refresh the news list
      await fetchNews();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting news:', err);
    }
  };

  /**
   * Filter news articles based on search query and other filters
   */
  const filteredNews = newsItems.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">News Management</h1>
            <button
              onClick={() => {
                setEditingNews(null);
                setShowForm(true);
              }}
              className="btn-primary btn-sm"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Add News Article
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search news articles..."
                  className="block w-full pl-10 pr-3 py-3 px-5 border border-gray-300 leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <NewsFilters 
                category={category}
                setCategory={setCategory}
                view={view}
                setView={setView}
              />
            </div>
          </div>

          {/* News Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 mb-8"
            >
              <NewsForm
                news={editingNews}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingNews(null);
                }}
              />
            </motion.div>
          )}

          {/* News Table */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredNews.length > 0 ? (
              <NewsTable 
                news={filteredNews} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                No news articles found. {searchQuery && 'Try adjusting your search criteria.'}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminNews; 