import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

const RiderDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [showRides, setShowRides] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (pickup && dropoff) {
      setShowRides(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar / Options */}
      <div className="w-full md:w-[400px] bg-white shadow-xl z-10 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold mb-6">Uber</h1>
          <h2 className="text-2xl font-semibold mb-6">Get a ride</h2>
          
          <div className="space-y-4 relative">
            {/* Simple timeline line */}
            <div className="absolute left-[23px] top-[24px] bottom-[24px] w-0.5 bg-gray-200"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-black rounded-full z-10 mx-auto"></div>
              <input
                type="text"
                placeholder="Pickup location"
                className="w-full bg-gray-100 p-3 rounded-lg border-none focus:ring-2 focus:ring-black outline-none"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 border-2 border-black bg-white rounded-none z-10 mx-auto"></div>
              <input
                type="text"
                placeholder="Dropoff location"
                className="w-full bg-gray-100 p-3 rounded-lg border-none focus:ring-2 focus:ring-black outline-none"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            className="w-full bg-black text-white font-semibold py-3 rounded-lg mt-6 hover:bg-gray-800 transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Available Rides */}
        {showRides && (
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Choose a ride</h3>
            <div className="space-y-3">
              {[
                { name: 'UberX', time: '2 mins away', desc: 'Affordable, everyday rides', price: '$12.50', image: '🚗' },
                { name: 'UberXL', time: '5 mins away', desc: 'Comfortable rides for groups up to 6', price: '$24.00', image: '🚐' },
                { name: 'Comfort', time: '3 mins away', desc: 'Newer cars with extra legroom', price: '$18.20', image: '🚙' }
              ].map((ride, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border rounded-xl hover:border-black cursor-pointer transition">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{ride.image}</span>
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        {ride.name} <span className="text-xs font-normal text-gray-500">{ride.time}</span>
                      </h4>
                      <p className="text-xs text-gray-500">{ride.desc}</p>
                    </div>
                  </div>
                  <div className="font-bold text-lg">{ride.price}</div>
                </div>
              ))}
            </div>
            <button className="w-full bg-black text-white font-semibold py-3 rounded-lg mt-6 hover:bg-gray-800 transition">
              Confirm Ride
            </button>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="hidden md:block flex-1 bg-gray-300 relative z-0">
        <MapContainer 
          center={[40.7128, -74.0060]} // New York coordinates as default
          zoom={13} 
          scrollWheelZoom={true} 
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[40.7128, -74.0060]} icon={pickupIcon}>
            <Popup>
              You're here.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default RiderDashboard;
