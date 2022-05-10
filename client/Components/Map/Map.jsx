import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

function Map({ mapData }) {
  const mapContainer = useRef();
  useEffect(() => {
    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v11",
        center: [mapData.longitude, mapData.latitude],
        zoom: 15,
      });
      map.on("load", () => {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://styles/mapbox/streets-v9",
          tileSize: 512,
          maxZoom: 16,
        });
        map.addSource("snotel-sites", {
          type: "geojson",
          data: {
            type: "Point",
            coordinates: [mapData.longitude, mapData.latitude],
          },
        });
        map.addLayer({
          id: "snotel-sites-circle",
          type: "circle",
          source: "snotel-sites",
          paint: {
            "circle-color": "#F900BF",
            "circle-radius": 5,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
      });
      return () => map.remove();
    } catch (error) {
      alert("Error while creating map");
    }
  }, []);

  return <div ref={mapContainer} style={{ height: "400px", width: "600px" }} />;
}

export default Map;
