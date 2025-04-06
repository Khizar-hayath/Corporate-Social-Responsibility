import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';

function Footer() {
  const footerLinks = {
    company: [
      { path: '/about', label: 'About Us' },
      { path: '/projects', label: 'Projects' },
      { path: '/news', label: 'News' },
      { path: '/contact', label: 'Contact' },
    ],
    support: [
      { path: '/get-involved', label: 'Get Involved' },
      { path: '/contact', label: 'Contact Us' },
      { path: '/faq', label: 'FAQ' },
      { path: '/privacy', label: 'Privacy Policy' },
    ],
    social: [
      { icon: FiFacebook, label: 'Facebook', href: 'https://facebook.com', color: 'bg-blue-600' },
      { icon: FiTwitter, label: 'Twitter', href: 'https://twitter.com', color: 'bg-blue-400' },
      { icon: FiInstagram, label: 'Instagram', href: 'https://instagram.com', color: 'bg-pink-600' },
      { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'bg-blue-700' },
    ],
  };

  const contactInfo = [
    { icon: FiMail, text: 'contact@csrinitiative.org' },
    { icon: FiPhone, text: '+1 (555) 123-4567' },
  ];

  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-blue-800 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-12 left-12 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              CSR Initiative
            </h3>
            <p className="text-gray-200 mb-6">
              Making a positive impact in communities through sustainable
              development and responsible business practices.
            </p>
            
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-200">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-200 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-200 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} text-white p-3 rounded-full hover:opacity-90 transition-opacity`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            <div className="mt-6">
              <Link 
                to="/theme" 
                className="px-5 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors inline-block"
              >
                View Design System
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-center text-white/80">
            © {new Date().getFullYear()} CSR Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 