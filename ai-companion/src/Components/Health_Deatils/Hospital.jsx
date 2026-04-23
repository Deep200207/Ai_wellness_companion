import React, { useState, useEffect } from "react";

export default function Hospital() {
  const [loading, setLoading] = useState(false);
  const [place, setPlaces] = useState([]);

  useEffect(() => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Correct backend API call
          const response = await fetch(
            `https://ai-wellness-companion-k1kr.onrender.com/api/hospitals?lat=${lat}&lng=${lng}`
          );

          const data = await response.json();

          console.log(data);

          setPlaces(data.hospitals || []);
          setLoading(false);

        } catch (err) {
          console.log("error", err);
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <h1 className="w-[85%] float-right text-center text-white text-2xl font-semibold mt-2 m-2">
        Nearest Hospital Details
      </h1>

      {loading && (
        <h1 className="text-amber-400 m-2 text-center w-[85%] float-right text-xl">
          Loading...
        </h1>
      )}

      <div className="w-[85%] grid md:grid-cols-3 float-right mt-10">
        {place.map((item, index) => (
          <div
            key={index}
            className="w-70 h-70 text-center m-2 bg-blue-950 border-white rounded-xl border ml-20"
          >
            <div className="text-white text-xl font-semibold m-2">
              {item.name}
            </div>

            <h1 className="text-white text-lg">
              Type: {item.type}
            </h1>

            <h1 className="text-white text-xl mt-2 font-bold">
              Address:
            </h1>

            <h1 className="text-white text-lg m-2">
              {item.address}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
}