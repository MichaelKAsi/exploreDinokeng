import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-emerald-50 border-t border-emerald-200 py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <Link
          to="/admin/login"
          className="text-emerald-700 hover:text-emerald-900 font-semibold transition"
        >
          Admin Portal
        </Link>
      </div>
    </footer>
  );
}
