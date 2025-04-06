import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiTarget, FiHeart, FiUsers, FiGlobe, FiAward } from 'react-icons/fi';

function About() {
  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Passionate about creating sustainable impact in communities.',
    },
    {
      name: 'Jane Smith',
      role: 'Program Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Leading initiatives for positive social change.',
    },
    {
      name: 'Mike Johnson',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Building strong relationships with local communities.',
    },
  ];

  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To create lasting positive impact in communities through sustainable development initiatives.',
    },
    {
      icon: FiHeart,
      title: 'Our Vision',
      description: 'A world where every community has access to opportunities for growth and development.',
    },
    {
      icon: FiUsers,
      title: 'Our Values',
      description: 'Integrity, collaboration, and commitment to making a difference.',
    },
  ];

  const achievements = [
    {
      icon: FiAward,
      title: 'Community Impact Award',
      year: '2023',
      description: 'Recognized for outstanding contributions to community development.',
    },
    {
      icon: FiGlobe,
      title: 'Global Initiative',
      year: '2022',
      description: 'Expanded operations to 15+ countries worldwide.',
    },
    {
      icon: FiUsers,
      title: 'Volunteer Excellence',
      year: '2021',
      description: 'Mobilized over 1000 volunteers for community projects.',
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-blue-800 via-primary-700 to-purple-800">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 -mt-10 -ml-10 lg:mt-0 lg:ml-0 opacity-20">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern-about" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern-about)" />
          </svg>
        </div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
        <div className="absolute top-40 right-40 w-40 h-40 rounded-full bg-yellow-500 opacity-20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              About <span className="text-blue-300">Us</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            >
              Learn about our mission, values, and the team behind our initiatives
              to create positive change in communities worldwide.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 bg-white dark:bg-gray-900 -mt-12 md:-mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={aboutRef}
            initial={{ opacity: 0 }}
            animate={aboutInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full 
                  ${index === 0 ? 'bg-blue-100 text-blue-600' : 
                    index === 1 ? 'bg-purple-100 text-purple-600' : 
                    'bg-green-100 text-green-600'} 
                  mb-6`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the dedicated individuals who are working together to make a
              difference in communities around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Milestones and recognition that drive us to continue making a
              positive impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
              >
                <div className="flex items-start">
                  <achievement.icon className="w-8 h-8 text-primary-600 mt-1 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 mb-2">
                      {achievement.year}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default About; 