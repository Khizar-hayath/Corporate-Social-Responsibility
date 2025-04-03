import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiMessageSquare, FiTarget, FiCalendar, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiBell } from 'react-icons/fi';
import { API_BASE_URL } from '../../config';

function Dashboard() {
  const [stats, setStats] = useState({
    volunteers: 0,
    news: 0,
    messages: 0,
    projects: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // Fetch statistics from the backend
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [volunteersRes, newsRes, messagesRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/volunteers`),
          fetch(`${API_BASE_URL}/admin/news`),
          fetch(`${API_BASE_URL}/admin/contact`),
          fetch(`${API_BASE_URL}/admin/projects`)
        ]);

        const [volunteers, news, messages, projects] = await Promise.all([
          volunteersRes.json(),
          newsRes.json(),
          messagesRes.json(),
          projectsRes.json()
        ]);

        // Mock recent activity data (replace with actual API call when available)
        const mockRecentActivity = [
          { id: 1, type: 'project', action: 'created', title: 'Clean Water Initiative', user: 'Admin', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, type: 'volunteer', action: 'approved', title: 'John Smith', user: 'Admin', timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: 3, type: 'news', action: 'published', title: 'New Partnership Announcement', user: 'Admin', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { id: 4, type: 'message', action: 'received', title: 'Donation Inquiry', user: 'Sarah Johnson', timestamp: new Date(Date.now() - 172800000).toISOString() },
        ];
        
        // Mock upcoming tasks (replace with actual API call when available)
        const mockUpcomingTasks = [
          { id: 1, title: 'Review volunteer applications', priority: 'high', dueDate: new Date(Date.now() + 86400000).toISOString() },
          { id: 2, title: 'Publish monthly newsletter', priority: 'medium', dueDate: new Date(Date.now() + 259200000).toISOString() },
          { id: 3, title: 'Update project status reports', priority: 'medium', dueDate: new Date(Date.now() + 432000000).toISOString() },
        ];

        setStats({
          volunteers: volunteers.length,
          news: news.length,
          messages: messages.length,
          projects: projects.length
        });
        setRecentActivity(mockRecentActivity);
        setUpcomingTasks(mockUpcomingTasks);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Volunteers', value: stats.volunteers, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'News Articles', value: stats.news, icon: FiFileText, color: 'bg-green-500' },
    { title: 'Messages', value: stats.messages, icon: FiMessageSquare, color: 'bg-yellow-500' },
    { title: 'Projects', value: stats.projects, icon: FiTarget, color: 'bg-purple-500' }
  ];

  // Function to format date relative to current time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project': return FiTarget;
      case 'volunteer': return FiUsers;
      case 'news': return FiFileText;
      case 'message': return FiMessageSquare;
      default: return FiBell;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to your Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's an overview of your organization's activity and important metrics.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div className="flex-shrink-0 p-2 rounded-full bg-primary-50 dark:bg-primary-900/20">
                      <ActivityIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        <span className="font-semibold">{activity.title}</span> was {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        by {activity.user} • {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent activity to display</p>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Tasks</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">Add Task</button>
          </div>
          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex-shrink-0">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <FiAlertCircle className={`w-4 h-4 mr-1 ${getPriorityClass(task.priority)}`} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize mr-2">
                        {task.priority} priority
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiCheckCircle className="w-5 h-5 text-gray-400 hover:text-green-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <FiFileText className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Article</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <FiTarget className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Project</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <FiUsers className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Volunteers</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <FiTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 