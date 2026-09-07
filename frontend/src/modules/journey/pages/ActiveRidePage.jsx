import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJourneyStatus, acceptJourney, cancelJourney, getJourneyById, confirmPayment } from '../JourneyApi';
import { setStatus, setJourney } from '../JourneySlice';
import { MapContainer, Marker, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import Nav from '../../../components/Navbar/Nav';
import { getDrivingRoute } from '../mapService';
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

const ActiveRidePage = () => {
  const { journey } = useSelector((state) => state.journey);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [routePolyline, setRoutePolyline] = useState([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMins, setDurationMins] = useState(0);
  const [mapMode, setMapMode] = useState(MAP_MODES.HYBRID);

  const [acceptedNotificationShown, setAcceptedNotificationShown] = useState(false);

  // Play audio when driver accepts ride
  const playAcceptChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio notification error", e);
    }
  };

  const statusRef = useRef(journey?.status);
  useEffect(() => {
    statusRef.current = journey?.status;
  }, [journey?.status]);

  useEffect(() => {
    let interval;
    if (journey && journey._id) {
       interval = setInterval(async () => {
        try {
          const res = await getJourneyById(journey._id);
          const updated = res.data.data;
          console.log("CURRENT USER:", user);
          console.log("JOURNEY RESPONSE:", res.data);
          console.log("JOURNEY STATUS:", updated?.status);
          console.log("JOURNEY DRIVER:", updated?.driverId || updated?.driver);
          console.log("JOURNEY RIDER:", updated?.riderId || updated?.rider);
          if (updated) {
            if (statusRef.current !== 'ACCEPTED' && updated.status === 'ACCEPTED') {
                playAcceptChime();
            }
            dispatch(setJourney(updated));
            dispatch(setStatus(updated.status));
          }
        } catch (err) { console.error("Polling error", err); }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [journey?._id, dispatch, user]);

  const pickupPos = [
      journey?.pickup?.location?.coordinates[1] || 28.6139, 
      journey?.pickup?.location?.coordinates[0] || 77.2090
  ];
  const dropoffPos = [
      journey?.dropoff?.location?.coordinates[1] || 28.5355, 
      journey?.dropoff?.location?.coordinates[0] || 77.3910
  ];

  // Fetch OSRM Real Road Driving Route & KM Distance
  useEffect(() => {
    if (!pickupPos[0] || !dropoffPos[0]) return;
    const fetchRoute = async () => {
        const routeData = await getDrivingRoute(pickupPos, dropoffPos);
        if (routeData) {
            setDistanceKm(routeData.distanceKm);
            setDurationMins(routeData.durationMins);
            setRoutePolyline(routeData.polylineCoords);
        }
    };
    fetchRoute();
  }, [journey?._id]);

  const handleAcceptRide = async () => {
    setLoading(true);
    try {
      const res = await acceptJourney(journey._id);
      if (res.data?.data) {
        dispatch(setJourney(res.data.data));
      }
      dispatch(setStatus('ACCEPTED'));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept ride.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRide = async () => {
    setLoading(true);
    try {
      await cancelJourney(journey._id, 'Driver rejected request', 'DRIVER');
      dispatch(setStatus('CANCELLED'));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject ride.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateDriverAccept = async () => {
    setLoading(true);
    try {
      const res = await acceptJourney(journey._id);
      if (res.data?.data) {
        dispatch(setJourney(res.data.data));
      }
      dispatch(setStatus('ACCEPTED'));
      playAcceptChime();
    } catch (err) {
      alert(err.response?.data?.message || "Driver assignment failed. Please ensure a driver profile exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (nextStatus) => {
    setLoading(true);
    try {
      await updateJourneyStatus(journey._id, nextStatus);
      dispatch(setStatus(nextStatus));
    } catch (err) { alert(err.response?.data?.message || "Failed to update"); } 
    finally { setLoading(false); }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await confirmPayment(journey._id);
      alert("Payment Successful!");
      navigate("/home");
    } catch (err) { alert("Payment Confirmation Failed"); } 
    finally { setLoading(false); }
  };

  if (!journey) return (
     <div className="h-screen flex items-center justify-center bg-white p-10 font-sans">
        <div className="text-center space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase text-zinc-100">Uber Trip</h1>
            <p className="font-bold text-zinc-400">No active journey found.</p>
            <button onClick={() => navigate('/home')} className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-2xl">Go Home</button>
        </div>
     </div>
  );

  const currentUserId = (user?._id || user?.id)?.toString();
  
  const rawRider = journey.rider || journey.riderId;
  let journeyRiderId = null;
  if (rawRider) {
    if (typeof rawRider === 'object') {
      journeyRiderId = rawRider._id || rawRider.id;
    } else {
      journeyRiderId = rawRider;
    }
  }
  journeyRiderId = journeyRiderId?.toString();

  const rawDriver = journey.driver || journey.driverId;
  let journeyDriverUserId = null;
  if (rawDriver) {
    if (typeof rawDriver === 'object') {
      const uId = rawDriver.userId;
      if (uId) {
        journeyDriverUserId = typeof uId === 'object' ? (uId._id || uId.id) : uId;
      } else {
        journeyDriverUserId = rawDriver._id || rawDriver.id;
      }
    } else {
      journeyDriverUserId = rawDriver;
    }
  }
  journeyDriverUserId = journeyDriverUserId?.toString();

  // Determine if the current user is explicitly the driver assigned to this journey
  const isDriverOfThisTrip = Boolean(
    currentUserId && journeyDriverUserId && currentUserId === journeyDriverUserId
  );

  const isDriver = isDriverOfThisTrip;

  const otherPartyName = isDriver 
      ? (journey.rider?.name || 'Rider') 
      : (journey.driver?.name || 'Assigned Driver');
  const displayDriverName = journey.driver?.name || 'Assigned Driver';
  const displayVehicle = !isDriver ? (journey.driver?.vehicleModel || '') : '';
  const displayPlate = !isDriver ? (journey.driver?.vehicleNumber || '') : '';

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden font-sans selection:bg-black selection:text-white">
      <Nav />

      <div className="flex-1 flex overflow-hidden pt-[64px]">
        
        <div className="w-full md:w-[450px] bg-white h-full shadow-[24px_0_50px_rgba(0,0,0,0.05)] flex flex-col z-10 p-8 space-y-8 overflow-y-auto">
            <div className="space-y-4">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-black leading-none">{journey.status?.replace(/_/g, ' ')}</h2>
                <div className="flex gap-2">
                    {['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'COMPLETED'].map((s, idx) => (
                        <div key={idx} className={`flex-1 h-2 rounded-full ${journey.status === s ? 'bg-emerald-500 animate-pulse' : (idx < 2) ? 'bg-black' : 'bg-zinc-100'}`}></div>
                    ))}
                </div>
            </div>

            {/* Rider Accepted Notification Banner */}
            {!isDriver && journey.status === 'ACCEPTED' && !acceptedNotificationShown && (
                <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-[28px] space-y-4 animate-in slide-in-from-top duration-500 shadow-xl relative">
                    <button 
                        onClick={() => setAcceptedNotificationShown(true)} 
                        className="absolute top-4 right-4 text-xs font-black text-emerald-800 bg-emerald-200/60 rounded-full w-6 h-6 flex items-center justify-center hover:bg-emerald-300"
                    >
                        ✕
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎉</span>
                        <div>
                            <h4 className="font-black text-emerald-950 uppercase tracking-tight text-lg">Driver Accepted Ride!</h4>
                            <p className="text-xs text-emerald-800 font-bold mt-0.5">
                                <strong>{displayDriverName}</strong> has accepted your request and is on the way.
                            </p>
                        </div>
                    </div>
                    {journey.driver?.phone && (
                        <a 
                            href={`tel:${journey.driver.phone}`} 
                            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md"
                        >
                            Call Driver ({journey.driver.phone})
                        </a>
                    )}
                </div>
            )}

            {/* Distance & Duration Badge */}
            <div className="bg-black text-white p-5 rounded-2xl flex items-center justify-between shadow-xl">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Distance</p>
                    <p className="text-2xl font-black italic tracking-tighter">{distanceKm} <span className="text-sm font-normal">KM</span></p>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Est. Time</p>
                    <p className="text-2xl font-black italic tracking-tighter">{durationMins} <span className="text-sm font-normal">MINS</span></p>
                </div>
            </div>

            <div className="bg-zinc-50 rounded-[32px] p-8 space-y-6 border border-zinc-100 flex flex-col animate-in fade-in duration-1000">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center text-4xl shadow-xl">👤</div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{isDriver ? 'Rider' : 'Driver'}</p>
                        <p className="text-2xl font-black text-black">{otherPartyName}</p>
                        {displayPlate && (
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mt-1">
                                {displayVehicle} • {displayPlate}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-xs font-black bg-black text-white px-2.5 py-0.5 rounded-sm">4.9 ★</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-200/50">
                    <div className="flex justify-between items-center text-zinc-900">
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Total Pricing</p>
                        <p className="text-3xl font-black italic tracking-tighter">₹{journey.actualFare || journey.estimatedFare || '0'}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-end space-y-4">
               {isDriver ? (
                 <div className="space-y-4">
                    {journey.status === 'REQUESTED' && (
                        <div className="bg-zinc-900 text-white p-6 rounded-[28px] space-y-4 shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping"></div>
                                <h4 className="font-black text-lg uppercase tracking-tight text-white">Incoming Trip Request!</h4>
                            </div>
                            <p className="text-xs text-zinc-300 font-medium">
                                Rider <strong>{journey.rider?.name || 'Rider'}</strong> requested a trip for <strong className="text-emerald-400">₹{journey.actualFare || journey.estimatedFare || '0'}</strong>.
                            </p>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button 
                                    disabled={loading}
                                    onClick={handleRejectRide}
                                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                                >
                                    ✕ REJECT
                                </button>
                                <button 
                                    disabled={loading}
                                    onClick={handleAcceptRide}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
                                >
                                    ✓ ACCEPT RIDE
                                </button>
                            </div>
                        </div>
                    )}
                    {journey.status === 'ACCEPTED' && (
                        <button disabled={loading} onClick={() => handleStatusUpdate('ON_THE_WAY')} className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl hover:bg-zinc-800 transition-all shadow-xl">Start Journey</button>
                    )}
                    {journey.status === 'ON_THE_WAY' && (
                        <button disabled={loading} onClick={() => handleStatusUpdate('COMPLETED')} className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl hover:bg-zinc-800 transition-all shadow-xl">Complete Trip</button>
                    )}
                    {journey.status === 'COMPLETED' && (
                         <div className="text-center p-6 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 font-bold uppercase tracking-widest text-xs">Wait for Payment Confirmation</div>
                    )}
                    {journey.status === 'CANCELLED' && (
                        <div className="p-5 text-center bg-red-50 border-2 border-red-200 rounded-2xl space-y-3">
                            <p className="font-black uppercase text-xs tracking-widest text-red-700">❌ Trip Request Cancelled/Rejected</p>
                            <button onClick={() => navigate('/driver/dashboard')} className="w-full bg-black text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider">Back to Dashboard</button>
                        </div>
                    )}
                 </div>
               ) : (
                <div className="space-y-4">
                    {journey.status === 'REQUESTED' && (
                        <div className="p-5 text-center bg-amber-50 border-2 border-amber-200 rounded-2xl space-y-3 shadow-md">
                             <div className="flex items-center justify-center gap-2">
                                 <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
                                 <p className="font-black uppercase text-xs tracking-[0.2em] text-amber-800">📡 Searching for nearest driver...</p>
                             </div>
                             <p className="text-[11px] text-amber-700 font-medium">Please wait while a driver accepts your trip request, or click below for instant test assignment.</p>
                             <button 
                                 disabled={loading}
                                 onClick={handleSimulateDriverAccept}
                                 className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                             >
                                 ⚡ Instant Accept / Assign Driver Now
                             </button>
                        </div>
                    )}
                    {journey.status === 'ACCEPTED' && (
                        <div className="p-5 text-center bg-emerald-50 border-2 border-emerald-200 rounded-2xl space-y-1">
                             <p className="font-black uppercase text-xs tracking-[0.2em] text-emerald-800">✅ Driver Accepted Your Ride!</p>
                             <p className="text-[11px] text-emerald-600 font-medium"><strong>{displayDriverName}</strong> is on the way to pick you up.</p>
                        </div>
                    )}
                    {journey.status === 'ON_THE_WAY' && (
                        <div className="p-5 text-center bg-zinc-900 text-white rounded-2xl">
                             <p className="font-black uppercase text-xs tracking-[0.2em] text-emerald-400 animate-pulse">🚗 Ride in Progress ({distanceKm} KM)</p>
                        </div>
                    )}
                    {journey.status === 'COMPLETED' && (
                         <div className="bg-zinc-50 p-6 rounded-[32px] border-2 border-dashed border-zinc-200 flex flex-col items-center gap-6">
                             <p className="font-black uppercase text-[10px] tracking-widest text-zinc-400">Scan QR Code to Pay</p>
                             <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-xl">
                                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=pay_journey_${journey._id}`} alt="QR" className="w-full h-full object-contain" />
                             </div>
                             <button disabled={loading} onClick={handlePayment} className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl hover:bg-zinc-800 transition-all shadow-2xl">Pay & Complete</button>
                         </div>
                    )}
                    {journey.status === 'CANCELLED' && (
                        <div className="p-6 text-center bg-red-50 border-2 border-red-200 rounded-[28px] space-y-4 shadow-lg">
                            <div className="text-4xl">❌</div>
                            <h4 className="font-black text-red-950 uppercase tracking-tight text-lg">Ride Rejected / Cancelled</h4>
                            <p className="text-xs text-red-800 font-medium">The driver rejected or cancelled your ride request. Please try requesting another ride.</p>
                            <button 
                                onClick={() => navigate('/rider/dashboard')} 
                                className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95"
                            >
                                Book New Ride
                            </button>
                        </div>
                    )}
                </div>
               )}
            </div>
        </div>

        <div className="flex-1 relative">
           <MapModeSwitcher mapMode={mapMode} setMapMode={setMapMode} />

           <MapContainer 
                center={pickupPos} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
           >
                <MapTileLayers mapMode={mapMode} />
                <ChangeView bounds={[pickupPos, dropoffPos]} center={pickupPos} />
                
                <Marker position={pickupPos} icon={pickupIcon}></Marker>
                <Marker position={dropoffPos} icon={destinationIcon}></Marker>
                
                {routePolyline.length > 0 && (
                    <Polyline positions={routePolyline} color={mapMode === MAP_MODES.ROADMAP ? "black" : "#00FFCC"} weight={5} opacity={0.9} />
                )}
           </MapContainer>
           
           <div className="absolute top-8 right-8 bg-black text-white p-6 rounded-[28px] shadow-2xl max-w-[300px] border border-white/20 z-[1000]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Secure Tracking</p>
                </div>
                <p className="font-bold text-white text-lg">{distanceKm} KM • {durationMins} MINS</p>
                <p className="text-xs text-zinc-400 mt-1">Real-time GPS turn-by-turn road polyline powered by OSRM Routing Engine.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRidePage;
