import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiHeart, FiUsers, FiCreditCard, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import VolunteerForm from '../components/forms/VolunteerForm';
import { paymentsAPI } from '../services/api';
import { RAZORPAY_KEY_ID } from '../config';

function GetInvolved() {
  const [donationAmount, setDonationAmount] = useState(50);
  const [donationType, setDonationType] = useState('one-time');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', null
  const [paymentMessage, setPaymentMessage] = useState('');
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const donationOptions = [25, 50, 100, 250, 500];

  const handleDonationSubmit = async () => {
    // Validation
    if (!donorName.trim()) {
      setPaymentStatus('error');
      setPaymentMessage('Please enter your name');
      return;
    }

    if (!donorEmail.trim()) {
      setPaymentStatus('error');
      setPaymentMessage('Please enter your email');
      return;
    }

    if (!donorEmail.includes('@')) {
      setPaymentStatus('error');
      setPaymentMessage('Please enter a valid email address');
      return;
    }

    if (donationAmount < 1) {
      setPaymentStatus('error');
      setPaymentMessage('Minimum donation amount is ₹1');
      return;
    }

    setLoading(true);
    setPaymentStatus(null);
    setPaymentMessage('');

    try {
      // Create order on backend
      const orderResponse = await paymentsAPI.createOrder({
        amount: donationAmount,
        donationType,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim().toLowerCase(),
        donorPhone: donorPhone.trim() || undefined
      });

      const { orderId, amount, currency, key } = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: key || RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'CSR Initiative',
        description: `${donationType === 'monthly' ? 'Monthly' : 'One-time'} Donation of ₹${donationAmount}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await paymentsAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              setPaymentStatus('success');
              setPaymentMessage(`Thank you! Your donation of ₹${donationAmount} has been processed successfully. Payment ID: ${response.razorpay_payment_id.substring(0, 8)}...`);
              
              // Reset form after 5 seconds
              setTimeout(() => {
                setDonorName('');
                setDonorEmail('');
                setDonorPhone('');
                setDonationAmount(50);
                setPaymentStatus(null);
                setPaymentMessage('');
              }, 5000);
            } else {
              setPaymentStatus('error');
              setPaymentMessage('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('error');
            setPaymentMessage(error.response?.data?.message || 'Payment verification failed. Please contact support if amount was deducted.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: donorName.trim(),
          email: donorEmail.trim().toLowerCase(),
          contact: donorPhone.trim() || undefined
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setPaymentStatus(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setPaymentStatus('error');
        setPaymentMessage(`Payment failed: ${response.error.description || 'Please try again'}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStatus('error');
      setPaymentMessage(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
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
            Join us in our mission to create sustainable social impact. Whether through
            volunteering, donations, or partnerships, your support makes a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Volunteer Section */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30">
                  <FiUsers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Volunteer With Us
                </h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300">
                Share your skills and time to make a positive impact. Our volunteers are 
                the backbone of our organization, helping us reach more communities and 
                deliver our programs effectively.
              </p>

              <VolunteerForm />
            </motion.div>

            {/* Donate Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30">
                  <FiHeart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Donate to Our Cause
                </h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300">
                Your financial support helps us sustain our projects and reach more communities.
                Every rupee counts towards creating meaningful change.
              </p>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-10">
                {/* Payment Status Messages */}
                {paymentStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3"
                  >
                    <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800 dark:text-green-200">{paymentMessage}</p>
                  </motion.div>
                )}

                {paymentStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3"
                  >
                    <FiX className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-200">{paymentMessage}</p>
                  </motion.div>
                )}

                {/* Donor Information Form */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-6">
                    <button
                      onClick={() => setDonationType('one-time')}
                      disabled={loading}
                      className={`w-1/2 py-3 font-medium transition-colors ${
                        donationType === 'one-time'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setDonationType('monthly')}
                      disabled={loading}
                      className={`w-1/2 py-3 font-medium transition-colors ${
                        donationType === 'monthly'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Monthly
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Select an amount
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {donationOptions.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        disabled={loading}
                        className={`py-3 font-medium transition-colors rounded-lg ${
                          donationAmount === amount
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                    
                    <div className="col-span-3 mt-3">
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(Number(e.target.value) || 0)}
                        disabled={loading}
                        min="1"
                        className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Custom amount"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleDonationSubmit}
                  disabled={loading}
                  className={`w-full py-4 px-8 bg-primary-600 hover:bg-primary-700 text-white font-medium border border-primary-600 transition-colors flex items-center justify-center rounded-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="mr-2" />
                      Donate ₹{donationAmount} {donationType === 'monthly' ? 'monthly' : ''}
                    </>
                  )}
                </motion.button>
                
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Secure payment processing via Razorpay. All donations are tax-deductible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corporate Partnership Section */}
      <section className="py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Corporate Partnerships
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Partner with us to align your business goals with meaningful social impact.
              We offer tailored CSR programs and partnership opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sponsored Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fund specific projects that align with your company's values and impact goals.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Employee Engagement
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Involve your employees in volunteering activities and team-building events.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Strategic CSR Programs
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Develop long-term CSR strategies that create sustainable impact.
              </p>
            </motion.div>
          </div>
          
          <div className="text-center mt-16">
            <motion.button
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium border border-primary-600 transition-colors rounded-lg"
            >
              Contact Our Partnership Team
            </motion.button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default GetInvolved;
