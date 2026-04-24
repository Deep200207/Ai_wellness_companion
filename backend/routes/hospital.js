// File: routes/hospitals.js
import express from "express";
const hospitalrouter = express.Router();

// Multiple Overpass mirrors — will try each on failure
const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const buildQuery = (lat, lng) => `
  [out:json][timeout:25];
  (
    node["amenity"="hospital"](around:5000,${lat},${lng});
    way["amenity"="hospital"](around:5000,${lat},${lng});
    relation["amenity"="hospital"](around:5000,${lat},${lng});
  );
  out center tags;
`;

// Tries each mirror in order, returns first successful response
const fetchWithFallback = async (query) => {
  let lastError = null;

  for (const url of OVERPASS_MIRRORS) {
    try {
      console.log(`Trying Overpass mirror: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s per mirror

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        console.warn(`Mirror ${url} responded with ${response.status}:`, text.slice(0, 200));
        lastError = new Error(`HTTP ${response.status} from ${url}`);
        continue; // try next mirror
      }

      const data = await response.json();
      console.log(`Success from mirror: ${url}`);
      return data;

    } catch (err) {
      // AbortError = timeout, TypeError = network unreachable
      console.warn(`Mirror ${url} failed: ${err.message}`);
      lastError = err;
      // continue to next mirror
    }
  }

  // All mirrors exhausted
  throw new Error(`All Overpass mirrors failed. Last error: ${lastError?.message}`);
};

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

    const query = buildQuery(latitude, longitude);
    const data = await fetchWithFallback(query); // ← replaces direct fetch

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
      lng: item.lon || item.center?.lon,
    }));

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });

  } catch (error) {
    console.error("Hospital Route Error:", error.message);

    // Distinguish between "no results" and actual failure
    return res.status(500).json({
      success: false,
      message: "Could not fetch hospital data. All sources unavailable.",
      detail: error.message, // remove this line in production
    });
  }
});

export default hospitalrouter;