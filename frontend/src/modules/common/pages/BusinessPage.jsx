import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../auth/AuthSlice";
import {
  ChevronDown,
  Gift,
  Sprout,
  Star,
  ClipboardCheck,
  ArrowLeft,
  User,
  Settings,
  LogOut,
  LogIn
} from "lucide-react";

const BusinessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const goToHome = () => {
    navigate("/");
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSignUp = () => {
    if (!user) {
      navigate("/signup");
    } else if (user.role === "DRIVER") {
      navigate("/driver/dashboard");
    } else {
      navigate("/rider/dashboard");
    }
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-black selection:text-white">

      {/* ================= DEDICATED BUSINESS NAVBAR ONLY ================= */}
      <nav className="sticky top-0 z-50 flex h-[76px] items-center justify-between bg-black px-6 text-white md:px-8 lg:px-20 border-b border-zinc-800">

        {/* Logo & Back */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors py-1 px-2.5 rounded-md hover:bg-zinc-800 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div
            onClick={goToHome}
            className="text-[22px] sm:text-[26px] font-semibold leading-[22px] sm:leading-[25px] tracking-tight cursor-pointer hover:opacity-90 transition-opacity"
          >
            Uber
            <br />
            for Business
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 xl:flex">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-1.5 text-[15px] font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            Overview
            <ChevronDown size={16} />
          </button>

          <button
            onClick={() => scrollToSection("solutions")}
            className="flex items-center gap-1.5 text-[15px] font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            Solutions
            <ChevronDown size={16} />
          </button>

          <button
            onClick={() => scrollToSection("benefits")}
            className="text-[15px] font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>

          <button
            onClick={() => scrollToSection("use-cases")}
            className="flex items-center gap-1.5 text-[15px] font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            Customer support
            <ChevronDown size={16} />
          </button>

          <button
            onClick={() => scrollToSection("resources")}
            className="flex items-center gap-1.5 text-[15px] font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            Resources
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleSignUp}
            className="hidden sm:inline-block text-[15px] font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            Contact us
          </button>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#eeeeee] text-base sm:text-lg font-bold text-black hover:bg-white transition-colors cursor-pointer shadow-sm border-2 border-transparent hover:border-zinc-300"
              aria-label="User Profile Menu"
            >
              {user
                ? user.fullName
                  ? user.fullName.substring(0, 2).toUpperCase()
                  : user.name
                  ? user.name.substring(0, 2).toUpperCase()
                  : "UB"
                : "PD"}
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-zinc-950 text-white rounded-2xl p-4 shadow-2xl border border-zinc-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {user ? (
                  <>
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                      <div className="w-11 h-11 bg-zinc-900 rounded-full flex items-center justify-center font-black text-lg text-white border border-zinc-700 shadow-inner">
                        {user.fullName
                          ? user.fullName.substring(0, 2).toUpperCase()
                          : user.name
                          ? user.name.substring(0, 2).toUpperCase()
                          : "UB"}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-sm text-white truncate">
                          {user.fullName || user.name || "User Profile"}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate">
                          {user.email || "No email registered"}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {user.role === "DRIVER"
                            ? "🚗 Driver Partner"
                            : "👤 Rider Account"}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="py-2 border-b border-zinc-800 space-y-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate(
                            user.role === "DRIVER"
                              ? "/driver/dashboard"
                              : "/rider/dashboard"
                          );
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl transition-colors text-xs font-semibold text-zinc-300 flex items-center gap-3 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate(
                            user.role === "DRIVER"
                              ? "/driver/dashboard"
                              : "/rider/dashboard"
                          );
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl transition-colors text-xs font-semibold text-zinc-300 flex items-center gap-3 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        <span>Account Settings</span>
                      </button>
                    </div>

                    {/* Logout Option */}
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                      <div className="w-11 h-11 bg-zinc-900 rounded-full flex items-center justify-center font-black text-lg text-white border border-zinc-700">
                        PD
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-sm text-white">
                          Guest User
                        </h4>
                        <p className="text-xs text-zinc-400">Not logged in</p>
                      </div>
                    </div>

                    {/* Guest Options */}
                    <div className="pt-3 space-y-2">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate("/login");
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-2.5 rounded-xl text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Log In</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate("/signup");
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white border border-zinc-800 font-semibold py-2.5 rounded-xl text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <span>Sign Up</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="bg-black px-6 py-16 text-white md:px-8 lg:px-20 lg:py-28">
        <div className="mx-auto grid max-w-[1600px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left */}
          <div>
            <h1 className="max-w-[650px] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">
              Welcome, {user?.fullName ? user.fullName.split(' ')[0].toLowerCase() : 'pd'}.
              <br />
              Let's get set up.
            </h1>

            <p className="mt-8 sm:mt-10 max-w-[620px] text-lg leading-relaxed text-[#d6d6d6] md:text-2xl">
              You're only a few steps away from setting up your company's Uber
              for Business account. With a single platform, you can create
              programs to meet all your employees' or customers' travel, meal,
              and gifting needs.
            </p>

            <button
              onClick={handleSignUp}
              className="mt-8 sm:mt-10 rounded-lg bg-white px-8 py-4 text-base sm:text-lg font-medium text-black transition hover:bg-[#e6e6e6] cursor-pointer shadow-lg active:scale-95"
            >
              Sign up your company
            </button>
          </div>

          {/* Right Image */}
          <div className="flex min-h-[300px] sm:min-h-[350px] items-center justify-center bg-[#151515] rounded-2xl overflow-hidden border border-zinc-800 p-4">
            <img
              src="/business_hero.png"
              alt="Uber for Business Hero"
              className="max-h-[420px] w-full object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= COMPANY NEEDS ================= */}
      <section id="solutions" className="bg-black px-6 pb-20 text-white md:px-8 lg:px-20 lg:pb-24">
        <div className="mx-auto max-w-[1600px]">

          <h2 className="mb-10 sm:mb-14 text-3xl font-semibold sm:text-4xl md:text-5xl">
            What fits your company's needs?
          </h2>

          <div className="grid gap-10 lg:grid-cols-3">

            {/* Card 1 */}
            <div className="flex flex-col">
              <div className="mb-7 h-[280px] sm:h-[350px] w-full bg-[#1c1c1c] rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                <img
                  src="/employee_programs.webp"
                  alt="Employee programs"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-semibold">
                Employee programs
              </h3>

              <p className="mt-4 max-w-[450px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Our travel and meal solutions offer cost control, spending
                visibility, and integration with top expense providers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col">
              <div className="mb-7 h-[280px] sm:h-[350px] w-full bg-[#1c1c1c] rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                <img
                  src="/rides_for_others.webp"
                  alt="Rides for others"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-semibold">
                Rides for others
              </h3>

              <p className="mt-4 max-w-[450px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Central helps control costs and improve operational efficiency
                without sacrificing customer experience.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col">
              <div className="mb-7 h-[280px] sm:h-[350px] w-full bg-[#1c1c1c] rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                <img
                  src="/flexible_gifts.webp"
                  alt="Flexible gift solutions"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-semibold">
                Flexible gift solutions
              </h3>

              <p className="mt-4 max-w-[450px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Send vouchers and gift cards for rides and meals—a perfect
                solution for events or gestures of appreciation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section id="benefits" className="bg-black px-6 py-20 text-white md:px-8 lg:px-20 lg:py-24 border-t border-zinc-900">
        <div className="mx-auto max-w-[1600px]">

          <h2 className="max-w-[850px] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            A global platform built on the world's
            <br className="hidden sm:inline" />
            largest mobility network
          </h2>

          <div className="mt-16 sm:mt-20 grid gap-x-16 gap-y-16 md:grid-cols-2 lg:gap-x-24">

            <div>
              <Gift size={48} className="mb-6 text-white" />

              <h3 className="text-xl sm:text-2xl font-semibold">
                Reduce costs by up to 10% by improving compliance
              </h3>

              <p className="mt-4 max-w-[700px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Our customers agreed they reduced costs on ground transportation
                and meals. Monitor spending and usage and get controls to
                enforce policies.
              </p>
            </div>

            <div>
              <Sprout size={48} className="mb-6 text-white" />

              <h3 className="text-xl sm:text-2xl font-semibold">
                Meet sustainability goals with actionable insights
              </h3>

              <p className="mt-4 max-w-[700px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Track CO₂ emissions for every ride on a dashboard exclusive to
                Uber for Business and make smarter sustainability decisions.
              </p>
            </div>

            <div>
              <Star size={48} className="mb-6 text-white" />

              <h3 className="text-xl sm:text-2xl font-semibold">
                Provide an exclusive experience for your teams
              </h3>

              <p className="mt-4 max-w-[700px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Employees in select cities get access to premium ride options
                designed to provide a better travel experience.
              </p>
            </div>

            <div>
              <ClipboardCheck size={48} className="mb-6 text-white" />

              <h3 className="text-xl sm:text-2xl font-semibold">
                Prioritize safety and security for your business
              </h3>

              <p className="mt-4 max-w-[700px] text-base sm:text-lg leading-relaxed text-[#d0d0d0]">
                Get additional safety tools and insights to help your business
                manage transportation programs with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEVERAGE SECTION ================= */}
      <section id="use-cases" className="bg-[#f5f5f5] px-6 py-20 md:px-8 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-[1100px]">

          <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
            How companies leverage Uber for Business
          </h2>

          <div className="mt-14 sm:mt-16 grid gap-10 sm:gap-12 md:grid-cols-3">

            {/* Item 1: Business travel */}
            <div className="text-center flex flex-col items-center">
              <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-zinc-200 text-black overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/business_travel.webp"
                  alt="Business travel"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Business travel
              </h3>
            </div>

            {/* Item 2: Courtesy rides */}
            <div className="text-center flex flex-col items-center">
              <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-zinc-200 text-black overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/courtesy_rides.webp"
                  alt="Courtesy rides"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Courtesy rides
              </h3>
            </div>

            {/* Item 3: Meal programs */}
            <div className="text-center flex flex-col items-center">
              <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-zinc-200 text-black overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/meal_programs.webp"
                  alt="Meal programs"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Meal programs
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GET STARTED ================= */}
      <section id="get-started" className="bg-[#f5f5f5] px-6 pb-20 md:px-8 lg:px-20 lg:pb-24 border-t border-zinc-200">
        <div className="mx-auto max-w-[1100px]">

          <h2 className="pt-16 text-3xl font-semibold sm:text-4xl md:text-5xl">
            Get started with no upfront costs
          </h2>

          <div className="mt-14 sm:mt-16 space-y-12">

            {/* Timeline Item 1 */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-[320px_1fr]">
              <div className="h-[180px] sm:h-[200px] bg-zinc-200 rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src="/employee_programs.webp"
                  alt="Program setup"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="border-l-2 border-zinc-300 pl-6 sm:pl-10 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                  Customize your travel and meal programs
                </h3>

                <p className="mt-3 text-base sm:text-lg leading-relaxed text-zinc-700">
                  Set your own policies, help ensure compliance, and get full
                  visibility into every ride and meal.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-[320px_1fr]">
              <div className="h-[180px] sm:h-[200px] bg-zinc-200 rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src="/onboarding.png"
                  alt="Onboarding"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="border-l-2 border-zinc-300 pl-6 sm:pl-10 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                  Onboard people at your own pace
                </h3>

                <p className="mt-3 text-base sm:text-lg leading-relaxed text-zinc-700">
                  Add individuals, specific teams, or your entire organization
                  and manage everything from one central platform.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-[320px_1fr]">
              <div className="h-[180px] sm:h-[200px] bg-zinc-200 rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src="/amenities.jpeg"
                  alt="Amenities"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="border-l-2 border-zinc-300 pl-6 sm:pl-10 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                  Set up amenities for customers
                </h3>

                <p className="mt-3 text-base sm:text-lg leading-relaxed text-zinc-700">
                  Send ride credits, gift cards, and vouchers to create a better
                  experience for your customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPANY LOGOS ================= */}
      <section className="bg-[#f5f5f5] px-6 py-20 md:px-8 lg:px-20 lg:py-24 border-t border-zinc-200">
        <div className="mx-auto max-w-[1100px] text-center">

          <h2 className="mx-auto max-w-[800px] text-2xl sm:text-3xl md:text-4xl font-semibold">
            Join over 170,000 companies working with us,
            <br className="hidden sm:inline" />
            including more than half of the Fortune 500
          </h2>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 items-center gap-10 sm:gap-12 md:grid-cols-3">
            <div className="text-4xl sm:text-5xl font-bold text-[#377dcc] tracking-tight">
              zoom
            </div>

            <div className="text-4xl sm:text-5xl font-bold text-red-600 tracking-tight">
              Coca-Cola
            </div>

            <div className="text-3xl sm:text-4xl font-bold tracking-widest text-[#1d3d7a]">
              SAMSUNG
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#193765] px-6 py-16 text-center text-white md:px-8 lg:px-20 lg:py-20">

        <h2 className="mx-auto max-w-[800px] text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight">
          9 out of 10 customers recommend choosing
          <br className="hidden sm:inline" />
          Uber for Business
        </h2>

        <button
          onClick={handleSignUp}
          className="mt-8 sm:mt-10 rounded-md bg-white px-8 py-4 text-base sm:text-lg font-medium text-black transition hover:bg-gray-200 cursor-pointer shadow-md active:scale-95"
        >
          How to get started
        </button>
      </section>

      {/* ================= LEARN MORE / RESOURCES ================= */}
      <section id="resources" className="bg-[#f5f5f5] px-6 py-20 md:px-8 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-[1100px]">

          <h2 className="text-3xl sm:text-4xl font-semibold">
            Interested in learning more?
          </h2>

          <div className="mt-10 sm:mt-12 grid gap-8 md:grid-cols-3">

            <div>
              <div className="h-[240px] sm:h-[280px] bg-zinc-200 rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src="/see.png"
                  alt="Carbon Footprint"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-5 text-lg sm:text-xl font-medium text-black">
                How to reduce the carbon footprint of your business
              </h3>
            </div>

            <div>
              <div className="h-[240px] sm:h-[280px] bg-zinc-200 rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src="/see1.png"
                  alt="Perks & Benefits"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-5 text-lg sm:text-xl font-medium text-black">
                The perks and benefits your employees want now
              </h3>
            </div>

            <div>
              <div className="h-[240px] sm:h-[280px] bg-zinc-200 rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
                <img
                  src="/see2.webp"
                  alt="Sustainability"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-5 text-lg sm:text-xl font-medium text-black">
                The road to sustainability: executives discuss their efforts
              </h3>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BusinessPage;
