import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setDriver } from "../../features/DriverSlice";
import { createDriver } from "../../api/DriverApi";

export default function DriverRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState:{ isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      // optional fields default null (backend compatible)
      data.profilePicture = data.profilePicture || null;
      data.licenseExpiry = data.licenseExpiry || null;
      data.rcExpiry = data.rcExpiry || null;
      data.vehicleNumber = data.vehicleNumber || null;
      data.vehicleModel = data.vehicleModel || null;
      data.vehicleColor = data.vehicleColor || null;

      const res = await createDriver(data);

      dispatch(setDriver(res.data.data));

      alert("Driver Profile Created Successfully");
      navigate("/driver/dashboard");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl space-y-4">

        <h2 className="text-2xl font-bold text-center">Driver Registration</h2>

        {/* PERSONAL INFO */}
        <select {...register("languagePreference",{required:true})} className="w-full border p-3 rounded">
          <option value="">Select Language</option>
          <option value="HINDI">HINDI</option>
          <option value="ENGLISH">ENGLISH</option>
          <option value="MARATHI">MARATHI</option>
        </select>

        <select {...register("city",{required:true})} className="w-full border p-3 rounded">
          <option value="">Select City</option>
          <option value="DELHI">DELHI</option>
          <option value="MUMBAI">MUMBAI</option>
          <option value="BANGALORE">BANGALORE</option>
        </select>

        <input placeholder="Aadhar Number" {...register("aadharNumber",{required:true})} className="w-full border p-3 rounded" />
        <input placeholder="Profile Picture URL" {...register("profilePicture")} className="w-full border p-3 rounded" />

        {/* DOCUMENTS */}
        <input placeholder="License Number" {...register("licenseNumber",{required:true})} className="w-full border p-3 rounded" />
        <input type="date" {...register("licenseExpiry")} min={new Date().toISOString().split('T')[0]} className="w-full border p-3 rounded" />

        <input placeholder="RC Number" {...register("rcNumber",{required:true})} className="w-full border p-3 rounded" />
        <input type="date" {...register("rcExpiry")} min={new Date().toISOString().split('T')[0]} className="w-full border p-3 rounded" />

        {/* VEHICLE INFO */}
        <select {...register("vehicleType",{required:true})} className="w-full border p-3 rounded">
          <option value="">Select Vehicle</option>
          <option value="CAR">CAR</option>
          <option value="BIKE">BIKE</option>
          <option value="AUTO">AUTO</option>
        </select>

        <input placeholder="Vehicle Number" {...register("vehicleNumber")} className="w-full border p-3 rounded" />
        <input placeholder="Vehicle Model" {...register("vehicleModel")} className="w-full border p-3 rounded" />
        <input placeholder="Vehicle Color" {...register("vehicleColor")} className="w-full border p-3 rounded" />

        <button disabled={isSubmitting} className="w-full bg-black text-white p-3 rounded font-semibold">
          {isSubmitting ? "Registering..." : "Register as Driver"}
        </button>
      </form>
    </div>
  );
}