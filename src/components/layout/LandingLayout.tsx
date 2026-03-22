import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
