import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

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
      { icon: FiFacebook, label: 'Facebook', href: 'https://facebook.com' },
      { icon: FiTwitter, label: 'Twitter', href: 'https://twitter.com' },
      { icon: FiInstagram, label: 'Instagram', href: 'https://instagram.com' },
      { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
    ],
  };

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CSR Initiative
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Making a positive impact in communities through sustainable
              development and responsible business practices.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} CSR Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 