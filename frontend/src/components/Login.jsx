import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "../features/AuthSlice";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState:{ errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      dispatch(setUser(res.data.data.user));
      localStorage.setItem("token", res.data.data.token);
      
       alert("Token saved");
      navigate("/home");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-black">

      {/* LEFT IMAGE */}
    <div
  className="hidden lg:flex w-1/2 bg-cover bg-center items-center justify-center"
  style={{
    backgroundImage: "url('\srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NjRkZDNkMS05NGU3LTQ4MWUtYjI4Yy0wOGQ1OTM1M2I5ZTAucG5n.png')",
  }}
>
  <h1 className="text-white text-5xl font-bold bg-black/50 px-6 py-4 rounded">
  

    Move with Uber
  </h1>
</div>


      {/* RIGHT LOGIN */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10">

        <div className="w-full max-w-md text-black">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h2>

            <button
              onClick={() => navigate("/signup")}
              className="border px-10 py-3 text-sm font-medium bg-black text-white"
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
              placeholder="Enter email"
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:border-black"
              {...register("email", { required: true })}
            />

            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:border-black"
              {...register("password", { required: true })}
            />

            <button
              disabled={isSubmitting}
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
            >
              {isSubmitting ? "Logging..." : "Continue"}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* GOOGLE BUTTON */}
            <button
              type="button"
              onClick={() => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") || "http://localhost:3000";
                window.location.href = `${backendUrl}/api/auth/google`;
              }}
              className="w-full border border-gray-300 p-3 rounded-md text-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                className="w-6 h-6"
              />
              Continue with Google
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
