import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiHeart, FiDollarSign, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';
import VolunteerForm from '../components/forms/VolunteerForm';

function GetInvolved() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    volunteerType: 'general',
  });

  const [donationAmount, setDonationAmount] = useState('');
  const [heroRef, heroInView] = useInView({
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative py-20 bg-primary-600 text-white"
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get Involved
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Join us in making a difference in our community
              </p>
            </motion.div>
          </div>
        </section>

        {/* Volunteer Form Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <VolunteerForm />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default GetInvolved; 