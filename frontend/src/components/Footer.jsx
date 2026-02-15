import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <h3 className="text-white text-xl font-black">SkillSwap</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Learn new skills, teach what you know. Join the global community of skill exchange.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-sky-500 hover:bg-sky-400 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-pink-600 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/skills" className="hover:text-white hover:translate-x-1 inline-block transition-all">Browse Skills</Link></li>
              <li><Link to="/dashboard" className="hover:text-white hover:translate-x-1 inline-block transition-all">Dashboard</Link></li>
              <li><Link to="/sessions" className="hover:text-white hover:translate-x-1 inline-block transition-all">Sessions</Link></li>
              <li><Link to="/forum" className="hover:text-white hover:translate-x-1 inline-block transition-all">Community Forum</Link></li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link to="/badges" className="hover:text-white hover:translate-x-1 inline-block transition-all">Badges</Link></li>
              <li><Link to="/certificates" className="hover:text-white hover:translate-x-1 inline-block transition-all">Certificates</Link></li>
              <li><Link to="/reviews" className="hover:text-white hover:translate-x-1 inline-block transition-all">Reviews</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:support@skillswap.com" className="hover:text-white transition-colors">support@skillswap.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-red-400 mt-1" />
                <span>123 Skill Street, Learning City, ED 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 flex items-center gap-1">
            © 2026 SkillSwap. Made with <Heart size={14} className="text-red-500 fill-current" /> All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
