import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const RiderLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Rider Header */}
      <header className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <h1 
              className="text-2xl font-bold cursor-pointer"
              onClick={() => navigate('/home')}
            >
              Uber
            </h1>
            
            <nav className="hidden md:flex gap-6 font-medium">
              <button 
                className="hover:bg-gray-100 px-3 py-2 rounded-full transition"
                onClick={() => navigate('/rider/dashboard')}
              >
                Ride
              </button>
              <button className="hover:bg-gray-100 px-3 py-2 rounded-full transition">
                Drive
              </button>
              <button className="hover:bg-gray-100 px-3 py-2 rounded-full transition">
                Help
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <button className="hidden sm:block font-medium">EN</button>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
               <span className="font-semibold text-gray-700">PR</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Push content down below fixed header */}
      <div className="pt-20">
         <Outlet />
      </div>
    </div>
  );
};

export default RiderLayout;
