import React, { useState, useRef, useEffect } from "react";

const AboutDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // click outside close
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* ABOUT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="hover:text-black text-gray-700"
      >
        About ▾
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-10 left-0 bg-white shadow-xl rounded-xl w-64 py-3 z-50">
          {[
            "About us",
            "Our offerings",
            "How Uber works",
            "Sustainability",
            "Newsroom",
            "Investor relations",
            "Autonomous",
            "Blog",
            "Careers",
          ].map((item) => (
            <div
              key={item}
              className="px-6 py-3 hover:bg-gray-100 cursor-pointer text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutDropdown;
