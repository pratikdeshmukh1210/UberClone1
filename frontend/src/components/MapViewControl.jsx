import React from 'react';
import { TileLayer } from 'react-leaflet';

export const MAP_MODES = {
    ROADMAP: 'roadmap',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid'
};

export const MapTileLayers = ({ mapMode = MAP_MODES.HYBRID }) => {
    if (mapMode === MAP_MODES.SATELLITE) {
        return (
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                maxZoom={19}
            />
        );
    }

    if (mapMode === MAP_MODES.HYBRID) {
        return (
            <>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                />
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                />
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                />
            </>
        );
    }

    // Default: Roadmap
    return (
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
        />
    );
};

export const MapModeSwitcher = ({ mapMode, setMapMode }) => {
    const options = [
        { key: MAP_MODES.ROADMAP, label: 'Roadmap', icon: '🗺️' },
        { key: MAP_MODES.SATELLITE, label: 'Satellite', icon: '🛰️' },
        { key: MAP_MODES.HYBRID, label: 'Hybrid', icon: '🌐' },
    ];

    return (
        <div className="absolute top-6 left-6 z-[1000] bg-black/85 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1 text-white animate-in fade-in slide-in-from-top-4 duration-500">
            {options.map((opt) => (
                <button
                    key={opt.key}
                    type="button"
                    onClick={() => setMapMode(opt.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                        mapMode === opt.key 
                            ? 'bg-white text-black shadow-lg scale-[1.03]' 
                            : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                    <span className="text-sm">{opt.icon}</span>
                    <span>{opt.label}</span>
                </button>
            ))}
        </div>
    );
};
