import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from '../../../components/Navbar/Nav';
import { 
  ArrowLeft, 
  Car, 
  Compass, 
  CreditCard, 
  ShieldCheck, 
  User, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Zap 
} from 'lucide-react';

const HelpPage = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const [openFaq, setOpenFaq] = useState(null);

    const handleBack = () => {
        if (!user) {
            navigate('/home');
        } else if (user.role === 'DRIVER') {
            navigate('/driver/dashboard');
        } else {
            navigate('/rider/dashboard');
        }
    };

    const faqs = [
        {
            q: "How do I book a ride on Uber?",
            a: "Enter your pickup address and destination on the Rider Dashboard. Select your preferred vehicle type (Car, Auto, Bike) and click 'Request Ride'. You will be automatically matched with the nearest available driver."
        },
        {
            q: "How does Driver Acceptance work?",
            a: "When you book a ride, your request is dispatched to active online drivers in your city. Once a driver accepts, you will immediately see their name, vehicle model, plate number, and rating, and your status updates to ACCEPTED."
        },
        {
            q: "What payment methods are accepted?",
            a: "We support Cash on delivery as well as instant QR code payments upon trip completion. At the end of the ride, the driver or rider can scan/confirm payment."
        },
        {
            q: "How do I become a Driver Partner?",
            a: "Click on 'Drive' or 'Become a Driver' in the top navbar or profile menu. Complete your driver profile details including city, RC number, and license information to start accepting trips."
        },
        {
            q: "Can I track my ride in real-time?",
            a: "Yes! Once matched, the Active Ride Tracker page provides a real-time Leaflet map with road routes, live distance estimates, and ETA calculations."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            <Nav />

            {/* Page Header */}
            <div className="pt-24 pb-12 px-4 sm:px-8 max-w-6xl mx-auto border-b border-zinc-900">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2.5 rounded-full transition-all cursor-pointer mb-6 border border-zinc-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to {user ? (user.role === 'DRIVER' ? 'Driver Dashboard' : 'Rider Dashboard') : 'Home'}</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-block text-xs font-black tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
                            Help & Support Center
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase text-white">
                            How Can We Help You?
                        </h1>
                        <p className="text-zinc-400 font-medium text-sm sm:text-base mt-2 max-w-xl">
                            Find step-by-step guides for booking trips, driver duties, ride statuses, and payment confirmations.
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl max-w-md">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                            💬
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-white">24/7 Mobility Support</h4>
                            <p className="text-xs text-zinc-400">Need help during an active trip? Track status or contact your assigned driver directly from the active ride screen.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="py-12 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
                
                {/* 1. Booking a Ride */}
                <section className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                            🚗
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">1. Booking a Ride</h2>
                            <p className="text-xs text-zinc-400 font-medium">Simple steps to request your vehicle</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Step 1</span>
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-400" /> Pickup Location
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Enter your current address or select your starting location on the map.
                            </p>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Step 2</span>
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                <Compass className="w-4 h-4 text-emerald-400" /> Destination
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Type in your dropoff location to generate the real-road route and fare estimate.
                            </p>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Step 3</span>
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                <Car className="w-4 h-4 text-emerald-400" /> Vehicle Choice
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Select from Uber Go (Car), Uber Moto (Bike), or Uber Auto according to your preference.
                            </p>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Step 4</span>
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-400" /> Confirm & Book
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Click 'Request Ride' to send your request instantly to active nearby drivers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Ride Status Lifecycle */}
                <section className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 text-black rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                            📡
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">2. Ride Status Progress</h2>
                            <p className="text-xs text-zinc-400 font-medium">Understand the 4-step ride lifecycle</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                            <div className="w-2 h-full bg-amber-500 absolute left-0 top-0"></div>
                            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-amber-400">1. REQUESTED</h4>
                            <p className="text-xs text-zinc-300 font-semibold">Searching for Nearest Driver</p>
                            <p className="text-[11px] text-zinc-400">Your ride is broadcast to online drivers in your area.</p>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                            <div className="w-2 h-full bg-emerald-500 absolute left-0 top-0"></div>
                            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-emerald-400">2. ACCEPTED</h4>
                            <p className="text-xs text-zinc-300 font-semibold">Driver Accepted Ride</p>
                            <p className="text-[11px] text-zinc-400">Driver details (Name, Vehicle Model, Plate Number) appear automatically.</p>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                            <div className="w-2 h-full bg-blue-500 absolute left-0 top-0"></div>
                            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-blue-400">3. ON THE WAY</h4>
                            <p className="text-xs text-zinc-300 font-semibold">Ride in Progress</p>
                            <p className="text-[11px] text-zinc-400">Driver starts the trip and navigates along the road route to destination.</p>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                            <div className="w-2 h-full bg-purple-500 absolute left-0 top-0"></div>
                            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-purple-400">4. COMPLETED</h4>
                            <p className="text-xs text-zinc-300 font-semibold">Trip Completion & Payment</p>
                            <p className="text-[11px] text-zinc-400">Fare summary displayed; complete payment via cash or QR scanner.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Payment & Driver Help */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Payment Info */}
                    <section className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-900 text-emerald-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-zinc-800">
                                💳
                            </div>
                            <div>
                                <h2 className="text-xl font-black italic tracking-tight uppercase text-white">3. Payment Information</h2>
                                <p className="text-xs text-zinc-400 font-medium">Transparent fares & easy confirmation</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-xs text-zinc-300 pt-2">
                            <li className="flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Estimated Fares:</strong> Computed based on base pricing and distance in kilometers before booking.</span>
                            </li>
                            <li className="flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Payment Confirmation:</strong> Driver completes the trip and presents the payment summary screen.</span>
                            </li>
                            <li className="flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>QR Payment Support:</strong> Scan the trip QR code or confirm cash payment to finish duty.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Driver Help */}
                    <section className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-900 text-blue-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-zinc-800">
                                🚘
                            </div>
                            <div>
                                <h2 className="text-xl font-black italic tracking-tight uppercase text-white">4. Driver Partner Guide</h2>
                                <p className="text-xs text-zinc-400 font-medium">Accepting requests & fulfilling trips</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-xs text-zinc-300 pt-2">
                            <li className="flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <span><strong>Duty Toggle:</strong> Turn duty Online on the Driver Dashboard to receive incoming ride requests.</span>
                            </li>
                            <li className="flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <span><strong>Accept Trip:</strong> Click 'ACCEPT RIDE' on an incoming trip card to accept the rider's request.</span>
                            </li>
                            <li className="flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <span><strong>Start & Complete:</strong> Click '🚀 START TRIP' upon pickup, then '🏁 COMPLETE TRIP' at dropoff.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* 5. Account & FAQ Section */}
                <section className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-900 text-amber-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-zinc-800">
                                ❓
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">5. Frequently Asked Questions</h2>
                                <p className="text-xs text-zinc-400 font-medium">Quick answers to common questions</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        {faqs.map((faq, idx) => (
                            <div 
                                key={idx} 
                                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white hover:text-emerald-400 transition-colors cursor-pointer"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-emerald-400' : 'text-zinc-500'}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3 animate-in fade-in duration-200">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpPage;
