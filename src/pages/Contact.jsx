import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import ContactForm from '../components/forms/ContactForm';

function Contact() {
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      content: 'contact@csrinitiative.com',
      link: 'mailto:contact@csrinitiative.com',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: FiMapPin,
      title: 'Address',
      content: '123 CSR Street, City, Country',
      link: 'https://maps.google.com',
    },
    {
      icon: FiClock,
      title: 'Working Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
    },
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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions or want to learn more about our initiatives? We're here
              to help. Get in touch with us through any of the following channels.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                        <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="mt-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="mt-1 text-gray-600 dark:text-gray-300">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Location
                </h2>
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* Replace with your Google Maps embed */}
                  <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30603803104!2d-74.25986682528057!3d40.69714941971462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1625671649948!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find answers to some of the most commonly asked questions.
            </p>
          </div>
          
          <div className="space-y-6">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How can I get involved with your organization?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can get involved by volunteering your time, donating to our projects, 
                or partnering with us. Please visit our "Get Involved" page for more information
                or contact us directly.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Where does my donation go?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your donations directly support our projects and initiatives. We ensure
                that at least 85% of all donations go directly to project implementation,
                with the remainder covering essential administrative costs.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I partner with you for a corporate social responsibility project?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we collaborate with businesses of all sizes for CSR initiatives.
                We can create customized programs tailored to your company's goals and values.
                Please contact our partnerships team to discuss potential collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default Contact; 