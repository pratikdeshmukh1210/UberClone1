import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../../../components/Navbar/Nav';
import { createJourney } from '../JourneyApi';
import { useDispatch, useSelector } from 'react-redux';
import { setJourney } from '../JourneySlice';
import { searchLocations, getDrivingRoute } from '../mapService';
import { MapTileLayers, MapModeSwitcher, MAP_MODES } from '../../../components/MapViewControl';

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
        if (bounds && bounds.length === 2) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (center) {
            map.setView(center, 13);
        }
    }, [bounds, center, map]);
    return null;
};

const RiderDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Allow all users (both Rider and Driver) to access RiderDashboard when clicking 'Ride'

    const [pickup, setPickup] = useState(location.state?.pickup || 'Connaught Place, Delhi');
    const [destination, setDestination] = useState(location.state?.destination || 'Noida Sector 62');
    const [pickupCoords, setPickupCoords] = useState(location.state?.pickupCoords || [28.6139, 77.2090]); // Lat, Lng
    const [dropoffCoords, setDropoffCoords] = useState(location.state?.dropoffCoords || [28.6280, 77.3649]);

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
    const [showPickupDropdown, setShowPickupDropdown] = useState(false);
    const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);

    const [selectedVehicletype, setSelectedVehicletype] = useState('CAR');
    const [loading, setLoading] = useState(false);

    const [distanceKm, setDistanceKm] = useState(0);
    const [durationMins, setDurationMins] = useState(0);
    const [routePolyline, setRoutePolyline] = useState([]);
    const [mapMode, setMapMode] = useState(MAP_MODES.HYBRID);

    // 1. Live Area Autocomplete Search
    useEffect(() => {
        if (pickup.length < 2) return;
        const timer = setTimeout(async () => {
            const results = await searchLocations(pickup);
            setPickupSuggestions(results);
        }, 300);
        return () => clearTimeout(timer);
    }, [pickup]);

    useEffect(() => {
        if (destination.length < 2) return;
        const timer = setTimeout(async () => {
            const results = await searchLocations(destination);
            setDropoffSuggestions(results);
        }, 300);
        return () => clearTimeout(timer);
    }, [destination]);

    // 2. Fetch OSRM Real Road Driving Route & KM Distance
    useEffect(() => {
        if (!pickupCoords || !dropoffCoords) return;
        const fetchRoute = async () => {
            const routeData = await getDrivingRoute(pickupCoords, dropoffCoords);
            if (routeData) {
                setDistanceKm(routeData.distanceKm);
                setDurationMins(routeData.durationMins);
                setRoutePolyline(routeData.polylineCoords);
            }
        };
        fetchRoute();
    }, [pickupCoords, dropoffCoords]);

    const getEstimatedFare = (base, perKm) => Math.round(base + (distanceKm * perKm));

    const vehicleOptions = [
        { type: 'CAR', name: 'Uber Go', base: 50, perKm: 12, img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1548646935/assets/64/93c251-4d30-4663-9524-749e7b2434bd/original/UberGo_v1.png' },
        { type: 'BIKE', name: 'Uber Moto', base: 20, perKm: 6, img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png' },
        { type: 'AUTO', name: 'Uber Auto', base: 30, perKm: 8, img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8a79-c367-47f1-a7c0-74ca7db1ac9f/original/Uber_Auto_G0_v1.png' },
    ];

    const handleRequestRide = async () => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            alert("Session expired or you are not logged in. Please login to book a ride.");
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            const res = await createJourney({
                pickupAddress: pickup,
                dropoffAddress: destination,
                vehicleType: selectedVehicletype,
                paymentMethod: 'CASH',
                pickupCoordinates: [pickupCoords[1], pickupCoords[0]], // Long, Lat
                dropoffCoordinates: [dropoffCoords[1], dropoffCoords[0]]
            });
            dispatch(setJourney(res.data.data));
            navigate("/active-ride");
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Your session has expired or is invalid. Please login again.");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                alert(err.response?.data?.message || "Error creating ride");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-white overflow-hidden font-sans selection:bg-black selection:text-white">
            <Nav />

            <div className="flex-1 flex overflow-hidden pt-[64px]">
                {/* Left Sidebar Form */}
                <div className="w-full md:w-[460px] bg-white h-full border-r border-zinc-100 flex flex-col z-10 shadow-2xl overflow-y-auto">
                    <div className="p-8 space-y-8">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-black">Plan Journey</h2>
                        
                        <div className="space-y-4 relative">
                            <div className="absolute left-6 top-[54px] bottom-14 w-[2px] bg-black z-0"></div>
                            
                            {/* Pickup Location Input */}
                            <div className="relative group">
                                <div className="absolute left-5 top-[28px] -translate-y-1/2 w-3 h-3 bg-black rounded-full z-10"></div>
                                <input 
                                    value={pickup}
                                    onChange={(e) => {
                                        setPickup(e.target.value);
                                        setShowPickupDropdown(true);
                                    }}
                                    onFocus={() => setShowPickupDropdown(true)}
                                    placeholder="Pickup Area / Landmark" 
                                    className="w-full bg-zinc-50 p-5 pl-14 rounded-xl border-2 border-transparent outline-none focus:border-black transition-all font-bold text-lg"
                                />
                                {/* Dropdown Suggestions */}
                                {showPickupDropdown && pickupSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-50 max-h-60 overflow-y-auto">
                                        {pickupSuggestions.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => {
                                                    setPickup(item.displayName);
                                                    setPickupCoords([item.lat, item.lon]);
                                                    setShowPickupDropdown(false);
                                                }}
                                                className="p-4 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 flex items-center gap-3 transition-colors"
                                            >
                                                <span className="text-lg">📍</span>
                                                <div>
                                                    <p className="font-bold text-sm text-black leading-tight">{item.displayName}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Dropoff Location Input */}
                            <div className="relative group">
                                <div className="absolute left-5 top-[28px] -translate-y-1/2 w-3 h-3 border-2 border-black bg-white z-10"></div>
                                <input 
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value);
                                        setShowDropoffDropdown(true);
                                    }}
                                    onFocus={() => setShowDropoffDropdown(true)}
                                    placeholder="Destination Area / Landmark" 
                                    className="w-full bg-zinc-50 p-5 pl-14 rounded-xl border-2 border-transparent outline-none focus:border-black transition-all font-bold text-lg"
                                />
                                {/* Dropdown Suggestions */}
                                {showDropoffDropdown && dropoffSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-50 max-h-60 overflow-y-auto">
                                        {dropoffSuggestions.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => {
                                                    setDestination(item.displayName);
                                                    setDropoffCoords([item.lat, item.lon]);
                                                    setShowDropoffDropdown(false);
                                                }}
                                                className="p-4 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 flex items-center gap-3 transition-colors"
                                            >
                                                <span className="text-lg">🏁</span>
                                                <div>
                                                    <p className="font-bold text-sm text-black leading-tight">{item.displayName}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Route Summary (KM & Mins Counter) */}
                        <div className="bg-black text-white p-6 rounded-2xl flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Distance</p>
                                <p className="text-3xl font-black italic tracking-tighter">{distanceKm} <span className="text-lg font-normal italic">KM</span></p>
                            </div>
                            <div className="w-px h-10 bg-zinc-800"></div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Est. Time</p>
                                <p className="text-3xl font-black italic tracking-tighter">{durationMins} <span className="text-lg font-normal italic">MINS</span></p>
                            </div>
                        </div>

                        {/* Vehicle Options */}
                        <div className="space-y-4">
                             <div className="flex justify-between items-center px-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Vehicle</p>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-black/60">Live Fare Estimates</p>
                             </div>
                             <div className="space-y-2">
                                {vehicleOptions.map((v) => (
                                    <div 
                                        key={v.type}
                                        onClick={() => setSelectedVehicletype(v.type)}
                                        className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${selectedVehicletype === v.type ? 'border-black bg-zinc-50 scale-[1.02] shadow-xl' : 'border-transparent hover:bg-zinc-50'}`}
                                    >
                                        <img src={v.img} className="w-20 object-contain" alt={v.name} />
                                        <div className="flex-1">
                                            <p className="font-black text-xl text-black leading-none">{v.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">₹{v.perKm}/km • {durationMins} mins away</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-2xl text-black">₹{getEstimatedFare(v.base, v.perKm)}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <button 
                            onClick={handleRequestRide}
                            disabled={loading || distanceKm === 0}
                            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {loading ? "Requesting Ride..." : `Book ${selectedVehicletype} (${distanceKm} KM)`}
                        </button>
                    </div>
                </div>

                {/* Right Interactive Map Area */}
                <div className="flex-1 relative bg-zinc-100">
                    <MapModeSwitcher mapMode={mapMode} setMapMode={setMapMode} />

                    <MapContainer 
                        center={pickupCoords} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <MapTileLayers mapMode={mapMode} />
                        <ChangeView bounds={[pickupCoords, dropoffCoords]} center={pickupCoords} />
                        
                        <Marker position={pickupCoords} icon={pickupIcon}>
                            <Popup>Pickup: {pickup}</Popup>
                        </Marker>
                        
                        <Marker position={dropoffCoords} icon={destinationIcon}>
                            <Popup>Dropoff: {destination}</Popup>
                        </Marker>

                        {/* OSRM Real Road Route Polyline */}
                        {routePolyline.length > 0 && (
                            <Polyline positions={routePolyline} color={mapMode === MAP_MODES.ROADMAP ? "black" : "#00FFCC"} weight={5} opacity={0.9} />
                        )}
                    </MapContainer>
                    
                    {/* Live KM Insights Badge Overlay */}
                    <div className="absolute top-8 right-8 bg-black text-white p-6 rounded-[28px] shadow-2xl max-w-[280px] border border-white/20 z-[1000]">
                         <div className="flex items-center gap-3 mb-2">
                             <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                             <p className="font-black uppercase text-[10px] tracking-widest text-zinc-400">Live Route insights</p>
                         </div>
                         <h4 className="text-xl font-black italic tracking-tighter uppercase">{distanceKm} KM • {durationMins} MINS</h4>
                         <p className="text-xs text-zinc-400 font-medium mt-1">Calculated via OSRM Driving Engine with real-time road conditions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
