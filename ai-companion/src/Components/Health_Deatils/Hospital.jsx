import React, { useState, useEffect } from 'react'

export default function Hospital() {

    const [loading, setLoading] = useState(false);
    const [place, setPlaces] = useState([]);

    useEffect(() => {
        setLoading(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const query = `
          [out:json];
          (
            node["amenity"="hospital"](around:5000,${lat},${lng});
          );
          out tags;
          `;
            try {
                const response = await fetch(
                    "https://overpass-api.de/api/interpreter",
                    {
                        method: "POST",
                        body: query
                    }
                );
                const data = await response.json();
                console.log(JSON.stringify(data.elements))
                setPlaces(data.elements);
                setLoading(false);
            } catch (err) {
                console.log("error", err)
            }
        })
    }, [Hospital], [])
    return (
        <>
            <h1 className='w-[85%] float-right text-center text-white text-2xl font-semibold mt-2 m-2
            '>Nearest Hospital Details</h1>
            {loading && <h1 className='text-amber-400 m-2 text-center w-[85%] float-right 
            text-xl'>Loading...</h1>}
            <div className='w-[85%] grid md:grid-cols-3 float-right mt-10 '>
                {place.map((item, index) => {
                    return (
                        <div className='w-70 h-70 text-center m-2 bg-blue-950
                        border-white rounded-xl  border-1 ml-20' key={index}>
                            <div className='text-white text-xl font-semibold m-2 '>
                                {item?.tags.name}
                            </div>
                            <h1 className='text-white  
                            text-lg'>Type: {item?.tags.amenity}</h1>
                            <h1 className='text-white text-xl mt-2 font-bold'>Address:</h1>
                            {item?.tags["addr:full"] ? <h1 className='text-white  
                            text-lg m-2'> {item?.tags["addr:full"]}</h1>:<h1 className='
                            text-center text-xl mt-2 font-bold text-white'>Not Available</h1>}
                        </div>
                    )
                })}
            </div>
        </>
    )
}
