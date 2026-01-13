import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useState } from "react";
export default function Fitbit_Auth() {
  const API_BASE = "http://localhost:5000";
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setConnected(false);
      setLoading(true);

      if (!u) {
        // Not signed in → show Sign-in hint / Connect button hidden
        setLoading(false);
        return;
      }

      try {
        const idToken = await u.getIdToken();
        // Try a lightweight check against the existing endpoint.
        // If it returns 200, we assume Fitbit is connected.
        // If it returns 401/403/404 or other non-200, assume not connected.
        const res = await fetch(`${API_BASE}/fitbit/steps/weekly`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            // Keep request minimal; server should respond quickly if connected
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          // If the endpoint responds successfully, user is connected
          setConnected(true);
        } else {
          // Not connected or tokens invalid; do not show connected state
          setConnected(false);
        }
      } catch (err) {
        console.error("Connection check failed:", err);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function connectFitbit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const idToken = await user.getIdToken(); // For backend auth
    console.log(idToken)

    //  Call backend to get Fitbit OAuth URL
    const res = await fetch(`${API_BASE}/auth/fitbit`, {
      headers: {
        Authorization: `Bearer ${idToken}`, // Required!
      },
    });

    const data = await res.json();

    // Redirect user to Fitbit login consent page
    window.location.href = data.url;
  }

  async function stepTracker() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert("Login first");

    const idToken = await user.getIdToken();

    const res = await fetch(`${API_BASE}/fitbit/steps/weekly`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    console.log("Weekly Steps →", data);
  }

  return (
    <div className="w-[80%] float-right flex justify-center items-center p-2 ">
      <div className="flex gap-4">
        {loading ? (
          <button disabled className="bg-gray-300 rounded-2xl p-2 text-gray-600">
            Checking Fitbit status…
          </button>
        ) : !user ? (
          <button disabled className="bg-gray-300 rounded-2xl p-2 text-gray-600">
            Sign in to connect Fitbit
          </button>
        ) : connected ? (
          <div className="flex items-center gap-3">
            <button disabled className="bg-blue-600 rounded-2xl p-2 text-white cursor-default">
              Fitbit connected ✓
            </button>
          
          </div>
        ) : (
          <button
            onClick={connectFitbit}
            className="bg-blue-600 rounded-2xl p-2 text-white cursor-pointer"
          >
            Connect Fitbit
          </button>
        )}

        <button
          onClick={stepTracker}
          className="bg-green-500 p-2 rounded text-white"
        >
          Load Weekly Steps
        </button>
      </div>
    </div>
  );
}