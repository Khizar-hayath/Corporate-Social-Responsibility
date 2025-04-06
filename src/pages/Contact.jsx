import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageSquare, FiLink, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import ContactForm from '../components/forms/ContactForm';

function Contact() {
  const [activeContact, setActiveContact] = useState(null);
  
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const contactInfo = [
    {
      id: 'email',
      icon: FiMail,
      title: 'Email',
      content: 'contact@csrinitiative.com',
      link: 'mailto:contact@csrinitiative.com',
      color: 'bg-blue-600',
    },
    {
      id: 'phone',
      icon: FiPhone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'bg-green-600',
    },
    {
      id: 'address',
      icon: FiMapPin,
      title: 'Address',
      content: '123 CSR Street, City, Country',
      link: 'https://maps.google.com',
      color: 'bg-purple-600',
    },
    {
      id: 'hours',
      icon: FiClock,
      title: 'Working Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: 'bg-yellow-600',
    },
  ];
  
  const socialLinks = [
    { icon: FiFacebook, name: 'Facebook', url: 'https://facebook.com', color: 'text-blue-600 hover:text-blue-800' },
    { icon: FiTwitter, name: 'Twitter', url: 'https://twitter.com', color: 'text-sky-500 hover:text-sky-700' },
    { icon: FiInstagram, name: 'Instagram', url: 'https://instagram.com', color: 'text-pink-600 hover:text-pink-800' },
  ];

  return (
    <PageTransition>
      {/* Hero Section with Gradient Background */}
      <section
        ref={heroRef}
        className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
        
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
              Get in <span className="text-blue-300">Touch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10"
            >
              Have questions or want to learn more about our initiatives? We'd love to hear from you!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section 
        ref={cardsRef}
        className="py-16 -mt-12 md:-mt-20 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setActiveContact(item.id)}
                onMouseLeave={() => setActiveContact(null)}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`${item.color} p-4 text-white flex items-center`}>
                  <div className="bg-white/20 p-3 rounded-full">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">{item.title}</h3>
                </div>
                <div className="p-6">
                  {item.link ? (
                    <a 
                      href={item.link} 
                      target={item.id === 'address' ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
                    >
                      <span className="mr-2">{item.content}</span>
                      {activeContact === item.id && <FiLink className="animate-pulse" />}
                    </a>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200">{item.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section 
        ref={formRef}
        className="py-12 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FiMessageSquare className="mr-2 text-primary-600" />
                    Send Us a Message
                  </h2>
                  <ContactForm />
                </div>
              </div>
            </motion.div>
            
            {/* Map and Social Links */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                {/* Map */}
                <div className="flex-grow relative min-h-[300px]">
                  <iframe 
                    title="Location Map"
                    className="absolute inset-0 w-full h-full border-0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317715.71192318275!2d-0.3817765404096949!3d51.528642059855895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1617586080070!5m2!1sen!2sus" 
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
                
                {/* Social Links */}
                <div className="p-6 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
                  <div className="flex items-center gap-4">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${link.color}`}
                        aria-label={link.name}
                      >
                        <link.icon className="w-6 h-6" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Optional */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-left"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How can my company get involved?</h3>
              <p className="text-gray-600 dark:text-gray-300">We offer various partnership opportunities for companies looking to make a positive social impact. Contact our corporate engagement team to discuss how we can collaborate.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-left"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Do you accept in-kind donations?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, we accept in-kind donations that align with our current projects and needs. Please contact us with details of what you'd like to donate so we can determine if it meets our requirements.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-left"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How are donations utilized?</h3>
              <p className="text-gray-600 dark:text-gray-300">Your donations directly support our projects and initiatives. We ensure transparency by publishing annual reports detailing how funds are allocated across our programs.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default Contact; 