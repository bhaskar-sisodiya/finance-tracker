import React from "react";
import { Link } from "@tanstack/react-router";

const Footer = () => {
  const underlineBase = "absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4caf50] transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100";
  const footerLinkClass = "group relative inline-block text-gray-500 hover:text-[#4caf50] text-sm transition-all duration-300 pb-0.5";

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/images/logo.svg" alt="Pocket Tracker" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Empowering your financial journey with precision tracking and intelligent insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/manage" className={footerLinkClass}>Manage Expenses <span className={underlineBase} /></Link></li>
              <li><Link to="/stats" className={footerLinkClass}>Analytics <span className={underlineBase} /></Link></li>
              <li><Link to="/about" className={footerLinkClass}>About Us <span className={underlineBase} /></Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="https://github.com/bhaskar-sisodiya/finance-tracker/" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>GitHub <span className={underlineBase} /></a></li>
              <li><a href="https://mail.google.com/mail/?view=cm&to=sisodiyabhaskar@gmail.com" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Contact Support <span className={underlineBase} /></a></li>
              <li><Link to="#" className={footerLinkClass}>Privacy Policy <span className={underlineBase} /></Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-gray-500 text-sm mb-4">Join our newsletter for financial tips.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#4caf50]/20 transition-all font-medium"
              />
              <button className="bg-[#4caf50] text-white p-2 rounded-xl hover:bg-[#388e3c] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pocket Tracker. Designed by Bhaskar Sisodiya.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-300 text-xs">Built with precision & ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
