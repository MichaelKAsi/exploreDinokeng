import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-serif text-lg mb-4">About</h3>
            <p className="text-sm leading-relaxed">
              Create beautiful banner experiences with our admin dashboard.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Admin
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="hover:text-white transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex items-center justify-between text-sm">
          <p>
            Copyright © 2024. Made with{' '}
            <Heart className="w-4 h-4 inline text-red-500" />
          </p>
          <ul className="flex gap-6">
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
