/**
 * Advanced Map Service for Area Search & Driving Route KM Calculation
 * Uses Photon by Komoot + Nominatim for fast area/location autocomplete,
 * and OSRM for real driving distance (km), duration (mins), and road geometry.
 */

// Search location area/address using Photon API & Nominatim
export const searchLocations = async (query) => {
    if (!query || query.trim().length < 2) return [];

    try {
        // Try Photon API first (Fast, accurate area & autocomplete search)
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`;
        const res = await fetch(photonUrl);
        const data = await res.json();

        if (data && data.features && data.features.length > 0) {
            return data.features.map(item => {
                const props = item.properties;
                const name = props.name || props.street || props.city || "";
                const city = props.city || props.state || props.country || "";
                const displayName = [name, props.district, city, props.country].filter(Boolean).join(", ");
                const [lon, lat] = item.geometry.coordinates;

                return {
                    displayName,
                    lat,
                    lon,
                    city: props.city || props.name || name
                };
            });
        }
    } catch (e) {
        console.warn("Photon API fallback to Nominatim", e);
    }

    // Fallback to Nominatim API (India prioritized)
    try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=in`;
        const res = await fetch(nomUrl);
        const data = await res.json();

        if (data && data.length > 0) {
            return data.map(item => ({
                displayName: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                city: item.address?.city || item.address?.town || item.address?.state || item.display_name.split(',')[0]
            }));
        }
    } catch (err) {
        console.error("Nominatim search error:", err);
    }

    return [];
};

// Calculate real driving route, distance (km), and travel duration (mins) using OSRM API
export const getDrivingRoute = async (pickupCoords, dropoffCoords) => {
    if (!pickupCoords || !dropoffCoords) return null;
    const [lat1, lon1] = pickupCoords;
    const [lat2, lon2] = dropoffCoords;

    try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        const data = await res.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const distanceKm = parseFloat((route.distance / 1000).toFixed(1)); // Convert meters to km
            const durationMins = Math.ceil(route.duration / 60); // Convert seconds to mins

            // GeoJSON coordinates are [lon, lat] -> convert to Leaflet [lat, lon]
            const polylineCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            return {
                distanceKm,
                durationMins,
                polylineCoords
            };
        }
    } catch (err) {
        console.error("OSRM route calculation error:", err);
    }

    // Fallback: Haversine distance if OSRM is offline
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = parseFloat((R * c).toFixed(1));

    return {
        distanceKm: dist,
        durationMins: Math.ceil(dist * 2.5),
        polylineCoords: [pickupCoords, dropoffCoords]
    };
};
