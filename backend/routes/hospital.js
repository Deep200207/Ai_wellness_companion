// File: routes/hospitals.js

const express = require("express");
const router = express.Router();

// Node 18+ has fetch built in.
// If older Node version use:
// const fetch = require("node-fetch");

hospitalrouter.get("/hospitals", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // Validate inputs
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required"
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates"
      });
    }

    // Overpass API Query
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:5000,${latitude},${longitude});
        way["amenity"="hospital"](around:5000,${latitude},${longitude});
        relation["amenity"="hospital"](around:5000,${latitude},${longitude});
      );
      out center tags;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: query
      }
    );

    const data = await response.json();

    const hospitals = data.elements.map((item, index) => ({
      id: item.id || index,
      name: item.tags?.name || "Unnamed Hospital",
      type: item.tags?.amenity || "hospital",
      address:
        item.tags?.["addr:full"] ||
        item.tags?.["addr:street"] ||
        item.tags?.["addr:city"] ||
        "Address Not Available",
      lat: item.lat || item.center?.lat,
      lng: item.lon || item.center?.lon
    }));

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = hospitalrouter;