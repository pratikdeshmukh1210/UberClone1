import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

const Register = () => {
  
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{ isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", data);
      // dispatch(setUser(res.data.data.user));
  
   localStorage.setItem("token", res.data.data.token);
   alert("Token saved");
      navigate("/home");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
 <div
  className="hidden lg:flex w-1/2 relative bg-cover bg-center items-end justify-start p-30"
  style={{ backgroundImage: "url('/5969324.png')" }}
>
  <div className="bg-black/50 px-6 py-4 rounded text-white text-4xl font-bold">
    Start your journey
  </div>
</div>


      {/* RIGHT FORM */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 sm:px-8 py-10">
        <div className="w-full max-w-md text-black">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Create Account</h2>

            <button
              onClick={() => navigate("/login")}
              className="border px-6 py-2 text-sm bg-black text-white"
            >
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
              placeholder="Full Name"
              {...register("name",{required:true})}
              className="w-full p-3 border rounded-md text-sm sm:text-base"
            />

            <input
              placeholder="Email"
              {...register("email",{required:true})}
              className="w-full p-3 border rounded-md text-sm sm:text-base"
            />

            <input
              placeholder="Phone"
              {...register("phone",{required:true})}
              className="w-full p-3 border rounded-md text-sm sm:text-base"
            />

            <input
              type="password"
              placeholder="Password"
              {...register("password",{required:true})}
              className="w-full p-3 border rounded-md text-sm sm:text-base"
            />

            <button
              disabled={isSubmitting}
              className="w-full bg-black text-white p-3 rounded-md font-semibold"
            >
              {isSubmitting ? "Creating..." : "Continue"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;
