import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShieldExclamation, HiOutlineArrowLeft, HiOutlineLockClosed } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/auth/RoleBadge';

const AccessDenied: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <HiOutlineShieldExclamation className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          You don't have the required permissions to access this resource. This area is restricted
          based on your assigned role.
        </p>

        {user && (
          <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-200 mb-8">
            <HiOutlineLockClosed className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Your role:</span>
            <RoleBadge role={user.role} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
