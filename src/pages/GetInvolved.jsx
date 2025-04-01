import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiHeart, FiDollarSign, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';

function GetInvolved() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    volunteerType: 'general',
  });

  const [donationAmount, setDonationAmount] = useState('');
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Show success message or redirect
  };

  const handleDonate = (amount) => {
    setDonationAmount(amount);
    // Here you would integrate with your payment processor
    console.log('Donation amount:', amount);
  };

  const volunteerTypes = [
    { id: 'general', label: 'General Volunteer' },
    { id: 'teaching', label: 'Teaching' },
    { id: 'mentoring', label: 'Mentoring' },
    { id: 'event', label: 'Event Support' },
    { id: 'technical', label: 'Technical Support' },
  ];

  const donationOptions = [
    { amount: '25', label: '$25' },
    { amount: '50', label: '$50' },
    { amount: '100', label: '$100' },
    { amount: '250', label: '$250' },
    { amount: 'custom', label: 'Custom' },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Get Involved
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join us in making a difference. Whether you want to volunteer your time
              or support our initiatives through donations, there are many ways to
              contribute to our mission.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Volunteer Sign Up
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Volunteer Type</label>
                  <select
                    className="input"
                    value={formData.volunteerType}
                    onChange={(e) => setFormData({ ...formData, volunteerType: e.target.value })}
                  >
                    {volunteerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    className="input"
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full"
                >
                  Submit Application
                </motion.button>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Volunteer?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiHeart className="w-6 h-6 text-primary-600 mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Make a Difference
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your time and skills can create lasting impact in communities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiUsers className="w-6 h-6 text-primary-600 mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Build Connections
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Meet like-minded individuals and expand your network.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiClock className="w-6 h-6 text-primary-600 mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Flexible Commitment
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose how and when you want to contribute.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Support Our Cause
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {donationOptions.map((option) => (
                    <motion.button
                      key={option.amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDonate(option.amount)}
                      className={`p-4 rounded-lg text-center font-semibold transition-colors ${
                        donationAmount === option.amount
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                {donationAmount === 'custom' && (
                  <div className="mb-6">
                    <input
                      type="number"
                      className="input"
                      placeholder="Enter custom amount"
                      onChange={(e) => handleDonate(e.target.value)}
                    />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full"
                  onClick={() => console.log('Donate clicked')}
                >
                  <FiDollarSign className="inline-block mr-2" />
                  Donate Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default GetInvolved; 