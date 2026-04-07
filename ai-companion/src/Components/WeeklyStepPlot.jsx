// WeeklyStepsAutoPlot.jsx
import React, { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { getAuth } from "firebase/auth";
import { ThemeContext } from "../context/ThemeContext";

export default function WeeklyStepsAutoPlot({ apiBase = "http://localhost:5000" }) {
    const [user, setUser] = useState(null);
    const [stepsData, setStepsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {sevenDaysStep,setSevenDaysStep} =useContext(ThemeContext);

    useEffect(() => {
        const auth = getAuth();
        const unsub = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user) {
            setStepsData([]);
            return;
        }
        let mounted = true;
        async function fetchWeekly() {
            setLoading(true);
            setError(null);
            try {
                const idToken = await user.getIdToken();
                const res = await fetch(`${apiBase}/fitbit/steps/weekly`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        throw new Error("Not connected to Fitbit or session expired (401/403).");
                    } else if (res.status === 404) {
                        throw new Error("No steps data found (404).");
                    } else {
                        throw new Error(`Server error: ${res.status}`);
                    }
                }

                const raw = await res.json();

                const normalized = normalizeWeeklyResponse(raw);
                if (!Array.isArray(normalized) || normalized.length === 0) {
                    throw new Error("No step entries found in response.");
                }

                if (mounted){ setStepsData(normalized); setSevenDaysStep(normalized)};

            } catch (err) {
                console.error("fetchWeekly error:", err);
                if (mounted) {
                    setError(err.message || "Failed to fetch weekly steps.");
                    setStepsData([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchWeekly();
        return () => {
            mounted = false;
        };
    }, [user, apiBase]);

    // Normalizer - handle multiple payload shapes defensively
    function normalizeWeeklyResponse(raw) {
        // If already an array of {date, steps}
        if (Array.isArray(raw)) {
            return raw.map(normalizeEntry).sort(byDateAsc);
        }

        // Common wrappers
        const possible = [
            raw?.payload,
            raw?.data,
            raw?.days,
            raw?.result,
            raw?.response,
        ];

        for (const candidate of possible) {
            if (Array.isArray(candidate)) {
                return candidate.map(normalizeEntry).sort(byDateAsc);
            }
            // sometimes candidate is object with days inside
            if (candidate && Array.isArray(candidate?.days)) {
                return candidate.days.map(normalizeEntry).sort(byDateAsc);
            }
        }

        // If the server sent { payload: { days: [...] } }
        if (raw?.payload?.days && Array.isArray(raw.payload.days)) {
            return raw.payload.days.map(normalizeEntry).sort(byDateAsc);
        }

        // If the server sent { days: [{...}] }
        if (raw?.days && Array.isArray(raw.days)) {
            return raw.days.map(normalizeEntry).sort(byDateAsc);
        }

        // If server sent an object keyed by date: { "2025-12-01": 123, ... }
        if (raw && typeof raw === "object") {
            const keys = Object.keys(raw).filter(k => /^\d{4}-\d{2}-\d{2}/.test(k));
            if (keys.length > 0) {
                return keys.map(k => ({ date: k, steps: Number(raw[k] ?? 0) })).sort(byDateAsc);
            }
        }

        // Unknown shape -> return empty array (caller will error)
        return [];
    }

    function normalizeEntry(r) {
        // r might be {date, steps} or {day, value} etc.
        const date = r?.date || r?.day || r?.d || r?.dt || null;
        const steps =
            Number(r?.steps ?? r?.step_count ?? r?.value ?? r?.count ?? r?.steps_count ?? 0);
        // fallback: if an entry has nested {payload: { date, steps }}
        if (!date && r?.payload) {
            return normalizeEntry(r.payload);
        }
        return {
            date: date ? String(date) : computeFallbackDate(),
            steps: Number.isFinite(steps) ? steps : 0,
        };
    }

    function byDateAsc(a, b) {
        // compare ISO date strings safely; fallback to string compare
        if (a.date === b.date) return 0;
        return a.date > b.date ? 1 : -1;
    }

    // fallback date (today)
    function computeFallbackDate() {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    }

    // Build Plotly arrays
    const x = stepsData.map((d) => d.date);
    const y = stepsData.map((d) => d.steps);

    const layout = {
        title: {
            text: "Weekly Steps",
            font: { size: 22 },
            x: 0.5,            // center title horizontally
            xanchor: "center",
        },
        plot_bgcolor: "white",
        paper_bgcolor: "white",
        xaxis: { title: "Date", dtick: 86400000, tickangle: -45, automargin: true },
        yaxis: { title: "Steps", automargin: true },
        margin: { t: 40, l: 60, r: 20, b: 80 },
        bargap: 0.2,
        autosize: true,
    };

    const config = {
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "select2d", "toImage"],
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm ">
            {loading ? (
                <div className="text-center p-4">Loading weekly steps…</div>
            ) : error ? (
                <div className="text-center p-4 text-red-600">{error}</div>
            ) : stepsData.length === 0 ? (
                <div className="text-center p-4 text-gray-600">No step data available for this week.</div>
            ) : (
                <Plot
                    data={[
                        {
                            x,
                            y,
                            type: "bar",
                            marker: { color: "royalblue", line: { width: 0.5 }, width: 0.1 },
                            // hovertemplate: "%{x}<br>Steps: %{y:,}<extra></extra>",
                        },
                    ]}
                    layout={layout}
                    config={config}
                    style={{ width: "100%", height: "400px" }}
                    useResizeHandler={true}
                />
            )}
        </div>
    );
}
