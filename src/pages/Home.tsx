import React from 'react';
import { Link } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineChartBar,
  HiOutlineArrowUpTray,
  HiOutlineCpuChip,
  HiOutlineDocumentCheck,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineBeaker,
  HiOutlineSignal,
} from 'react-icons/hi2';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <LuBrain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">NeuroScan</span>
              <span className="text-lg font-light text-primary-500 ml-1">AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors">
              About
            </a>
            <Link
              to="/login"
              className="bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
            >
              Sign In
            </Link>
          </div>
          <Link
            to="/login"
            className="md:hidden bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent-100 text-primary-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <HiOutlineSignal className="w-4 h-4" />
              Powered by YOLOv8 Deep Learning
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Brain MRI{' '}
              <span className="text-primary-500 relative">
                Tumor Detection
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path
                    d="M2 10C50 2 100 2 150 6C200 10 250 4 298 8"
                    stroke="#0F4C81"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </span>{' '}
              System
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Advanced AI-powered diagnostic platform for automated brain tumor detection and
              classification. Leveraging state-of-the-art YOLOv8 architecture to assist
              radiologists with real-time, high-accuracy MRI analysis.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Access Platform
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-7 py-3.5 rounded-xl text-base font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-gray-100">
              <div>
                <p className="text-3xl font-bold text-primary-500">91.8%</p>
                <p className="text-sm text-gray-500 mt-1">Model Accuracy (mAP@50)</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-500">&lt;2s</p>
                <p className="text-sm text-gray-500 mt-1">Detection Speed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-500">3</p>
                <p className="text-sm text-gray-500 mt-1">Tumor Classes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-500">5,000+</p>
                <p className="text-sm text-gray-500 mt-1">Training Images</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block absolute right-0 top-8 w-[420px] h-[420px]">
            <div className="relative w-full h-full">
              {/* Brain scan visual */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-500/10 rounded-3xl border border-primary-500/20 overflow-hidden">
                <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="relative">
                    <LuBrain className="w-32 h-32 text-primary-500/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-green-400 rounded-lg animate-pulse flex items-center justify-center">
                        <span className="text-green-400 text-xs font-mono font-bold">94.6%</span>
                      </div>
                    </div>
                  </div>
                  {/* Scan line effect */}
                  <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 animate-scan-line" />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -left-6 top-12 bg-white rounded-xl shadow-elevated px-4 py-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Tumor Detected</p>
                    <p className="text-[10px] text-gray-500">Glioma — Left Temporal</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-20 bg-white rounded-xl shadow-elevated px-4 py-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <HiOutlineChartBar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Confidence</p>
                    <p className="text-[10px] text-gray-500">94.6% — High</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Diagnostic AI
            </h2>
            <p className="text-gray-600 text-lg">
              Built for clinical environments with security, accuracy, and regulatory compliance in
              mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HiOutlineBolt,
                title: 'Real-Time Detection',
                desc: 'YOLOv8-powered inference delivers tumor detection results in under 2 seconds per scan.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: HiOutlineShieldCheck,
                title: 'Role-Based Security',
                desc: 'Fine-grained access control with Super Admin, Radiologist, and Researcher roles.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: HiOutlineBeaker,
                title: 'Multi-Class Classification',
                desc: 'Accurately classifies Glioma, Meningioma, and Pituitary tumors from MRI scans.',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: HiOutlineChartBar,
                title: 'Comprehensive Analytics',
                desc: 'Detailed evaluation metrics, precision-recall curves, and exportable reports.',
                color: 'bg-blue-50 text-blue-600',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">
              From MRI upload to diagnostic report — a streamlined four-step workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: HiOutlineArrowUpTray,
                title: 'Upload MRI Scan',
                desc: 'Securely upload brain MRI images via drag-and-drop or file selection.',
              },
              {
                step: '02',
                icon: HiOutlineCpuChip,
                title: 'AI Processing',
                desc: 'YOLOv8 model analyzes the scan for tumor detection and classification.',
              },
              {
                step: '03',
                icon: HiOutlineDocumentCheck,
                title: 'Review Results',
                desc: 'View annotated images with bounding boxes, confidence scores, and classifications.',
              },
              {
                step: '04',
                icon: HiOutlineChartBar,
                title: 'Generate Report',
                desc: 'Export detailed diagnostic reports in PDF format for clinical records.',
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-500/30 to-primary-500/10" />
                )}
                <div className="relative inline-block mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 border-2 border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300 mx-auto">
                    <step.icon className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Disclaimer ─────────────────────────────────── */}
      <section className="py-6 px-6 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto flex items-start gap-4">
          <HiOutlineExclamationTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              NeuroScan AI is a computer-aided diagnostic tool intended to assist qualified medical
              professionals. It does not replace clinical judgment. All detections must be reviewed
              and confirmed by a licensed radiologist before clinical decision-making. This system
              is for research and assistive purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────── */}
      <footer id="about" className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                  <LuBrain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">NeuroScan</span>
                  <span className="text-lg font-light text-primary-400 ml-1">AI</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Enterprise-grade brain tumor detection platform powered by YOLOv8 deep learning.
                Built for hospitals, research labs, and diagnostic centers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/login" className="text-sm hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">&copy; {new Date().getFullYear()} NeuroScan AI. All rights reserved.</p>
            <p className="text-xs">
              Built with YOLOv8 • React • TypeScript • Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
