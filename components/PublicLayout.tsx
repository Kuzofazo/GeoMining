import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-dvh bg-white flex flex-col font-sans text-slate-900 relative overflow-x-hidden w-full max-w-full">
      <Header />
      <main className="flex-grow overflow-x-hidden w-full max-w-full">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default PublicLayout;
