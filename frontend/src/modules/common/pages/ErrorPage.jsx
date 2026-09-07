import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Nav from '../../../components/Navbar/Nav';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("Route Error Caught:", error);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white font-sans selection:bg-black selection:text-white">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-[100px]">
        <div className="max-w-md w-full bg-zinc-50 border border-zinc-200 p-8 rounded-[32px] shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto font-bold">
            ⚠️
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-black">
              Something went wrong
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              An unexpected error occurred while loading this page.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-left text-xs font-mono text-red-800 break-words overflow-auto max-h-32">
              {error.statusText || error.message || String(error)}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-black hover:bg-zinc-800 text-white font-black py-4 rounded-2xl text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              Go to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
