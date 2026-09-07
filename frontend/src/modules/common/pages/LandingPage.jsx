import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, ChevronDown, Clock, Globe, ArrowRight, Calendar, Navigation, ShieldCheck } from 'lucide-react';
import Nav, { UberLogo } from '../../../components/Navbar/Nav';
import { searchLocations } from '../../journey/mapService';

const LandingPage = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    
    // Location Search States
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
    const [showPickupDropdown, setShowPickupDropdown] = useState(false);
    const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);

    // Click outside handler for location dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickupRef.current && !pickupRef.current.contains(e.target)) {
                setShowPickupDropdown(false);
            }
            if (dropoffRef.current && !dropoffRef.current.contains(e.target)) {
                setShowDropoffDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 1. Live Autocomplete for Pickup Location
    useEffect(() => {
        if (!pickup || pickup.trim().length < 2) {
            setPickupSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            const results = await searchLocations(pickup);
            setPickupSuggestions(results);
        }, 300);
        return () => clearTimeout(timer);
    }, [pickup]);

    // 2. Live Autocomplete for Dropoff Location
    useEffect(() => {
        if (!destination || destination.trim().length < 2) {
            setDropoffSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            const results = await searchLocations(destination);
            setDropoffSuggestions(results);
        }, 300);
        return () => clearTimeout(timer);
    }, [destination]);

    // Handle Current Location Detection
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setPickup("My Current Location");
                setPickupCoords([lat, lon]);
                setShowPickupDropdown(false);
                setIsLocating(false);
            },
            (err) => {
                console.error("GPS location error:", err);
                setIsLocating(false);
                alert("Unable to fetch your current location. Please type manually.");
            }
        );
    };

    // Handle "See Prices" Button Click -> Navigates to Ride/Driver Dashboard
    const handleSeePrices = () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/rider/dashboard' } } });
            return;
        }
        if (user.role === 'DRIVER') {
            navigate('/driver/dashboard');
            return;
        }
        const finalPickup = pickup.trim() || 'Connaught Place, Delhi';
        const finalDrop = destination.trim() || 'Noida Sector 62';
        const finalPickupCoords = pickupCoords || [28.6139, 77.2090];
        const finalDropoffCoords = dropoffCoords || [28.6280, 77.3649];

        navigate('/rider/dashboard', {
            state: {
                pickup: finalPickup,
                destination: finalDrop,
                pickupCoords: finalPickupCoords,
                dropoffCoords: finalDropoffCoords
            }
        });
    };

    // Suggestion Cards Data
    const suggestions = [
        { title: "Ride", text: "Go anywhere with Uber. Request a ride, hop in, and go.", img: "/top_bar_rides_3d.png", tag: "Most Popular" },
        { title: "Reserve", text: "Reserve your ride in advance so you can relax on the day of your trip.", img: "/reserve_clock.png", tag: "Scheduled" },
        { title: "Intercity", text: "Get convenient, affordable outstation cabs anytime at your door.", img: "/5969324.png", tag: "Outstation" },
        { title: "Package", text: "Uber makes same-day item delivery easier than ever.", img: "/imger.png", tag: "Fast Express" },
        { title: "Rentals", text: "Request a trip for a block of time and make multiple stops.", img: "/pt3.webp", tag: "Flexible" },
        { title: "Bike", text: "Get affordable motorbike rides in minutes at your doorstep.", img: "/unnamed.png", tag: "Pocket Friendly" }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
            <Nav />

            {/* Main Content Area */}
            <main className="pt-[64px]">
                {/* Hero Section */}
                <section className="px-4 py-12 md:px-14 md:py-20 max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-[580px]">
                        <div className="inline-flex items-center gap-2 font-semibold bg-zinc-100 border border-zinc-200 px-3.5 py-1.5 rounded-full text-xs text-zinc-800 mb-6 shadow-sm">
                            <MapPin className="w-3.5 h-3.5 fill-black text-white" />
                            <span>Bhopal & Nationwide Availability</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1"></span>
                        </div>
                        
                        <h1 className="text-[48px] sm:text-[58px] md:text-[66px] font-extrabold leading-[1.08] tracking-tight mb-6 text-black">
                            Go anywhere with <span className="underline decoration-4 decoration-zinc-300">Uber</span>
                        </h1>

                        <p className="text-zinc-600 text-lg mb-8 font-medium leading-relaxed">
                            Request a ride, check real-time fare estimates, and reach your destination with verified drivers nationwide.
                        </p>

                        {/* Pickup Time selector pill */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <button className="flex items-center gap-2 bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-all py-3 px-5 rounded-full font-semibold text-sm border border-zinc-200 cursor-pointer">
                                <Clock className="w-4 h-4 text-black" />
                                Pickup now
                                <ChevronDown className="w-4 h-4 text-zinc-600" />
                            </button>
                            <button 
                                onClick={handleUseCurrentLocation}
                                disabled={isLocating}
                                className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-black transition-all py-3 px-5 rounded-full font-semibold text-sm cursor-pointer shadow-sm disabled:opacity-50"
                            >
                                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                                {isLocating ? "Locating..." : "Use Current Location"}
                            </button>
                        </div>

                        {/* Location Inputs with Live Suggestions */}
                        <div className="space-y-4 mb-8 relative bg-zinc-50/90 p-5 rounded-2xl border border-zinc-200/80 shadow-md">
                            {/* Vertical Line Connecting Dots */}
                            <div className="absolute left-[33px] top-[48px] bottom-[48px] w-[2px] bg-zinc-900 z-0"></div>
                            
                            {/* Pickup Input Container */}
                            <div className="relative z-20" ref={pickupRef}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-zinc-900 z-10 shadow-sm"></div>
                                <input 
                                    value={pickup}
                                    onChange={(e) => {
                                        setPickup(e.target.value);
                                        setShowPickupDropdown(true);
                                    }}
                                    onFocus={() => setShowPickupDropdown(true)}
                                    className="w-full bg-white hover:bg-zinc-100/80 focus:bg-white outline-none pl-11 pr-10 py-4 rounded-xl font-medium text-[16px] placeholder:text-zinc-500 border border-zinc-200 focus:border-black transition-all shadow-sm"
                                    placeholder="Pickup location"
                                />
                                {pickup && (
                                    <button 
                                        onClick={() => setPickup('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black font-bold text-xs p-1 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Pickup Suggestions Dropdown */}
                                {showPickupDropdown && pickupSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 z-50 max-h-64 overflow-y-auto divide-y divide-zinc-100 animate-in fade-in slide-in-from-top-2 duration-150">
                                        {pickupSuggestions.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => {
                                                    setPickup(item.displayName);
                                                    setPickupCoords([item.lat, item.lon]);
                                                    setShowPickupDropdown(false);
                                                }}
                                                className="p-3.5 hover:bg-zinc-50 cursor-pointer flex items-center gap-3 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm flex-shrink-0">
                                                    📍
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-sm text-black truncate leading-snug">{item.displayName}</p>
                                                    {item.city && <p className="text-xs text-zinc-400 font-medium truncate">{item.city}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Dropoff Input Container */}
                            <div className="relative z-10" ref={dropoffRef}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-zinc-900 z-10 shadow-sm"></div>
                                <input 
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value);
                                        setShowDropoffDropdown(true);
                                    }}
                                    onFocus={() => setShowDropoffDropdown(true)}
                                    className="w-full bg-white hover:bg-zinc-100/80 focus:bg-white outline-none pl-11 pr-10 py-4 rounded-xl font-medium text-[16px] placeholder:text-zinc-500 border border-zinc-200 focus:border-black transition-all shadow-sm"
                                    placeholder="Dropoff location"
                                />
                                {destination && (
                                    <button 
                                        onClick={() => setDestination('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black font-bold text-xs p-1 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Dropoff Suggestions Dropdown */}
                                {showDropoffDropdown && dropoffSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 z-50 max-h-64 overflow-y-auto divide-y divide-zinc-100 animate-in fade-in slide-in-from-top-2 duration-150">
                                        {dropoffSuggestions.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => {
                                                    setDestination(item.displayName);
                                                    setDropoffCoords([item.lat, item.lon]);
                                                    setShowDropoffDropdown(false);
                                                }}
                                                className="p-3.5 hover:bg-zinc-50 cursor-pointer flex items-center gap-3 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm flex-shrink-0">
                                                    🏁
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-sm text-black truncate leading-snug">{item.displayName}</p>
                                                    {item.city && <p className="text-xs text-zinc-400 font-medium truncate">{item.city}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
                            <button 
                                onClick={handleSeePrices}
                                className="bg-black text-white font-bold text-[17px] px-8 py-4 rounded-xl hover:bg-zinc-800 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
                            >
                                <span>See prices</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login', { state: { from: { pathname: '/rider/dashboard' } } });
                                    } else {
                                        navigate(user.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard');
                                    }
                                }}
                                className="text-[15px] underline underline-offset-4 decoration-zinc-300 hover:decoration-black font-semibold text-zinc-700 hover:text-black py-2 cursor-pointer transition-colors text-center sm:text-left"
                            >
                                {user ? "View your ride history" : "Log in to see your recent activity"}
                            </button>
                        </div>
                    </div>

                    {/* Right Hero Card Graphic */}
                    <div className="relative hidden lg:block justify-self-end">
                        <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-zinc-100 group">
                            <img 
                                src="/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NjRkZDNkMS05NGU3LTQ4MWUtYjI4Yy0wOGQ1OTM1M2I5ZTAucG5n.png" 
                                alt="Uber Hero Illustration"
                                className="w-full max-w-[550px] aspect-square object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md rounded-[22px] p-6 text-white flex justify-between items-center shadow-xl border border-white/10">
                                 <div>
                                     <span className="font-bold text-xl block">Ready for your trip?</span>
                                     <span className="text-xs text-zinc-300 font-medium">Book now or schedule up to 90 days ahead</span>
                                 </div>
                                 <button 
                                    onClick={handleSeePrices}
                                    className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer text-sm"
                                 >
                                    Book Now
                                 </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Book Your Trip On Phone or Computer Section */}
                <section className="px-4 py-16 md:px-14 max-w-[1440px] mx-auto border-t border-zinc-100">
                    <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-12 text-black">
                        Book your trip on your phone or computer
                    </h2>

                    <div className="space-y-12 max-w-[1000px]">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                            {/* Left Image */}
                            <div className="w-full md:w-[320px] h-[190px] bg-zinc-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 border border-zinc-200/60">
                                <img 
                                    src="/pt1.webp" 
                                    alt="1. Add your trip details" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.parentElement) {
                                            e.target.parentElement.innerText = 'Step 1 Image (/pt1.webp)';
                                            e.target.parentElement.className = 'w-full md:w-[320px] h-[190px] bg-zinc-100 rounded-2xl border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 font-semibold text-sm flex-shrink-0';
                                        }
                                    }}
                                />
                            </div>

                            {/* Timeline Bar & Square Node */}
                            <div className="hidden md:flex flex-col items-center self-stretch relative py-2">
                                <div className="w-3 h-3 bg-black rounded-xs z-10 my-auto shadow-xs"></div>
                                <div className="absolute top-0 bottom-0 w-[2px] bg-black/80"></div>
                            </div>

                            {/* Right Content */}
                            <div className="max-w-[480px]">
                                <h3 className="text-xl font-bold text-black mb-2">1. Add your trip details</h3>
                                <p className="text-zinc-600 text-[15px] leading-relaxed font-medium">
                                    Enter your pickup spot and destination, and check prices for your trip.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                            {/* Left Image */}
                            <div className="w-full md:w-[320px] h-[190px] bg-zinc-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 border border-zinc-200/60">
                                <img 
                                    src="/pt2.webp" 
                                    alt="2. Pay easily" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.parentElement) {
                                            e.target.parentElement.innerText = 'Step 2 Image (/pt2.webp)';
                                            e.target.parentElement.className = 'w-full md:w-[320px] h-[190px] bg-zinc-100 rounded-2xl border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 font-semibold text-sm flex-shrink-0';
                                        }
                                    }}
                                />
                            </div>

                            {/* Timeline Bar & Square Node */}
                            <div className="hidden md:flex flex-col items-center self-stretch relative py-2">
                                <div className="w-3 h-3 bg-black rounded-xs z-10 my-auto shadow-xs"></div>
                                <div className="absolute top-0 bottom-0 w-[2px] bg-black/80"></div>
                            </div>

                            {/* Right Content */}
                            <div className="max-w-[480px]">
                                <h3 className="text-xl font-bold text-black mb-2">2. Pay easily</h3>
                                <p className="text-zinc-600 text-[15px] leading-relaxed font-medium">
                                    Add your preferred payment method, then choose among the ride options available in your location.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                            {/* Left Image */}
                            <div className="w-full md:w-[320px] h-[190px] bg-zinc-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 border border-zinc-200/60">
                                <img 
                                    src="/pt3.webp" 
                                    alt="3. Meet your driver" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.parentElement) {
                                            e.target.parentElement.innerText = 'Step 3 Image (/pt3.webp)';
                                            e.target.parentElement.className = 'w-full md:w-[320px] h-[190px] bg-zinc-100 rounded-2xl border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 font-semibold text-sm flex-shrink-0';
                                        }
                                    }}
                                />
                            </div>

                            {/* Timeline Bar & Square Node */}
                            <div className="hidden md:flex flex-col items-center self-stretch relative py-2">
                                <div className="w-3 h-3 bg-black rounded-xs z-10 mt-6 shadow-xs"></div>
                                <div className="absolute top-0 h-1/2 w-[2px] bg-black/80"></div>
                            </div>

                            {/* Right Content */}
                            <div className="max-w-[480px]">
                                <h3 className="text-xl font-bold text-black mb-2">3. Meet your driver</h3>
                                <p className="text-zinc-600 text-[15px] leading-relaxed font-medium mb-4">
                                    Uber will match you with a driver nearby, and you'll get updates on your phone or computer about when to meet them.
                                </p>
                                <button 
                                    onClick={handleSeePrices}
                                    className="font-semibold text-black underline underline-offset-4 decoration-black hover:opacity-75 transition-opacity cursor-pointer text-[15px]"
                                >
                                    Book your first ride
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Suggestions Section */}
                <section className="px-4 py-16 md:px-14 max-w-[1440px] mx-auto border-t border-zinc-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-[32px] md:text-[42px] font-extrabold tracking-tight text-black">Suggestions</h2>
                            <p className="text-zinc-500 font-medium text-base">Explore all ways to ride, deliver, and travel with Uber</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestions.map((item, idx) => (
                            <div 
                                key={idx} 
                                onClick={handleSeePrices}
                                className="bg-[#f6f6f6] rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden group cursor-pointer hover:bg-zinc-200/80 transition-all border border-zinc-200/50 min-h-[170px] shadow-sm hover:shadow-md"
                            >
                                <div className="max-w-[200px] z-10">
                                    <span className="inline-block bg-white text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3 shadow-xs">
                                        {item.tag}
                                    </span>
                                    <h3 className="font-bold text-[20px] mb-1.5 text-black">{item.title}</h3>
                                    <p className="text-zinc-600 text-[13px] leading-relaxed mb-4">{item.text}</p>
                                    <button className="bg-white text-black font-bold text-[13px] px-4 py-2 rounded-full shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                                        Book {item.title}
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-2 w-[110px] sm:w-[135px] pointer-events-none">
                                    <img src={item.img} alt={item.title} className="w-full object-contain transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Account Details / Log in block */}
                {!user && (
                    <section className="px-4 py-16 md:px-14 max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 items-center border-t border-zinc-100">
                        <div className="max-w-[480px]">
                            <h2 className="text-[36px] md:text-[44px] font-extrabold leading-tight tracking-tight mb-4 text-black">
                                Log in to see your account details
                            </h2>
                            <p className="text-zinc-600 mb-8 text-[16px] leading-relaxed font-medium">
                                View past trips, tailored suggestions, support resources, and ride savings.
                            </p>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="bg-black text-white font-bold text-[16px] px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-center cursor-pointer"
                                >
                                    Log in to your account
                                </button>
                                <button 
                                    onClick={() => navigate('/signup')} 
                                    className="font-bold text-[16px] text-zinc-800 underline underline-offset-4 decoration-zinc-300 hover:decoration-black cursor-pointer text-center sm:text-left py-2"
                                >
                                    Create an account
                                </button>
                            </div>
                        </div>
                        <div>
                             <img 
                                src="/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xODM0ZTZmZC0zM2UzLTRjOTUtYWQ3YS1mNDg0YThjODEyZDcuanBn.jpg.jpeg" 
                                alt="Log in illustration" 
                                className="w-full rounded-[28px] bg-zinc-100 object-cover shadow-lg border border-zinc-100" 
                             />
                        </div>
                    </section>
                )}

                {/* Reserve Section */}
                <section className="px-4 py-16 md:px-14 max-w-[1440px] mx-auto border-t border-zinc-100">
                    <div className="bg-[#b3dce6] rounded-[28px] p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row justify-between lg:mr-[180px] shadow-sm">
                        <div className="max-w-[420px] z-10 relative">
                            <h2 className="text-[36px] md:text-[44px] font-black leading-tight tracking-tight mb-6 text-black">
                                Get your ride right with Uber Reserve
                            </h2>
                            <div className="font-bold text-[15px] mb-3 text-zinc-900">Choose date and time</div>
                            <div className="flex gap-4 mb-8">
                                <div className="flex-1 relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2"><Calendar className="w-5 h-5 text-black" /></div>
                                    <input type="text" placeholder="Today" className="w-full h-[56px] pl-12 bg-white rounded-xl outline-none font-semibold text-black focus:ring-2 ring-black shadow-sm" readOnly />
                                </div>
                                <div className="flex-1 relative">
                                     <div className="absolute left-4 top-1/2 -translate-y-1/2"><Clock className="w-5 h-5 text-black" /></div>
                                     <select className="w-full h-[56px] pl-12 pr-4 bg-white rounded-xl outline-none font-semibold text-black appearance-none focus:ring-2 ring-black shadow-sm cursor-pointer">
                                         <option>Now</option>
                                         <option>In 15 mins</option>
                                         <option>In 30 mins</option>
                                         <option>In 1 hour</option>
                                     </select>
                                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown className="w-5 h-5 text-zinc-600" /></div>
                                </div>
                            </div>
                            <button 
                                onClick={handleSeePrices}
                                className="bg-black text-white font-bold text-[16px] px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors shadow-lg cursor-pointer"
                            >
                                Reserve a Ride
                            </button>
                        </div>
                        
                        <div className="absolute top-0 right-0 bottom-0 w-2/3 h-full mix-blend-multiply opacity-90 pointer-events-none flex items-center justify-end pr-8">
                             <img src="/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9jNjQyNWRmNC0zMTkwLTRmZTEtODY2Ni02YTVhZjJjMGEwNDkucG5n.png" alt="Watch illustration" className="max-h-[85%] object-contain" />
                        </div>

                        {/* Benefits Panel (overlapping) */}
                        <div className="hidden lg:block absolute top-12 -right-[220px] w-[340px] bg-white rounded-2xl p-7 shadow-2xl z-20 border border-zinc-100">
                            <h3 className="font-bold text-xl mb-5 text-black">Benefits</h3>
                            <ul className="space-y-5 text-[14px] text-zinc-700 font-medium leading-relaxed">
                                <li className="flex gap-3.5 items-start">
                                    <Calendar className="w-5 h-5 mt-0.5 text-black flex-shrink-0" />
                                    <span>Choose your exact pickup time up to 90 days in advance.</span>
                                </li>
                                <li className="flex gap-3.5 items-start border-t border-zinc-100 pt-4">
                                    <Clock className="w-5 h-5 mt-0.5 text-black flex-shrink-0" />
                                    <span>Extra wait time included to meet your ride.</span>
                                </li>
                                <li className="flex gap-3.5 items-start border-t border-zinc-100 pt-4">
                                    <ShieldCheck className="w-5 h-5 mt-0.5 text-black flex-shrink-0" />
                                    <span>Cancel at no charge up to 60 minutes in advance.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Drive block */}
                <section className="px-4 py-16 md:px-14 max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 items-center border-t border-zinc-100">
                    <div className="order-2 lg:order-1">
                         <img 
                            src="/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy83NmJhZjFlYS0zODVhLTQwOGMtODQ2Yi01OTIxMTA4NjE5NmMucG5n.png" 
                            alt="Drive illustration" 
                            className="w-full rounded-[28px] bg-zinc-100 object-cover shadow-lg border border-zinc-100" 
                         />
                    </div>
                    <div className="max-w-[480px] order-1 lg:order-2">
                        <h2 className="text-[36px] md:text-[44px] font-extrabold leading-tight tracking-tight mb-4 text-black">
                            Drive when you want, make what you need
                        </h2>
                        <p className="text-zinc-600 mb-8 text-[16px] leading-relaxed font-medium">
                            Make money on your schedule with deliveries or rides—or both. You can use your own vehicle or choose a rental through Uber.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <button 
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login', { state: { from: { pathname: '/driver/dashboard' } } });
                                    } else if (user.role === 'DRIVER') {
                                        navigate('/driver/dashboard');
                                    } else {
                                        navigate('/driver/register');
                                    }
                                }}
                                className="bg-black text-white font-bold text-[16px] px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-center cursor-pointer"
                            >
                                Get started driving
                            </button>
                            <button 
                                onClick={() => navigate('/login', { state: { from: { pathname: '/driver/dashboard' } } })} 
                                className="font-bold text-[15px] text-zinc-800 underline underline-offset-4 decoration-zinc-300 hover:decoration-black cursor-pointer text-center sm:text-left py-2"
                            >
                                Already have an account? Sign in
                            </button>
                        </div>
                    </div>
                </section>

                {/* Detailed Footer */}
                <footer className="bg-black text-white mt-16 pt-16 pb-20 font-sans">
                    <div className="max-w-[1440px] mx-auto px-4 md:px-14">
                        <div className="mb-12">
                             <div className="cursor-pointer" onClick={() => navigate('/')}>
                                 <UberLogo />
                             </div>
                             <div onClick={() => navigate('/help')} className="mt-6 hover:underline text-base font-semibold cursor-pointer inline-block text-zinc-300 hover:text-white">Visit Help Center</div>
                        </div>
                        
                        {/* 4 Columns */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 cursor-pointer">
                            <div>
                                <h3 className="font-bold text-lg mb-5 text-white">Company</h3>
                                <ul className="space-y-3 text-[14px] text-zinc-400 font-medium">
                                    <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Our offerings</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-5 text-white">Products</h3>
                                <ul className="space-y-3 text-[14px] text-zinc-400 font-medium">
                                    <li><a href="#" className="hover:text-white transition-colors">Ride</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Drive</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Uber Eats</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Uber for Business</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Uber Freight</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-5 text-white">Global citizenship</h3>
                                <ul className="space-y-3 text-[14px] text-zinc-400 font-medium">
                                    <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-5 text-white">Travel</h3>
                                <ul className="space-y-3 text-[14px] text-zinc-400 font-medium">
                                    <li><a href="#" className="hover:text-white transition-colors">Reserve</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Airports</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Cities</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Footer Links */}
                        <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-zinc-500 pt-8 border-t border-zinc-900">
                            <p>© 2026 Uber Technologies Inc.</p>
                            <div className="flex gap-6 mt-4 md:mt-0 font-semibold">
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;
