import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDriverProfile, updateDriverStatus } from '../DriverApi';
import { getAvailableJourneys, acceptJourney, updateJourneyStatus, getDriverHistory } from '../../journey/JourneyApi';
import { setDriver, setOnlineStatus } from '../DriverSlice';
import { setJourney } from '../../journey/JourneySlice';
import { MapContainer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import Nav from '../../../components/Navbar/Nav';
import { MapTileLayers, MapModeSwitcher, MAP_MODES } from '../../../components/MapViewControl';
import { getDrivingRoute } from '../../journey/mapService';

// Fix for default marker icons in Leaflet
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom Leaflet divIcons for Pickup (Blue Navigation Arrow) and Destination (Red Pin)
const pickupIcon = L.divIcon({
  className: "custom-pickup-marker",
  html: `
    <div style="
      width:40px;
      height:40px;
      border-radius:50%;
      background:#2563eb;
      border:3px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:22px;
      font-weight:bold;
    ">
      ➤
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const destinationIcon = L.divIcon({
  className: "custom-destination-marker",
  html: `
    <div style="
      width:40px;
      height:40px;
      border-radius:50%;
      background:#dc2626;
      border:3px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:20px;
    ">
      📍
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const ChangeView = ({ bounds, center }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length === 2 && bounds[0]?.[0] && bounds[1]?.[0]) {
            map.fitBounds(bounds, { padding: [60, 60] });
        } else if (center) {
            map.setView(center, 14);
        }
    }, [bounds, center, map]);
    return null;
};

const DriverDashboardPage = () => {
    const { driver, isOnline } = useSelector((state) => state.driver);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [availableRequests, setAvailableRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([28.5562, 77.1000]); // Default Delhi
    const [mapMode, setMapMode] = useState(MAP_MODES.HYBRID);
    const [acceptedTrip, setAcceptedTrip] = useState(null);
    const prevCountRef = useRef(0);
    const [dismissedRequests, setDismissedRequests] = useState([]);

    const [routePolyline, setRoutePolyline] = useState([]);
    const [distanceKm, setDistanceKm] = useState(0);
    const [durationMins, setDurationMins] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getDriverProfile();
                const profile = res.data.data;
                dispatch(setDriver(profile));
                dispatch(setOnlineStatus(true));
                try { await updateDriverStatus(true); } catch (e) {}
                
                // Geocode city to center map
                if (profile.personalInfo?.city) {
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${profile.personalInfo.city}`);
                    const geoData = await geoRes.json();
                    if (geoData?.[0]) {
                        setMapCenter([parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)]);
                    }
                }

                // Check for any ongoing active ride for driver
                try {
                    const activeRes = await getDriverHistory();
                    const journeys = activeRes.data?.data || [];
                    const active = journeys.find(j => j.status === 'ACCEPTED' || j.status === 'ON_THE_WAY');
                    if (active) {
                        setAcceptedTrip(active);
                        dispatch(setJourney(active));
                    }
                } catch (e) {}
            } catch (err) {
                if (err.response?.status === 404) navigate("/driver/register");
            }
        };
        fetchProfile();
    }, [dispatch, navigate]);

    // Play notification sound when a new trip request arrives
    const playChime = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) {
            console.log("Audio notification error", e);
        }
    };

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                const res = await getAvailableJourneys();
                const journeys = res.data?.data || [];
                setAvailableRequests(journeys);
                
                if (journeys.length > prevCountRef.current) {
                    playChime();
                }
                prevCountRef.current = journeys.length;
            } catch (err) { console.error("Polling journeys failed", err); }
        };

        fetchAvailable(); // Immediate fetch!
        const interval = setInterval(fetchAvailable, 1000); // 1s fast polling
        return () => clearInterval(interval);
    }, []);

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const nextOnlineState = !isOnline;
            await updateDriverStatus(nextOnlineState);
            dispatch(setOnlineStatus(nextOnlineState));
        } catch (err) {
            alert(err.response?.data?.message || "Status update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptJourney = async (journeyId) => {
        setLoading(true);
        try {
            const res = await acceptJourney(journeyId);
            const journeyData = res.data.data;
            dispatch(setJourney(journeyData));
            setAcceptedTrip(journeyData);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to accept ride.");
        } finally {
            setLoading(false);
        }
    };

    const handleStartTrip = async () => {
        if (!acceptedTrip) return;
        setLoading(true);
        try {
            const res = await updateJourneyStatus(acceptedTrip._id, 'ON_THE_WAY');
            setAcceptedTrip(prev => ({ ...prev, status: 'ON_THE_WAY' }));
            dispatch(setJourney(res.data.data));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to start trip.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTrip = async () => {
        if (!acceptedTrip) return;
        setLoading(true);
        try {
            const res = await updateJourneyStatus(acceptedTrip._id, 'COMPLETED');
            setAcceptedTrip(prev => ({ ...prev, status: 'COMPLETED' }));
            dispatch(setJourney(res.data.data));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to complete trip.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPaymentAndReturnDuty = () => {
        setAcceptedTrip(null);
        dispatch(setJourney(null));
    };

    const activeRequestsToDisplay = availableRequests.filter(r => !dismissedRequests.includes(r._id));
    const currentActiveTrip = acceptedTrip || activeRequestsToDisplay[0];

    const pickupPos = currentActiveTrip?.pickup?.location?.coordinates
        ? [currentActiveTrip.pickup.location.coordinates[1], currentActiveTrip.pickup.location.coordinates[0]]
        : null;
    const dropoffPos = currentActiveTrip?.dropoff?.location?.coordinates
        ? [currentActiveTrip.dropoff.location.coordinates[1], currentActiveTrip.dropoff.location.coordinates[0]]
        : null;

    // Determine current active step (1, 2, 3, or 4) for the 4-step progress indicator
    const getActiveStepNumber = () => {
        if (!isOnline) return 1;
        if (!acceptedTrip) return 1; // Step 1: Request
        switch (acceptedTrip.status) {
            case 'ACCEPTED':
                return 2; // Step 2: Start Trip
            case 'ON_THE_WAY':
                return 3; // Step 3: Complete Trip
            case 'COMPLETED':
                return 4; // Step 4: Payment
            default:
                return 1;
        }
    };

    const currentStepNum = getActiveStepNumber();
    const stepsList = [
        { id: 1, label: 'Request', icon: '📡' },
        { id: 2, label: 'Start Trip', icon: '🚀' },
        { id: 3, label: 'Complete Trip', icon: '🏁' },
        { id: 4, label: 'Payment', icon: '💳' },
    ];

    // Fetch OSRM Real Road Driving Route & Distance
    useEffect(() => {
        if (!pickupPos || !dropoffPos) {
            setRoutePolyline([]);
            setDistanceKm(0);
            setDurationMins(0);
            return;
        }
        const fetchRoute = async () => {
            const routeData = await getDrivingRoute(pickupPos, dropoffPos);
            if (routeData) {
                setDistanceKm(routeData.distanceKm);
                setDurationMins(routeData.durationMins);
                setRoutePolyline(routeData.polylineCoords);
            }
        };
        fetchRoute();
    }, [currentActiveTrip?._id]);

    return (
        <div className="h-screen w-full flex flex-col bg-white overflow-hidden font-sans selection:bg-black selection:text-white">
            <Nav />

            <div className="flex-1 flex overflow-hidden pt-[64px]">
                {/* Left Sidebar Container */}
                <div className="w-full md:w-[460px] bg-white h-full border-r border-zinc-100 flex flex-col z-10 shadow-2xl overflow-y-auto">
                    <div className="p-6 space-y-6">
                        
                        {/* 1. Driver Profile Info Card */}
                        <div className="bg-white p-5 rounded-[28px] border border-zinc-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl shadow-xl">🚕</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-black text-lg">{driver?.vehicleInfo?.vehicleModel || 'Registered Driver'}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        {driver?.personalInfo?.city || 'City'} • {driver?.vehicleInfo?.vehicleType || 'Vehicle'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Online / Offline Status Toggle */}
                        <div className={`p-6 rounded-[28px] shadow-lg border border-zinc-100 transition-all duration-500 ${isOnline ? 'bg-black text-white' : 'bg-zinc-50 text-black border-zinc-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Duty Status</p>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{isOnline ? 'Online' : 'Offline'}</h3>
                                </div>
                                <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></div>
                            </div>
                            <button 
                                disabled={loading}
                                onClick={toggleStatus}
                                className={`w-full py-3.5 rounded-xl font-bold transition-all transform active:scale-95 text-sm uppercase tracking-wider ${isOnline ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
                            >
                                {loading ? "..." : (isOnline ? "Exit Work" : "Start Receiving Trips")}
                            </button>
                        </div>

                        {/* 3. Visual 4-Step Progress Indicator */}
                        <div className="bg-zinc-900 text-white p-5 rounded-[28px] border border-zinc-800 shadow-xl space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ride Workflow</p>
                                <span className="text-[10px] font-black bg-zinc-800 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-zinc-700">
                                    Step {currentStepNum} of 4
                                </span>
                            </div>

                            {/* Horizontal Step Bar with Connecting Lines */}
                            <div className="relative pt-2 pb-1">
                                {/* Base Track */}
                                <div className="absolute top-[18px] left-4 right-4 h-1 bg-zinc-800 z-0"></div>
                                {/* Active Progress Line */}
                                <div 
                                    className="absolute top-[18px] left-4 h-1 bg-emerald-500 transition-all duration-500 z-0"
                                    style={{ width: `${((currentStepNum - 1) / 3) * 88}%` }}
                                ></div>

                                <div className="relative z-10 flex justify-between items-start">
                                    {stepsList.map((step) => {
                                        const isActive = currentStepNum === step.id;
                                        const isPassed = currentStepNum > step.id;
                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-1.5 w-16">
                                                <div 
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                                                        isActive 
                                                            ? 'bg-emerald-500 text-black scale-110 shadow-lg ring-4 ring-emerald-500/20' 
                                                            : isPassed 
                                                                ? 'bg-emerald-600 text-white' 
                                                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                                    }`}
                                                >
                                                    {isPassed ? '✓' : step.id}
                                                </div>
                                                <span className={`text-[10px] font-bold text-center leading-tight ${
                                                    isActive 
                                                        ? 'text-emerald-400 font-black' 
                                                        : isPassed 
                                                            ? 'text-zinc-200' 
                                                            : 'text-zinc-500'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 4. Ride Control Panel */}
                        {isOnline ? (
                            <div className="space-y-6">
                                {/* If Driver has an active or completed trip */}
                                {acceptedTrip ? (
                                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                        <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping"></div>
                                                <h3 className="text-xl font-black italic tracking-tighter uppercase text-black">
                                                    {acceptedTrip.status === 'ACCEPTED' && 'Step 2: Start Trip'}
                                                    {acceptedTrip.status === 'ON_THE_WAY' && 'Step 3: Trip In Progress'}
                                                    {acceptedTrip.status === 'COMPLETED' && 'Step 4: Payment Confirmation'}
                                                </h3>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/active-ride')}
                                                className="text-xs font-black underline underline-offset-4 text-zinc-500 hover:text-black uppercase tracking-wider"
                                            >
                                                Full Map View ↗
                                            </button>
                                        </div>

                                        {/* Trip Card for Steps 2, 3, 4 */}
                                        <div className="bg-zinc-900 text-white p-6 rounded-[28px] space-y-4 shadow-xl border border-zinc-800">
                                            
                                            {/* Step 4 Payment Header Badge */}
                                            {acceptedTrip.status === 'COMPLETED' && (
                                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-emerald-400">
                                                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                                        <span>🎉</span>
                                                        Trip Completed - Payment Summary
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded-md uppercase">Completed</span>
                                                </div>
                                            )}

                                            {/* Rider Info & Fare */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">👤</span>
                                                    <div>
                                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Rider Information</p>
                                                        <p className="text-xl font-black text-white">{acceptedTrip.rider?.name || 'Rider'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Fare Summary</p>
                                                    <p className="text-3xl font-black text-emerald-400 italic">₹{acceptedTrip.actualFare || acceptedTrip.estimatedFare}</p>
                                                </div>
                                            </div>

                                            {/* Pickup & Dropoff Address */}
                                            <div className="bg-zinc-800/80 p-4 rounded-2xl space-y-3 border border-zinc-700/50">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-emerald-400 font-bold">📍</span>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Pickup Location</p>
                                                        <p className="text-sm font-bold text-zinc-100">{acceptedTrip.pickup?.address}</p>
                                                    </div>
                                                </div>
                                                <div className="w-full h-px bg-zinc-700/50"></div>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-red-400 font-bold">🏁</span>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Destination</p>
                                                        <p className="text-sm font-bold text-zinc-100">{acceptedTrip.dropoff?.address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Step 4 Payment Details Section */}
                                            {acceptedTrip.status === 'COMPLETED' && (
                                                <div className="bg-zinc-800/90 p-4 rounded-2xl space-y-3 border border-zinc-700">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Payment Method</span>
                                                        <span className="text-sm font-black text-white uppercase bg-zinc-700 px-3 py-1 rounded-lg">
                                                            {acceptedTrip.paymentMethod || 'CASH / UPI'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-700/60">
                                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Payment Status</span>
                                                        <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                                                            {acceptedTrip.paymentStatus === 'PAID' ? '✅ Paid' : '💵 Collect Cash on Spot'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Primary Action Buttons */}
                                            <div className="pt-2">
                                                {acceptedTrip.status === 'ACCEPTED' && (
                                                    <button 
                                                        disabled={loading}
                                                        onClick={handleStartTrip}
                                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4.5 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                                                    >
                                                        <span>🚀 GO / START TRIP</span>
                                                        <span className="text-xl">➔</span>
                                                    </button>
                                                )}
                                                {acceptedTrip.status === 'ON_THE_WAY' && (
                                                    <button 
                                                        disabled={loading}
                                                        onClick={handleCompleteTrip}
                                                        className="w-full bg-black hover:bg-zinc-800 text-white py-4.5 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 border border-zinc-700 cursor-pointer disabled:opacity-50"
                                                    >
                                                        <span>🏁 COMPLETE TRIP</span>
                                                    </button>
                                                )}
                                                {acceptedTrip.status === 'COMPLETED' && (
                                                    <button 
                                                        onClick={handleConfirmPaymentAndReturnDuty}
                                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer font-sans"
                                                    >
                                                        <span>Confirm Payment & Return to Duty</span>
                                                        <span className="text-lg">➔</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Step 1: Incoming Ride Request Notifications */
                                    <>
                                        <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping"></div>
                                                <h3 className="text-xl font-black italic tracking-tighter uppercase text-black">
                                                    Step 1: Incoming Ride Requests
                                                </h3>
                                            </div>
                                            <span className="bg-zinc-100 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                                {activeRequestsToDisplay.length} Available
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {activeRequestsToDisplay.length > 0 ? (
                                                activeRequestsToDisplay.map((req) => (
                                                    <div key={req._id} className="bg-zinc-900 text-white p-5 rounded-[28px] shadow-xl flex flex-col gap-4 border border-zinc-800 animate-in zoom-in-95 duration-300">
                                                        {/* Rider Info & Fare */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-2xl">👤</span>
                                                                <div>
                                                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Rider</p>
                                                                    <p className="text-base font-black text-white">{req.rider?.name || 'Rider'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Estimated Fare</p>
                                                                <p className="text-2xl font-black text-emerald-400 italic">₹{req.estimatedFare}</p>
                                                            </div>
                                                        </div>

                                                        {/* Pickup & Dropoff Addresses */}
                                                        <div className="bg-zinc-800/80 p-3.5 rounded-2xl space-y-2 border border-zinc-700/50">
                                                            <div className="flex items-start gap-2.5">
                                                                <span className="text-emerald-400 font-bold text-xs mt-0.5">📍</span>
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Pickup Address</p>
                                                                    <p className="text-xs font-bold text-zinc-100">{req.pickup?.address}</p>
                                                                </div>
                                                            </div>
                                                            <div className="w-full h-px bg-zinc-700/50"></div>
                                                            <div className="flex items-start gap-2.5">
                                                                <span className="text-red-400 font-bold text-xs mt-0.5">🏁</span>
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Dropoff Address</p>
                                                                    <p className="text-xs font-bold text-zinc-100">{req.dropoff?.address}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons: Decline & YES! ACCEPT RIDE */}
                                                        <div className="grid grid-cols-3 gap-3 pt-1">
                                                            <button 
                                                                onClick={() => setDismissedRequests(prev => [...prev, req._id])}
                                                                className="col-span-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                                                            >
                                                                Decline
                                                            </button>
                                                            <button 
                                                                disabled={loading}
                                                                onClick={() => handleAcceptJourney(req._id)}
                                                                className="col-span-2 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                                                            >
                                                                <span>YES! ACCEPT RIDE</span>
                                                                <span className="text-lg">➔</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-12 text-center opacity-40">
                                                    <p className="font-black uppercase text-xs tracking-[0.25em] animate-pulse text-black">Waiting for incoming ride requests...</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">You are currently offline</p>
                                <p className="text-xs text-zinc-500 mt-1">Switch to Online to start receiving trip requests.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Map Container */}
                <div className="flex-1 relative bg-zinc-100">
                    <MapModeSwitcher mapMode={mapMode} setMapMode={setMapMode} />

                    <MapContainer 
                        center={mapCenter} 
                        zoom={14} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <MapTileLayers mapMode={mapMode} />
                        <ChangeView bounds={pickupPos && dropoffPos ? [pickupPos, dropoffPos] : null} center={pickupPos || mapCenter} />
                        
                        {pickupPos && (
                            <Marker position={pickupPos} icon={pickupIcon}>
                                <Popup>Pickup: {currentActiveTrip?.pickup?.address}</Popup>
                            </Marker>
                        )}
                        {dropoffPos && (
                            <Marker position={dropoffPos} icon={destinationIcon}>
                                <Popup>Dropoff: {currentActiveTrip?.dropoff?.address}</Popup>
                            </Marker>
                        )}
                        {!pickupPos && !dropoffPos && (
                            <Marker position={mapCenter} icon={pickupIcon}></Marker>
                        )}

                        {routePolyline.length > 0 && (
                            <Polyline positions={routePolyline} color={mapMode === MAP_MODES.ROADMAP ? "black" : "#00FFCC"} weight={5} opacity={0.9} />
                        )}
                    </MapContainer>

                    {distanceKm > 0 && (
                        <div className="absolute top-8 right-8 bg-black text-white p-6 rounded-[28px] shadow-2xl max-w-[280px] border border-white/20 z-[1000]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="font-black uppercase text-[10px] tracking-widest text-zinc-400">Live Driving Route</p>
                            </div>
                            <h4 className="text-xl font-black italic tracking-tighter uppercase">{distanceKm} KM • {durationMins} MINS</h4>
                            <p className="text-xs text-zinc-400 font-medium mt-1">Pickup to Dropoff OSRM navigation path.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboardPage;
