import express from 'express';
import admin from '../firebaseAdmin.js';
import FitbitToken from '../models/FitbitToken.js';
import dotenv from 'dotenv'
dotenv.config(); // load env early
const firebase_fitbit = express.Router();
const {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
} = process.env;
// --------- Verify Firebase token middleware ----------
async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({ error: "Missing Firebase token" });
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("verifyIdToken error:", err);
        res.status(401).json({ error: "Invalid Firebase token" });
    }
}
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.warn("⚠ Warning: Fitbit env vars missing. Set CLIENT_ID, CLIENT_SECRET, REDIRECT_URI");
}
const FITBIT_SCOPES = ["activity", "heartrate", "sleep", "profile"].join(" ");
async function refreshFitbitToken(userId, storedTokens) {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: storedTokens.refreshToken,
    }).toString();

    const response = await fetch("https://api.fitbit.com/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicAuth}`,
        },
        body,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Fitbit refresh error:", errorText);
        throw new Error("Failed to refresh Fitbit token");
    }

    const data = await response.json();
    const now = Date.now();

    const updated = await FitbitToken.findOneAndUpdate(
        { userId },
        {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            scope: data.scope,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            expiresAt: now + (data.expires_in - 60) * 1000, // 60s safety
        },
        { new: true }
    );

    return updated.accessToken;
}

async function getValidAccessToken(userId) {
    const tokens = await FitbitToken.findOne({ userId });

    if (!tokens) {
        throw new Error("Fitbit not connected");
    }

    const now = Date.now();

    if (tokens.expiresAt && tokens.expiresAt > now) {
        return tokens.accessToken;
    }
    const newAccessToken = await refreshFitbitToken(userId, tokens);
    return newAccessToken;
}

// --------- /auth/fitbit ----------
firebase_fitbit.get("/auth/fitbit", verifyFirebaseToken, (req, res) => {
    try {
        const userId = req.user.uid;
        const state = userId; 
        console.log('FITBIT_CLIENT_ID =', CLIENT_ID);
        // console.log('Auth URL =', url);


        const fitbitAuthUrl =
            "https://www.fitbit.com/oauth2/authorize" +
            "?response_type=code" +
            `&client_id=${encodeURIComponent(CLIENT_ID)}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&scope=${encodeURIComponent(FITBIT_SCOPES)}` +
            `&state=${encodeURIComponent(state)}`;

        return res.json({ url: fitbitAuthUrl });
    } catch (err) {
        console.error("Error in /auth/fitbit:", err);
        return res.status(500).json({ error: "Internal error in /auth/fitbit" });
    }
});

// --------- /auth/fitbit/callback ----------
firebase_fitbit.get("/auth/fitbit/callback", async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).send("Missing code or state");
    }

    const userId = state;

    try {
        const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

        const body = new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: "authorization_code",
            redirect_uri: REDIRECT_URI,
            code,
        }).toString();

        const response = await fetch("https://api.fitbit.com/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Fitbit token exchange error:", errorText);
            return res.status(500).send("Error exchanging code with Fitbit");
        }

        const data = await response.json();
        const now = Date.now();

        await FitbitToken.findOneAndUpdate(
            { userId },
            {
                fitbitUserId: data.user_id,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                scope: data.scope,
                tokenType: data.token_type,
                expiresIn: data.expires_in,
                expiresAt: now + (data.expires_in - 60) * 1000,
            },
            { new: true, upsert: true }
        );

        res.send("Fitbit connected! You can close this tab and go back to the app.");
    } catch (err) {
        console.error("Error in /auth/fitbit/callback:", err);
        res.status(500).send("Error connecting to Fitbit");
    }
});

// --------- /fitbit/steps ----------
firebase_fitbit.get("/fitbit/steps", verifyFirebaseToken, async (req, res) => {
    const userId = req.user.uid;
    // console.log("Fetching steps for userId:", userId);

    try {
        const accessToken = await getValidAccessToken(userId);
        // console.log("Got access token:", accessToken);
        const today = new Date().toISOString().split("T")[0];

        const response = await fetch(
            `https://api.fitbit.com/1/user/-/activities/date/${today}.json`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Fitbit steps error:", errorText);
            return res.status(500).json({ error: "Failed to fetch Fitbit steps" });
        }

        const json = await response.json();
        console.log(json.summary);
        const steps = json.summary?.steps ?? 0;

        res.json({ steps, raw: json });
    } catch (err) {
        console.error("Error in /fitbit/steps:", err);
        if (err.message === "Fitbit not connected") {
            return res.status(400).json({ error: "Fitbit not connected" });
        }
        res.status(500).json({ error: "Failed to fetch Fitbit steps" });
    }
});

// --------- /fitbit/steps/weekly ----------
firebase_fitbit.get("/fitbit/steps/weekly", verifyFirebaseToken, async (req, res) => {
    const userId = req.user.uid;
    console.log(userId);
    try {
        const accessToken = await getValidAccessToken(userId);
        console.log(accessToken);
        const response = await fetch(
            "https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Fitbit weekly steps error:", errorText);
            return res
                .status(500)
                .json({ error: "Failed to fetch Fitbit weekly steps" });
        }

        const json = await response.json();
        console.log(json)
        const dataset = json["activities-steps"] || [];

        const stepsData = dataset.map((d) => ({
            date: d.dateTime,
            steps: Number(d.value),
        }));

        res.json({ days: stepsData });
    } catch (err) {
        console.error("Error in /fitbit/steps/weekly:", err);
        if (err.message === "Fitbit not connected") {
            return res.status(400).json({ error: "Fitbit not connected" });
        }
        res.status(500).json({ error: "Failed to fetch Fitbit weekly steps" });
    }
});

export default firebase_fitbit;
