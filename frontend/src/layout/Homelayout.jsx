import React, { useState } from "react";
import AboutDropdown from "../components/Navbar/AboutDrop";
import Hero from "./home/hero";
import Content from './home/content' ;
import Footer from "./home/footer";
import { useNavigate } from "react-router-dom";

const Homelayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate();
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-[30px]">
      {/* ===== NAVBAR ===== */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white ">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-4">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>

            <h1 className="text-xl sm:text-xl font-bold">Uber</h1>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-6">
              <button onClick={() => navigate("/rider/dashboard")}>Ride</button>
              <button onClick={() => navigate("/driver/register")}>
                     Drive with Uber
                      </button>
              <button>Business</button>
              <AboutDropdown />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block">EN</button>
            <button className="hidden sm:block">Help</button>
            <button className="bg-black text-white px-4 py-2 rounded-full">
              pd
            </button>
          </div>

        </div>
      </div>

      {/* ===== MOBILE SIDEBAR ===== */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <div className="bg-white w-64 p-6 space-y-6 shadow-xl">
            <button onClick={() => setMenuOpen(false)}>❌ Close</button>

            <button className="block" onClick={() => navigate("/rider/dashboard")}>Ride</button>
            <button className="block" onClick={() => navigate("/driver/register")}>Drive</button>
            <button className="block">Business</button>
            <button className="block">About</button>
            <button className="block">Help</button>
          </div>

          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* ===== PAGE CONTENT ===== */}
      <div className="  ">

        {/* HERO */}
        <div className="flex flex-col items-center justify-center text-center px-4 pt-90">
          <h1 className="text-3xl sm:text-5xl font-bold mb-8">
            Get ready for your first trip
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl">
            <input
              className="flex-1 p-4 rounded-lg border bg-gray-200"
              placeholder="Pickup location" 
              
            />
            <input
              className="flex-1 p-4 rounded-lg border bg-gray-200"
              placeholder="Dropoff location"
            />
            <button 
              className="bg-black text-white px-6 py-4 rounded-lg"
              onClick={() => navigate("/rider/dashboard")}
            >
              See prices
              

            </button>
          </div>
        </div>
      </div>


        <Content/>
        {/* NEXT SECTIONS */}
        <Hero />
        </div>
      <div className="bg-black ">
        <Footer/>
    </div>
    </div>
  );
};

export default Homelayout;
