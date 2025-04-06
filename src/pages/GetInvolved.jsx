import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { FiHeart, FiDollarSign, FiClock, FiUsers, FiArrowRight, FiCheck, FiStar, FiGift, FiGlobe, FiTarget } from 'react-icons/fi';
import VolunteerForm from '../components/forms/VolunteerForm';

function GetInvolved() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('volunteer');
  const [donationAmount, setDonationAmount] = useState('');
  
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [opportunitiesRef, opportunitiesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [donateRef, donateInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const handleDonate = (amount) => {
    setDonationAmount(amount);
    // Here you would integrate with your payment processor
    console.log('Donation amount:', amount);
  };

  const volunteerOpportunities = [
    {
      id: 'teaching',
      icon: FiUsers,
      title: 'Education',
      description: 'Teach valuable skills to individuals in underserved communities.',
      color: 'bg-blue-500'
    },
    {
      id: 'environment',
      icon: FiGlobe,
      title: 'Environmental',
      description: 'Help with conservation efforts and sustainable development initiatives.',
      color: 'bg-green-500'
    },
    {
      id: 'events',
      icon: FiStar,
      title: 'Events',
      description: 'Assist with organizing fundraisers, awareness campaigns, and community gatherings.',
      color: 'bg-purple-500'
    },
    {
      id: 'technical',
      icon: FiTarget,
      title: 'Technical',
      description: 'Contribute your professional skills in IT, design, or project management.',
      color: 'bg-yellow-500'
    },
  ];

  const donationOptions = [
    { amount: '25', label: '$25', description: 'Provides educational materials for 5 children' },
    { amount: '50', label: '$50', description: 'Supports a community garden for one month' },
    { amount: '100', label: '$100', description: 'Funds clean water access for a small village' },
    { amount: '250', label: '$250', description: 'Sponsors a microbusiness startup' },
    { amount: 'custom', label: 'Custom', description: 'Choose your own amount to contribute' },
  ];

  const impactStats = [
    { icon: FiUsers, value: '10,000+', label: 'Lives Impacted' },
    { icon: FiGlobe, value: '25+', label: 'Countries Reached' },
    { icon: FiHeart, value: '500+', label: 'Volunteers Engaged' },
    { icon: FiTarget, value: '100+', label: 'Projects Completed' },
  ];

  return (
    <PageTransition>
      {/* Hero Section with Gradient Background */}
      <section
        ref={heroRef}
        className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-900 via-primary-700 to-purple-800"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute right-0 bottom-0 -mb-10 -mr-10 lg:mb-0 lg:mr-0 opacity-20">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern)" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 -mt-10 -ml-10 lg:mt-0 lg:ml-0 opacity-20">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern2)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Make a <span className="text-yellow-300">Difference</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10"
            >
              Join our community of changemakers and help us create lasting positive impact around the world
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('volunteer')}
                className="bg-white text-primary-700 hover:bg-yellow-100 px-8 py-3 rounded-lg shadow-lg font-semibold transition-all flex items-center justify-center"
              >
                <FiHeart className="mr-2" />
                Volunteer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('donate')}
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-3 rounded-lg shadow-lg font-semibold transition-all flex items-center justify-center"
              >
                <FiDollarSign className="mr-2" />
                Donate
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section 
        ref={opportunitiesRef} 
        className="py-16 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={opportunitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Volunteer Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how you can contribute your time and talents to make a meaningful impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {volunteerOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={opportunitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
              >
                <div className={`${opportunity.color} p-6 text-white flex justify-center`}>
                  <opportunity.icon className="w-14 h-14" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {opportunity.description}
                  </p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('volunteer')}
                    className="text-primary-600 dark:text-primary-400 font-medium flex items-center"
                  >
                    Learn more
                    <FiArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'volunteer'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FiHeart className="inline mr-2" />
              Volunteer Application
            </button>
            <button
              onClick={() => setActiveTab('donate')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'donate'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FiDollarSign className="inline mr-2" />
              Make a Donation
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {activeTab === 'volunteer' ? (
              <div className="p-8">
                <VolunteerForm />
              </div>
            ) : (
              <div 
                ref={donateRef} 
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Support Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Your generous contribution helps us continue our work and create lasting change in communities around the world.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {donationOptions.map((option, index) => (
                    <motion.div
                      key={option.amount}
                      initial={{ opacity: 0, y: 20 }}
                      animate={donateInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDonate(option.amount)}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        donationAmount === option.amount
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {option.label}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {option.description}
                      </p>
                      {donationAmount === option.amount && (
                        <div className="mt-4 text-primary-600">
                          <FiCheck className="inline mr-1" /> Selected
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {donationAmount && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg shadow-md font-medium flex items-center justify-center"
                  >
                    <FiGift className="mr-2" />
                    {donationAmount === 'custom' ? 'Proceed to Donation' : `Donate ${donationAmount}`}
                  </motion.button>
                )}
                
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  All donations are tax-deductible. You will receive a receipt for your records.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default GetInvolved; 