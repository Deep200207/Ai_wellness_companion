// File: routes/hospitals.js

// const express = require("express");
import express from "express";
const hospitalrouter = express.Router();

// Node 18+ has fetch built in.
// If older Node version use:
// const fetch = require("node-fetch");

hospitalrouter.get("/hospitals", async (req, res) => {
  try {
    const { lat, lng } = req.query;

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

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:5000,${latitude},${longitude});
        way["amenity"="hospital"](around:5000,${latitude},${longitude});
        relation["amenity"="hospital"](around:5000,${latitude},${longitude});
      );
      out center tags;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: query
    });

    // ✅ IMPORTANT CHECK
    if (!response.ok) {
      const text = await response.text();
      console.log("Overpass Error:", text);

      return res.status(500).json({
        success: false,
        message: "Overpass API failed"
      });
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.log("JSON Parse Error");
      return res.status(500).json({
        success: false,
        message: "Invalid response from API"
      });
    }

    const hospitals = (data.elements || []).map((item, index) => ({
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
    console.log("Hospital Route Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
export default hospitalrouter