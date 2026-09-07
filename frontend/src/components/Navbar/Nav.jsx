import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../modules/auth/AuthSlice';
import { ChevronDown, Menu, X, HelpCircle, Briefcase, Info, LogOut, ExternalLink, Home, User, Car, Navigation, ArrowLeft } from 'lucide-react';

export const UberLogo = () => (
    <svg width="64" height="24" viewBox="0 0 75 24" fill="currentColor">
        <path d="M12.4 3.7c-3.1 0-5.4 2.2-5.4 5.3s2.3 5.3 5.4 5.3c3.1 0 5.4-2.2 5.4-5.3s-2.3-5.3-5.4-5.3zm0 8.2c-1.7 0-2.8-1.2-2.8-2.9s1.1-2.9 2.8-2.9s2.8 1.2 2.8 2.9c.1 1.7-1.1 2.9-2.8 2.9zm6.6-8v10.3h2.6v-1.1c.7.9 1.9 1.4 3.1 1.4c2.6 0 4.6-2 4.6-5.3s-2-5.3-4.6-5.3c-1.2 0-2.4.5-3.1 1.4V3.9h-2.6zm5.1 8.2c-1.5 0-2.6-1.1-2.6-2.9s1.1-2.9 2.6-2.9s2.6 1.1 2.6 2.9s-1.1 2.9-2.6 2.9zm13.1-8.2c-2.8 0-4.8 1.7-5.1 4.1h10.3c-.2-2.4-2.2-4.1-5.2-4.1zm5.2 5.9H32.1c.3 1.5 1.5 2.5 3.1 2.5c1.2 0 2.2-.5 2.8-1.4l2.1 1c-1.1 1.7-3 2.7-5 2.7c-3.3 0-5.7-2.3-5.7-5.4s2.4-5.4 5.7-5.4s5.6 2.3 5.6 5.4c0 .3 0 .5-.1.6zm4.8-5.6v10.3h2.6V9.1c0-1.5 1-2.6 2.4-2.6s.6 0 .9.1V3.9c-.3-.1-.6-.1-.9-.1c-1.6 0-2.9.8-3.6 2.1l-.1-.2-.1-.2-.1-.2-.1-.2H47.4z" />
    </svg>
);

const ABOUT_DETAILS = {
    "About us": {
        title: "About Uber",
        subtitle: "Powering opportunity by changing how the world moves",
        icon: "🏢",
        content: "Uber is a technology platform that connects riders with drivers, eaters with restaurants, and shippers with freight carriers. Founded with a vision to make transportation as reliable as running water, we continue to innovate urban mobility worldwide."
    },
    "Our offerings": {
        title: "Our Mobility Solutions",
        subtitle: "Solutions for every journey and lifestyle",
        icon: "🚗",
        content: "Explore Uber's ecosystem: UberX for affordable daily rides, Uber Black for luxury travel, Uber XL for groups, Uber Eats for food delivery, and Uber Connect for quick package delivery."
    },
    "How Uber works": {
        title: "How Uber Works",
        subtitle: "Seamless rides in 4 easy steps",
        icon: "⚡",
        content: "1. Request: Enter your destination and choose a vehicle.\n2. Match: Pair instantly with a nearby driver.\n3. Track: Monitor your driver's arrival live on the map.\n4. Pay & Rate: Enjoy automatic payments and rate your experience."
    },
    "Sustainability": {
        title: "Sustainability & Green Future",
        subtitle: "Zero emissions mobility by 2040",
        icon: "🌱",
        content: "Uber is committed to becoming a zero-emission mobility platform. We support drivers transitioning to electric vehicles and offer eco-friendly ride options like Uber Green."
    },
    "Newsroom": {
        title: "Uber Newsroom",
        subtitle: "Latest announcements, updates & stories",
        icon: "📰",
        content: "Stay up to date with product releases, safety feature innovations, community partnerships, global expansions, and official announcements."
    },
    "Investor relations": {
        title: "Investor Relations",
        subtitle: "Financial results & disclosures",
        icon: "📈",
        content: "Access financial data, quarterly earnings reports, SEC filings, investor presentations, and corporate governance updates."
    },
    "Autonomous": {
        title: "Autonomous Future",
        subtitle: "Self-driving technology & innovation",
        icon: "🤖",
        content: "Uber partners with leading autonomous vehicle creators to build the next era of safe, efficient, and self-driving transportation."
    },
    "Blog": {
        title: "Uber Blog",
        subtitle: "Insights & engineering breakthroughs",
        icon: "✍️",
        content: "Read articles from our engineering team, driver success stories, safety tips, and technological breakthroughs."
    },
    "Careers": {
        title: "Careers at Uber",
        subtitle: "Build the future of movement with us",
        icon: "💼",
        content: "Join our worldwide team! Discover career opportunities across engineering, product management, design, operations, and leadership."
    }
};

const Nav = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authUser = useSelector(state => state.auth?.user);
    const driverObj = useSelector(state => state.driver?.driver);
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    const isDriverRoute = typeof window !== 'undefined' && window.location.pathname.includes('/driver');

    // Resolve user from auth slice or fallback to populated driver profile or token fallback
    const user = authUser || 
        (typeof driverObj?.userId === 'object' ? driverObj.userId : null) || 
        (driverObj?.personalInfo ? { name: driverObj.personalInfo.fullName, email: driverObj.personalInfo.email, role: 'DRIVER' } : null) ||
        (token ? {
            name: isDriverRoute ? 'Driver Partner' : 'Account Profile',
            email: 'Logged In User',
            role: isDriverRoute ? 'DRIVER' : 'RIDER'
        } : null);

    const [aboutOpen, setAboutOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [selectedAboutTopic, setSelectedAboutTopic] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const aboutRef = useRef(null);
    const profileRef = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (aboutRef.current && !aboutRef.current.contains(e.target)) {
                setAboutOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleAction = (type) => {
        setMobileMenuOpen(false);
        setProfileOpen(false);
        if (user) {
            if (type === 'Ride') {
                navigate(user.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard');
            } else if (type === 'Drive') {
                navigate(user.role === 'DRIVER' ? '/driver/dashboard' : '/driver/register');
            }
        } else {
            if (type === 'Ride') {
                navigate('/login', { state: { from: { pathname: '/rider/dashboard' } } });
            } else if (type === 'Drive') {
                navigate('/login', { state: { from: { pathname: '/driver/dashboard' } } });
            } else {
                navigate('/login');
            }
        }
    };

    const handleBack = () => {
        setProfileOpen(false);
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/home');
        }
    };

    const handleDashboardNavigation = () => {
        setProfileOpen(false);
        if (user?.role === 'DRIVER') {
            navigate('/driver/dashboard');
        } else {
            navigate('/rider/dashboard');
        }
    };

    const handleLogout = () => {
        setMobileMenuOpen(false);
        setProfileOpen(false);
        dispatch(logout());
        localStorage.removeItem("token");
        navigate('/login');
    };

    const handleAboutClick = (itemKey) => {
        setAboutOpen(false);
        setSelectedAboutTopic(itemKey);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[9999] bg-black text-white px-4 md:px-14 h-[64px] flex items-center justify-between border-b border-zinc-900 select-none">
                <div className="flex items-center gap-8">
                    {/* Brand Logo */}
                    <div className="cursor-pointer hover:opacity-80 transition-opacity flex items-center" onClick={() => navigate('/home')}>
                        <UberLogo />
                    </div>

                    {/* Desktop Menu Items */}
                    <div className="hidden md:flex items-center gap-2 font-medium text-[15px]">
                        <button
                            onClick={() => handleAction('Ride')}
                            className="hover:bg-[#333333] px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
                        >
                            Ride
                        </button>
                        <button
                            onClick={() => handleAction('Drive')}
                            className="hover:bg-[#333333] px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
                        >
                            Drive
                        </button>
                        <button
                            onClick={() => navigate('/business')}
                            className="hover:bg-[#333333] px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
                        >
                            Business
                        </button>

                        {/* Interactive About Dropdown */}
                        <div className="relative" ref={aboutRef}>
                            <button
                                onClick={() => setAboutOpen(!aboutOpen)}
                                className="hover:bg-[#333333] px-4 py-2 rounded-full transition-colors font-medium flex items-center gap-1 cursor-pointer"
                            >
                                About
                                <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {aboutOpen && (
                                <div className="absolute top-12 left-0 bg-white text-black shadow-2xl rounded-xl w-64 py-3 z-[99999] animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100">
                                    {Object.keys(ABOUT_DETAILS).map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => handleAboutClick(item)}
                                            className="px-6 py-2.5 hover:bg-gray-100 cursor-pointer font-medium text-[14px] text-gray-800 transition-colors flex items-center gap-2.5"
                                        >
                                            <span className="text-base">{ABOUT_DETAILS[item].icon}</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center gap-2 font-medium text-[15px]">
                    <button onClick={() => navigate('/help')} className="hidden sm:block hover:bg-[#333333] px-4 py-2 rounded-full transition-colors cursor-pointer">Help</button>

                    {user ? (
                        <div className="relative" ref={profileRef}>
                            {/* Role / Profile Button */}
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer border border-zinc-800 text-sm font-semibold shadow-sm"
                            >
                                <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-xs text-white border border-zinc-700">
                                    {(user.name || user.fullName) ? (user.name || user.fullName)[0].toUpperCase() : 'U'}
                                </div>
                                <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-bold text-zinc-200">
                                    {user.name || user.fullName || (user.role === 'DRIVER' ? 'Driver' : 'Rider')}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded-full border border-zinc-700">
                                    {user.role === 'DRIVER' ? 'Driver' : 'Rider'}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {profileOpen && (
                                <div className="absolute top-full mt-2 right-0 bg-zinc-950 text-white shadow-2xl rounded-2xl w-72 p-4 z-[99999] border border-zinc-800">
                                    {/* User Avatar & Info */}
                                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                                        <div className="w-11 h-11 bg-zinc-900 rounded-full flex items-center justify-center font-black text-lg text-white border border-zinc-700 shadow-inner">
                                            {(user.name || user.fullName) ? (user.name || user.fullName)[0].toUpperCase() : 'U'}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-sm text-white truncate">{user.name || user.fullName || 'User Profile'}</h4>
                                            <p className="text-xs text-zinc-400 truncate">{user.email || 'No email registered'}</p>
                                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                                {user.role === 'DRIVER' ? '🚗 Driver Partner' : '👤 Rider Account'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="py-2 border-b border-zinc-800 space-y-1">
                                        {/* 1. Back Option */}
                                        <button
                                            onClick={handleBack}
                                            className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl transition-colors text-xs font-semibold text-zinc-300 flex items-center gap-2.5 cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4 text-zinc-400" />
                                            <span>← Back</span>
                                        </button>

                                        {/* 2. Dashboard Option */}
                                        <button
                                            onClick={handleDashboardNavigation}
                                            className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl transition-colors text-xs font-semibold text-zinc-300 flex items-center justify-between cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {user.role === 'DRIVER' ? (
                                                    <Car className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <User className="w-4 h-4 text-emerald-400" />
                                                )}
                                                <span>{user.role === 'DRIVER' ? 'Driver Dashboard' : 'Rider Dashboard'}</span>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                                        </button>
                                    </div>

                                    {/* 3. Logout Option */}
                                    <div className="pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/login')} className="hover:bg-[#333333] px-4 py-2 rounded-full transition-colors cursor-pointer">Log in</button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-white text-black px-4 py-2 ml-1 rounded-full font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                            >
                                Sign up
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-[#333333] rounded-full transition-colors cursor-pointer"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* About Modal Dialog */}
            {selectedAboutTopic && ABOUT_DETAILS[selectedAboutTopic] && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedAboutTopic(null)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{ABOUT_DETAILS[selectedAboutTopic].icon}</span>
                            <div>
                                <h3 className="text-xl font-bold text-white">{ABOUT_DETAILS[selectedAboutTopic].title}</h3>
                                <p className="text-xs text-zinc-400 font-medium">{ABOUT_DETAILS[selectedAboutTopic].subtitle}</p>
                            </div>
                        </div>
                        <div className="my-4 pt-3 border-t border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                            {ABOUT_DETAILS[selectedAboutTopic].content}
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setSelectedAboutTopic(null)}
                                className="bg-white text-black font-semibold px-5 py-2 rounded-xl text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Drawer/Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-[64px] z-40 bg-black/95 text-white flex flex-col md:hidden animate-in fade-in duration-300 select-none">
                    <div className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
                        {user && (
                            <div className="pb-6 border-b border-zinc-800 flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-sm">
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{user.name || 'User'}</h4>
                                    <p className="text-xs text-zinc-400 font-medium">{user.email || ''} • Logged in as {user.role?.toLowerCase()}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleAction('Ride')}
                                className="w-full text-left py-3 px-4 hover:bg-zinc-900 rounded-xl transition-colors font-semibold text-lg flex items-center gap-3 cursor-pointer"
                            >
                                <span className="text-xl">🚗</span> Ride
                            </button>
                            <button
                                onClick={() => handleAction('Drive')}
                                className="w-full text-left py-3 px-4 hover:bg-zinc-900 rounded-xl transition-colors font-semibold text-lg flex items-center gap-3 cursor-pointer"
                            >
                                <span className="text-xl">🚕</span> Drive
                            </button>
                            <button
                                onClick={() => { setMobileMenuOpen(false); navigate('/business'); }}
                                className="w-full text-left py-3 px-4 hover:bg-zinc-900 rounded-xl transition-colors font-semibold text-lg flex items-center gap-3 cursor-pointer"
                            >
                                <Briefcase className="w-5 h-5 opacity-70" /> Business
                            </button>
                        </div>
                    </div>

                    <div className="p-6 border-t border-zinc-800 space-y-4 bg-zinc-950">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition-all text-center cursor-pointer"
                            >
                                Log out
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                                    className="flex-1 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 py-4 rounded-xl font-bold transition-colors text-center cursor-pointer"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                                    className="flex-1 bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-bold transition-colors text-center cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </div>
                        )}
                        <div className="flex justify-end items-center text-xs text-zinc-500 pt-2 font-medium">
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/help'); }} className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"><HelpCircle className="w-3.5 h-3.5" /> Help Center</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Nav;