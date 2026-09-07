import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDriver } from "../../features/DriverSlice";
import {
  getDriverProfile,
  updateDriverStatus,
  updateDriverProfile
} from "../../api/DriverApi";

export default function DriverDashboard() {

  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver.profile);

  const [editMode, setEditMode] = useState(false);
  const [vehicleModel, setVehicleModel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getDriverProfile();
      dispatch(setDriver(res.data.data));
      setVehicleModel(res.data.data.vehicleInfo?.vehicleModel || "");
    };
    fetchProfile();
  }, [dispatch]);

  if (!driver) return <p className="text-center mt-20 text-xl">Loading...</p>;

  const toggleOnline = async () => {
    setLoading(true);
    const res = await updateDriverStatus(!driver.status.isOnline);
    dispatch(setDriver(res.data.data));
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const res = await updateDriverProfile({ vehicleModel });
    dispatch(setDriver(res.data.data));
    setEditMode(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-black text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome {driver?.user?.name}
          </h1>
          <p className="text-gray-300">
            Rating ⭐ {driver?.stats?.rating || "0"} | Rides {driver?.stats?.totalRides || 0}
          </p>
        </div>

        <button
          onClick={toggleOnline}
          disabled={loading}
          className={`px-6 py-2 rounded-full font-semibold transition
            ${driver.status.isOnline
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {driver.status.isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* VEHICLE CARD */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">🚗 Vehicle Info</h2>

          {editMode ? (
            <>
              <input
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="border p-3 w-full rounded mb-3"
                placeholder="Enter Vehicle Model"
              />

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p className="mb-2">
                Model: {driver.vehicleInfo?.vehicleModel || "Not Added"}
              </p>

              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 font-semibold"
              >
                Edit
              </button>
            </>
          )}
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">📊 Profile Status</h2>

          <p className="mb-2">
            Completion: {driver.status.profileCompletionPercentage}%
          </p>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${driver.status.profileCompletionPercentage}%` }}
            ></div>
          </div>

          <p className="mt-3">
            Verification:
            <span className={driver.status.isVerified ? "text-green-600" : "text-red-600"}>
              {driver.status.isVerified ? " Verified" : " Pending"}
            </span>
          </p>
        </div>

      </div>

    </div>
  );
}