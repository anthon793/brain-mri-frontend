import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineExclamationCircle, HiOutlineArrowLeft, HiOutlineArrowPath } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
              <LuBrain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">NeuroScan AI</h1>
              <p className="text-white/60 text-sm">Diagnostic Intelligence Platform</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white/90 mb-4 max-w-md">
            AI-Powered Brain Tumor Detection for Clinical Excellence
          </h2>
          <p className="text-white/50 leading-relaxed max-w-md">
            Secure, HIPAA-compliant platform for brain MRI analysis. Access real-time tumor
            detection, evaluation metrics, and comprehensive reporting tools.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {[
              'YOLOv8 detection with 91.8% mAP@50',
              'Role-based access control (RBAC)',
              'Real-time inference under 2 seconds',
              'Exportable diagnostic reports',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} NeuroScan AI — Research & Diagnostic Use Only
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <LuBrain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">NeuroScan</span>
              <span className="text-xl font-light text-primary-500 ml-1">AI</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to access the diagnostic platform.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl animate-slide-up">
              <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="doctor@neuroscan.ai"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary-500/25"
            >
              {isLoading ? (
                <>
                  <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {[
                { role: 'Super Admin', email: 'admin@neuroscan.ai', pass: 'admin123' },
                { role: 'Radiologist', email: 'radiologist@neuroscan.ai', pass: 'radio123' },
                { role: 'Researcher', email: 'researcher@neuroscan.ai', pass: 'research123' },
              ].map((cred, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.pass);
                    setError('');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-left group"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{cred.role}</p>
                    <p className="text-[11px] text-gray-400">{cred.email}</p>
                  </div>
                  <span className="text-[10px] font-medium text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Use →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
