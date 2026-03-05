import { useEffect, useRef, useState, useMemo } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { mapStyles } from '../../utils/mapStyles';
import './../../styles/components/map.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Google Maps Component
 */
const Map = ({ routes, activeRouteIndex }) => {
    const ref = useRef(null);
    const [map, setMap] = useState();
    const polylinesRef = useRef([]);

    // Initialize Map
    useEffect(() => {
        if (ref.current && !map) {
            const gMap = new window.google.maps.Map(ref.current, {
                center: { lat: 39.0, lng: 35.0 }, // Central Turkey
                zoom: 6,
                styles: mapStyles,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                backgroundColor: '#0a0e1a',
            });
            setMap(gMap);
        }
    }, [ref, map]);

    // Update Polylines when routes or activeRouteIndex change
    useEffect(() => {
        if (!map || !routes || routes.length === 0) return;

        // Clear existing polylines
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();

        routes.forEach((route, index) => {
            if (!route.polyline) return;

            // Decode polyline (string) from backend
            const path = window.google.maps.geometry.encoding.decodePath(route.polyline);
            const isActive = index === activeRouteIndex;

            const polyline = new window.google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: isActive ? '#06d6a0' : '#475569', // Neon Green vs Muted Gray/Navy
                strokeOpacity: isActive ? 0.9 : 0.4,
                strokeWeight: isActive ? 6 : 4,
                zIndex: isActive ? 100 : 1,
                map: map,
            });

            polylinesRef.current.push(polyline);

            // Extend bounds for all points in the active route
            if (isActive) {
                path.forEach(point => bounds.extend(point));
            }
        });

        // Focus map on the active route
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
        }
    }, [map, routes, activeRouteIndex]);

    return (
        <div className="map-wrapper glass-card">
            <div ref={ref} className="map-container" />
        </div>
    );
};

export default function MapComponent({ routes, activeRouteIndex }) {
    if (!API_KEY) {
        return (
            <div className="map-placeholder glass-card">
                <p>Google Maps API Key eksik. Lütfen .env dosyasını kontrol edin.</p>
            </div>
        );
    }

    return (
        <Wrapper apiKey={API_KEY} libraries={['geometry']}>
            <Map routes={routes} activeRouteIndex={activeRouteIndex} />
        </Wrapper>
    );
}
