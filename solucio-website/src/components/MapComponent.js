import React, { useEffect, useRef } from 'react';

const MapComponent = ({ googleMapsApiKey }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const mapId = 'google-maps-script';  // Unique ID for the script tag

    const initializeMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12,
        });

        new window.google.maps.Marker({
          position: { lat: 37.7749, lng: -122.4194 },
          map: map,
          title: 'San Francisco'
        });
      }
    };

    const loadGoogleMaps = () => {
      const existingScript = document.getElementById(mapId);
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = mapId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = initializeMap;
        script.onerror = () => console.error('Google Maps script failed to load.');
      } else {
        initializeMap();
      }
    };

    loadGoogleMaps();

    // Cleanup function to remove script tag
    return () => {
      const existingScript = document.getElementById(mapId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [googleMapsApiKey]);  // Dependency array includes apiKey to handle changes

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
