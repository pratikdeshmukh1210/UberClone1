import React from 'react'

const hero = () => {
  
  return (
      <div className="px-6 md:px-20 py-20 bg-white pt-20">

  <h2 className="text-3xl font-bold mb-10">
    Ways to ride and more
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

<div className="flex items-center justify-between bg-gray-100 p-5 rounded-xl shadow hover:shadow-md transition max-w-md">

  {/* LEFT TEXT */}
  <div className="pr-4">
    <h3 className="font-semibold text-lg">Intercity</h3>

    <p className="text-gray-600 text-sm mt-1">
      Get convenient outstation rides anytime.
    </p>
<button className="mt-3 px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-400 transition">
  Details
</button>
  </div>

  {/* RIGHT IMAGE */}
  <img
    src="/imger.png"
    alt="Intercity"
    className="w-40 h-30 object-contain"
  />

</div>

   <div className="flex items-center justify-between bg-gray-100 p-5 rounded-xl shadow hover:shadow-md transition max-w-md">

  <div className="pr-4">
    <h3 className="font-semibold text-lg">Reserve</h3>

    <p className="text-gray-600 text-sm mt-1">
      Book your ride in advance.
    </p>

    <button className="mt-3 px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-400 transition">
  Details
</button>
  </div>

  <img
    src="reserve_clock.png"
    alt="Reserve"
    className="w-40 h-30 object-contain"
  />

</div>

<div className="flex items-center justify-between bg-gray-100  p-5 rounded-xl shadow hover:shadow-md transition max-w-md">

  <div className="pr-4">
    <h3 className="font-semibold text-lg">Ride</h3>

    <p className="text-gray-600 text-sm mt-1">
      Request a ride anytime.
    </p>
<button className="mt-3 px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-400 transition">
  Details
</button>
  </div>

  <img
    src="\top_bar_rides_3d.png"
    alt="Ride"
    className="w-40 h-30 object-contain"
  />

</div>


  </div>
</div>
  )
}

export default hero