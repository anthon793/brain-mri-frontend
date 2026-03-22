# NeuroScan AI — Brain MRI Detection Platform

A modern web-based platform for AI-powered brain tumor detection from MRI scans, built with React, TypeScript, and Vite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## 📋 Features

- **Patient Management** — Complete patient records with biodata, medical history, and scan records
- **MRI Upload & Analysis** — Upload brain MRI scans for AI-powered tumor detection
- **Model Training** — Train and fine-tune YOLOv8 tumor detection models
- **Evaluation Metrics** — Comprehensive model evaluation with PR curves, loss history, and confusion matrices
- **Real-time Dashboard** — Monitor scanning activity, detections, and model performance
- **Role-Based Access** — Support for Super Admin, Radiologist, and Researcher roles
- **Responsive Design** — Mobile-friendly interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/anthon793/brain-mri-frontend.git
cd brain-mri-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API endpoint
```

### Development

```bash
# Start the dev server on http://localhost:5173
npm run dev

# The app will automatically open in your browser
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

## 📁 Project Structure

```
neuroscan-ai/
├── src/
│   ├── api/              # API client and services
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── services/     # Domain-specific API services
│   │   └── types.ts      # TypeScript interfaces for API
│   ├── components/       # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components (Navbar, Sidebar)
│   │   └── ui/           # Generic UI components (Modal, Cards)
│   ├── context/          # React context (Auth state)
│   ├── pages/            # Page components (routes)
│   │   └── dashboard/    # Dashboard sub-pages
│   ├── hooks/            # Custom React hooks
│   ├── types/            # Global TypeScript interfaces
│   ├── data/             # Mock data for development
│   ├── App.tsx           # Main app component with routing
│   └── main.tsx          # React entry point
├── public/               # Static assets
├── dist/                 # Production build output
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore patterns
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Optional: Other runtime configs
VITE_APP_TITLE=NeuroScan AI
```

See [.env.example](.env.example) for all available options.

### API Documentation

For detailed API endpoint documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router v6
- **HTTP Client**: Axios 1.13
- **Charts**: Recharts 2.13
- **Icons**: React Icons 5.6

### Key Patterns

- **Custom Hooks**: `useApi`, `useServices` for reusable logic
- **API Services**: Domain-specific services (authService, scanService, etc.)
- **Protected Routes**: Role-based access control with ProtectedRoute wrapper
- **Context API**: Global auth state management
- **Mock Fallback**: Graceful degradation to mock data when API unavailable

## 👥 User Roles

- **Super Admin**: Full platform access — patient management, model training, system settings
- **Radiologist**: MRI upload, scan review, patient management
- **Researcher**: Model evaluation, metrics analysis, report generation

## 📦 Dependencies

### Production
- `react`: UI library
- `react-dom`: DOM rendering
- `react-router-dom`: Client-side routing
- `axios`: HTTP client
- `recharts`: Chart visualizations
- `react-icons`: Icon library (Heroicons)
- `tailwindcss`: Utility-first CSS framework

### Development
- `typescript`: Type safety
- `vite`: Fast build tool
- `@vitejs/plugin-react`: React integration for Vite
- `tailwindcss`: CSS generation
- `autoprefixer`: CSS vendor prefixes

## 🚢 Deployment

### GitHub Pages

```bash
# Build the project
npm run build

# The 'dist' folder is ready for deployment
# Push to GitHub Pages or upload to any static host
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Connect your GitHub repo to Netlify
# It will auto-build and deploy on push to main
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

```bash
# Build and run
docker build -t neuroscan-ai .
docker run -p 5173:5173 neuroscan-ai
```

## 🔄 CI/CD

This project includes GitHub Actions workflows for:
- **Testing & Linting**: Run on every pull request
- **Build Verification**: Ensure production build succeeds
- **Automated Deployment**: Deploy to production on merge to main

See `.github/workflows/` for workflow definitions.

## 📝 Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push and create a pull request
git push origin feature/my-feature

# 4. After approval, merge to main
# (CI/CD will auto-deploy to production)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
- **Issues**: [GitHub Issues](https://github.com/yourusername/neuroscan-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/neuroscan-ai/discussions)
- **Email**: support@neuroscan-ai.example.com

## 🎯 Roadmap

- [ ] WebSocket support for real-time training updates
- [ ] Advanced filtering and export options
- [ ] Training job scheduling and queue management
- [ ] Multi-model ensemble predictions
- [ ] Patient outcome tracking and analytics
- [ ] Integration with DICOM servers
- [ ] Mobile app (React Native)

## 👨‍💻 Authors

- **Development Team** - NeuroScan AI Project

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- React and TypeScript communities
- Tailwind CSS team
- Recharts contributors
