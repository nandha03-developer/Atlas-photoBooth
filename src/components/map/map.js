// components/Map.js
import React, { useEffect } from 'react';

const Map = () => {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = function () {
      new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    };
    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default Map; 