import React from 'react';
import { Link } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';
import { PiEnvelope, PiMapPin, PiPhone } from 'react-icons/pi';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* ─── Main Footer ─── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <LuBrain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">NeuroScan</span>
                <span className="text-lg font-light text-primary-400 ml-0.5">AI</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Enterprise-grade brain tumor detection platform powered by YOLOv8 deep learning.
              Built for hospitals, research labs, and diagnostic centers.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <PiEnvelope className="w-4 h-4 text-gray-500" />
                <span>contact@neuroscan.ai</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <PiPhone className="w-4 h-4 text-gray-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <PiMapPin className="w-4 h-4 text-gray-500" />
                <span>Boston, MA 02108</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link to="/features" className="text-sm hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Research Papers</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">HIPAA Compliance</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Data Security</a></li>
            </ul>
          </div>

          {/* Sign In */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Access</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Request Demo</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} NeuroScan AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with YOLOv8 &middot; React &middot; TypeScript &middot; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
