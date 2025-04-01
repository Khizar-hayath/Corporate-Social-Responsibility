import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiMessageSquare, FiTarget } from 'react-icons/fi';

function Dashboard() {
  const [stats, setStats] = useState({
    volunteers: 0,
    news: 0,
    messages: 0,
    projects: 0
  });

  useEffect(() => {
    // Fetch statistics from the backend
    const fetchStats = async () => {
      try {
        const [volunteersRes, newsRes, messagesRes, projectsRes] = await Promise.all([
          fetch('http://localhost:5000/api/volunteers'),
          fetch('http://localhost:5000/api/news'),
          fetch('http://localhost:5000/api/contact'),
          fetch('http://localhost:5000/api/projects')
        ]);

        const [volunteers, news, messages, projects] = await Promise.all([
          volunteersRes.json(),
          newsRes.json(),
          messagesRes.json(),
          projectsRes.json()
        ]);

        setStats({
          volunteers: volunteers.length,
          news: news.length,
          messages: messages.length,
          projects: projects.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
      
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

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
          <p className="text-gray-500 dark:text-gray-400">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 