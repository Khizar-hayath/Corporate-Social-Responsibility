import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { FiArrowRight, FiUsers, FiTarget, FiGlobe, FiHeart, FiAward, FiTrendingUp } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [timelineRef, timelineInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    { icon: FiUsers, value: '100+', label: 'Communities Impacted' },
    { icon: FiTarget, value: '250+', label: 'Projects Completed' },
    { icon: FiGlobe, value: '15+', label: 'Countries Reached' },
    { icon: FiHeart, value: '5000+', label: 'Lives Changed' },
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'CSR Initiative was established with a vision to create sustainable impact.',
      icon: FiAward,
    },
    {
      year: '2021',
      title: 'Global Expansion',
      description: 'Expanded operations to multiple countries and launched key initiatives.',
      icon: FiGlobe,
    },
    {
      year: '2022',
      title: 'Impact Milestone',
      description: 'Reached 100+ communities and completed 100+ projects.',
      icon: FiTarget,
    },
    {
      year: '2023',
      title: 'Innovation Award',
      description: 'Recognized for innovative approaches to community development.',
      icon: FiTrendingUp,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <PageTransition>
      {/* Hero Section with Parallax */}
      <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-[4px]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center" />
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/30 shadow-lg">
                Making a Difference Together
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
            >
              Transform Lives Through
              <motion.span 
                className="text-primary-400 block drop-shadow-2xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 30px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Sustainable Impact
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-xl"
            >
              Join us in our mission to create lasting change through corporate
              social responsibility initiatives that empower communities and
              inspire transformation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/get-involved')}
                className="btn-primary group bg-primary-600 hover:bg-primary-700 text-white shadow-xl"
              >
                Get Started
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/about')}
                className="btn-outline bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md shadow-lg"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Floating Animation */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  className="relative inline-block"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <stat.icon className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                </motion.div>
                <motion.p
                  className="text-4xl font-bold text-primary-600 dark:text-primary-400"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {stat.value}
                </motion.p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
            
      {/* Timeline Section */}
      {/*
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={timelineRef}
            initial={{ opacity: 0, y: 20 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A timeline of our growth and achievements in making a positive impact.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-600/20" />
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative mb-8 flex ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 relative">
                    <div className="absolute top-0 left-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center transform -translate-x-1/2">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-6">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}
      {/* Featured Section with Hover Effects */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Initiatives
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our latest projects and see how we're making a positive
              impact in communities around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Education for All',
                description: 'Providing quality education to underprivileged children in rural communities.',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Green Earth Initiative',
                description: 'Environmental conservation and sustainable development projects.',
                image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Healthcare Access',
                description: 'Improving healthcare access in underserved communities.',
                image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/projects')}
                    className="btn-secondary"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default Home; 