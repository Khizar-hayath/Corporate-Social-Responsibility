import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiFileText, FiMessageSquare, FiTarget, FiCalendar, 
  FiTrendingUp, FiAlertCircle, FiCheckCircle, FiBell, FiDollarSign,
  FiBarChart2, FiClock, FiHeart, FiShield, FiEdit, FiRefreshCw, FiDownload 
} from 'react-icons/fi';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AdminHeader from '../../components/admin/AdminHeader';

function Dashboard() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    volunteers: 0,
    news: 0,
    messages: 0,
    projects: 0,
    donations: 0,
    totalDonationAmount: 0,
    users: 0,
    pageViews: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    // Fetch statistics from the backend
    document.title = 'Admin Dashboard | CSR Website';
    const fetchDummyData = () => {
      // Simulate API call with dummy data for demonstration
      setLoading(true);
      setTimeout(() => {
        setStats({
          volunteers: 42,
          news: 24,
          messages: 78,
          projects: 15,
          donations: 156,
          totalDonationAmount: 24750,
          users: 238,
          pageViews: 12845
        });
        
        setRecentActivity([
          {
            id: 1,
            type: 'message',
            content: 'New message from John Doe regarding water initiative',
            time: '10 minutes ago'
          },
          {
            id: 2,
            type: 'volunteer',
            content: 'Sarah Smith applied as a volunteer for education program',
            time: '2 hours ago'
          },
          {
            id: 3,
            type: 'project',
            content: 'Project "Clean Water Initiative" was updated with new photos',
            time: '1 day ago'
          },
          {
            id: 4,
            type: 'donation',
            content: 'Anonymous donor contributed $500 to Hunger Relief',
            time: '3 hours ago'
          },
          {
            id: 5,
            type: 'news',
            content: 'New article "Community Impact Report 2023" published',
            time: '4 hours ago'
          }
        ]);
        
        setUpcomingTasks([
          {
            id: 1,
            title: 'Review 12 new volunteer applications',
            dueDate: 'Today',
            priority: 'high'
          },
          {
            id: 2,
            title: 'Update news content for summer campaign',
            dueDate: 'Tomorrow',
            priority: 'medium'
          },
          {
            id: 3,
            title: 'Prepare monthly donation report',
            dueDate: 'Next week',
            priority: 'low'
          },
          {
            id: 4,
            title: 'Schedule social media posts for upcoming event',
            dueDate: 'Thursday',
            priority: 'medium'
          },
          {
            id: 5,
            title: 'Finalize budget for Q3 initiatives',
            dueDate: 'Friday',
            priority: 'high'
          }
        ]);
        
        setRecentDonations([
          {
            id: 1,
            donor: 'Michael Johnson',
            amount: 250,
            project: 'Education Fund',
            date: 'Today'
          },
          {
            id: 2,
            donor: 'Anonymous',
            amount: 1000,
            project: 'General Fund',
            date: 'Yesterday'
          },
          {
            id: 3,
            donor: 'Emma Williams',
            amount: 75,
            project: 'Hunger Relief',
            date: 'Yesterday'
          },
          {
            id: 4,
            donor: 'Robert Brown',
            amount: 500,
            project: 'Clean Water Initiative',
            date: '2 days ago'
          }
        ]);
        
        setPerformanceData({
          visitors: {
            current: 1245,
            previous: 980,
            change: 27
          },
          engagement: {
            current: 4.2,
            previous: 3.8,
            change: 10.5
          },
          conversion: {
            current: 2.8,
            previous: 2.3,
            change: 21.7
          }
        });
        
        setLoading(false);
      }, 1000);
    };
    
    fetchDummyData();
  }, []);

  // Generate stat cards data
  const statCards = [
    {
      title: 'Volunteers',
      value: stats.volunteers,
      icon: FiUsers,
      color: 'bg-blue-500',
      link: '/admin/volunteers'
    },
    {
      title: 'News Articles',
      value: stats.news,
      icon: FiFileText,
      color: 'bg-green-500',
      link: '/admin/news'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: FiMessageSquare,
      color: 'bg-yellow-500',
      link: '/admin/contact'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FiTarget,
      color: 'bg-purple-500',
      link: '/admin/projects'
    }
  ];

  // Generate donation stat cards
  const donationStats = [
    {
      title: 'Total Donations',
      value: stats.donations,
      icon: FiHeart,
      color: 'bg-red-500'
    },
    {
      title: 'Total Amount',
      value: `$${stats.totalDonationAmount.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: 'Registered Users',
      value: stats.users,
      icon: FiShield,
      color: 'bg-indigo-500'
    },
    {
      title: 'Page Views',
      value: stats.pageViews.toLocaleString(),
      icon: FiBarChart2,
      color: 'bg-cyan-500'
    }
  ];

  // Quick actions list
  const quickActions = [
    {
      title: 'Add News Article',
      icon: FiEdit,
      link: '/admin/news/add',
      color: 'text-blue-500'
    },
    {
      title: 'Update Projects',
      icon: FiRefreshCw,
      link: '/admin/projects',
      color: 'text-purple-500'
    },
    {
      title: 'Review Volunteers',
      icon: FiUsers,
      link: '/admin/volunteers',
      color: 'text-green-500'
    },
    {
      title: 'Download Reports',
      icon: FiDownload,
      link: '#',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <AdminHeader
            title="Welcome to your Dashboard"
            subtitle="Here's an overview of your organization's activity and important metrics."
          />
          
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
                <Link to={stat.link} className="flex items-center group">
                  <div className={`p-3 rounded-lg ${stat.color} group-hover:opacity-80 transition-opacity`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{stat.value}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Donation Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Donation Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationStats.map((stat, index) => (
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
          </motion.div>

          {/* Activity and Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
              {loading ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading activities...</div>
              ) : (
                <ul className="space-y-4">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="border-b dark:border-gray-700 pb-3 last:border-b-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {activity.type === 'message' && (
                            <FiMessageSquare className="w-5 h-5 text-blue-500" />
                          )}
                          {activity.type === 'volunteer' && (
                            <FiUsers className="w-5 h-5 text-green-500" />
                          )}
                          {activity.type === 'project' && (
                            <FiTarget className="w-5 h-5 text-purple-500" />
                          )}
                          {activity.type === 'donation' && (
                            <FiDollarSign className="w-5 h-5 text-red-500" />
                          )}
                          {activity.type === 'news' && (
                            <FiFileText className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-800 dark:text-gray-200">{activity.content}</p>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 text-center">
                <button className="text-primary-600 dark:text-primary-400 hover:underline">
                  View all activity
                </button>
              </div>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Tasks</h2>
              {loading ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading tasks...</div>
              ) : (
                <ul className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <li key={task.id} className="border-b dark:border-gray-700 pb-3 last:border-b-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {task.priority === 'high' && (
                            <FiAlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          {task.priority === 'medium' && (
                            <FiBell className="w-5 h-5 text-yellow-500" />
                          )}
                          {task.priority === 'low' && (
                            <FiCheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-800 dark:text-gray-200">{task.title}</p>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 text-center">
                <button className="text-primary-600 dark:text-primary-400 hover:underline">
                  View all tasks
                </button>
              </div>
            </motion.div>
          </div>

          {/* Recent Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Donations</h2>
            {loading ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading donations...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Donor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {donation.donor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ${donation.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {donation.project}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {donation.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-center">
              <button className="text-primary-600 dark:text-primary-400 hover:underline">
                View all donations
              </button>
            </div>
          </motion.div>

          {/* Performance Metrics and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Website Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Website Performance</h2>
              {loading ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading metrics...</div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Visitors</h3>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{performanceData.visitors.current.toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center ${performanceData.visitors.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{performanceData.visitors.change}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Engagement Time (min)</h3>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{performanceData.engagement.current}</p>
                    </div>
                    <div className={`flex items-center ${performanceData.engagement.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{performanceData.engagement.change}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</h3>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{performanceData.conversion.current}%</p>
                    </div>
                    <div className={`flex items-center ${performanceData.conversion.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{performanceData.conversion.change}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link 
                    key={action.title}
                    to={action.link}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <action.icon className={`w-8 h-8 mb-2 ${action.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{action.title}</span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Admin Tips</h3>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Regular updates to your news and projects sections can increase user engagement by up to 35%. 
                  Consider refreshing content at least once a week.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard; 