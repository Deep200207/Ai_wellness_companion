// File: routes/hospitals.js
import express from "express";
const hospitalrouter = express.Router();

const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

hospitalrouter.get("/hospitals", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Google Places API key not configured",
      });
    }

    const params = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: 5000,           // 5km radius
      type: "hospital",
      key: apiKey,
    });

    const response = await fetch(`${GOOGLE_PLACES_URL}?${params}`);

    if (!response.ok) {
      console.error("Google Places HTTP Error:", response.status);
      return res.status(500).json({
        success: false,
        message: "Failed to reach Google Places API",
      });
    }

    const data = await response.json();

    // Google returns status in body, not HTTP code
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API Error:", data.status, data.error_message);
      return res.status(500).json({
        success: false,
        message: `Google Places error: ${data.status}`,
      });
    }

    const hospitals = (data.results || []).map((place) => ({
      id: place.place_id,
      name: place.name,
      type: "hospital",
      address: place.vicinity || "Address Not Available",
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || null,
      open_now: place.opening_hours?.open_now ?? null,
    }));

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });

  } catch (error) {
    console.error("Hospital Route Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default hospitalrouter;