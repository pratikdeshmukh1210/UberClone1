import { Outlet } from "react-router-dom";

export default function DriverLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white p-4 font-bold">
        Driver Dashboard
      </div>
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}