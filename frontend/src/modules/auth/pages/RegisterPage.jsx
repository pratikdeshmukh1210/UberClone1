import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup, googleLogin } from "../AuthApi";
import { setUser, setToken } from "../AuthSlice";

const UberLogo = () => (
    <svg width="60" height="24" viewBox="0 0 75 24" fill="currentColor">
        <path d="M12.4 3.7c-3.1 0-5.4 2.2-5.4 5.3s2.3 5.3 5.4 5.3c3.1 0 5.4-2.2 5.4-5.3s-2.3-5.3-5.4-5.3zm0 8.2c-1.7 0-2.8-1.2-2.8-2.9s1.1-2.9 2.8-2.9s2.8 1.2 2.8 2.9c.1 1.7-1.1 2.9-2.8 2.9zm6.6-8v10.3h2.6v-1.1c.7.9 1.9 1.4 3.1 1.4c2.6 0 4.6-2 4.6-5.3s-2-5.3-4.6-5.3c-1.2 0-2.4.5-3.1 1.4V3.9h-2.6zm5.1 8.2c-1.5 0-2.6-1.1-2.6-2.9s1.1-2.9 2.6-2.9s2.6 1.1 2.6 2.9s-1.1 2.9-2.6 2.9zm13.1-8.2c-2.8 0-4.8 1.7-5.1 4.1h10.3c-.2-2.4-2.2-4.1-5.2-4.1zm5.2 5.9H32.1c.3 1.5 1.5 2.5 3.1 2.5c1.2 0 2.2-.5 2.8-1.4l2.1 1c-1.1 1.7-3 2.7-5 2.7c-3.3 0-5.7-2.3-5.7-5.4s2.4-5.4 5.7-5.4s5.6 2.3 5.6 5.4c0 .3 0 .5-.1.6zm4.8-5.6v10.3h2.6V9.1c0-1.5 1-2.6 2.4-2.6s.6 0 .9.1V3.9c-.3-.1-.6-.1-.9-.1c-1.6 0-2.9.8-3.6 2.1l-.1-.2-.1-.2-.1-.2-.1-.2H47.4z" />
    </svg>
);

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        setServerError("");
        try {
            // Sanitize phone: Remove spaces, dashes, etc.
            data.phone = data.phone.replace(/\D/g, "");

            const res = await signup(data);
            const user = res.data?.data?.user;
            const token = res.data?.data?.token;

            if (user && token) {
                dispatch(setUser(user));
                dispatch(setToken(token));

                const targetRoute = user.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard';
                navigate(targetRoute, { replace: true });
            } else {
                setServerError("Registration succeeded but session could not be established. Please login.");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            setServerError(message);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-black selection:text-white">
            
            {/* Header */}
            <div className="p-10 lg:px-20 bg-black text-white">
                <div onClick={() => navigate('/home')} className="cursor-pointer">
                    <UberLogo />
                </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-6 lg:px-20 animate-in fade-in duration-700">
                <div className="w-full max-w-[480px] space-y-12">
                    
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tighter italic uppercase text-black leading-none pb-2">Set up your <br/> account</h2>
                        <p className="text-zinc-400 font-medium">Join Uber to explore your world.</p>
                    </div>

                    {/* Server Error Message */}
                    {serverError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 font-bold text-xs uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-2 duration-300">
                             ⚠️ {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Full Name</p>
                             <input
                                placeholder="E.g. Elon Musk"
                                className={`w-full bg-zinc-50 border-b-2 ${errors.name ? 'border-red-200' : 'border-zinc-100'} p-5 outline-none focus:border-black transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal`}
                                {...register("name", { required: "Name is required" })}
                            />
                        </div>

                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Email address</p>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className={`w-full bg-zinc-50 border-b-2 ${errors.email ? 'border-red-200' : 'border-zinc-100'} p-5 outline-none focus:border-black transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal`}
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                            />
                        </div>

                         <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Phone number</p>
                            <input
                                type="tel"
                                placeholder="10 Digits"
                                className={`w-full bg-zinc-50 border-b-2 ${errors.phone ? 'border-red-200' : 'border-zinc-100'} p-5 outline-none focus:border-black transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal`}
                                {...register("phone", { 
                                    required: "Phone is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Please enter exactly 10 digits"
                                    }
                                })}
                            />
                            {errors.phone && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.phone.message}</span>}
                        </div>

                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Create password</p>
                            <input
                                type="password"
                                placeholder="Minimum 6 characters"
                                className={`w-full bg-zinc-50 border-b-2 ${errors.password ? 'border-red-200' : 'border-zinc-100'} p-5 outline-none focus:border-black transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal`}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters required" }
                                })}
                            />
                            {errors.password && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.password.message}</span>}
                        </div>

                        <div className="pt-10">
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-5 rounded-full font-black text-xl hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : "Continue"}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 py-4">
                            <div className="flex-1 h-px bg-zinc-100 text-black"></div>
                            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest italic translate-y-[-2px]">or</span>
                            <div className="flex-1 h-px bg-zinc-100 text-black"></div>
                        </div>

                        <button
                            type="button"
                            onClick={googleLogin}
                            className="w-full bg-white text-black border-2 border-zinc-100 py-4 rounded-full font-black text-lg flex items-center justify-center gap-4 hover:bg-zinc-50 transition-all active:scale-95"
                        >
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-zinc-500 text-sm font-medium">
                        Already have an account?{" "}
                        <button onClick={() => navigate("/login")} className="text-black font-black hover:underline underline-offset-8 decoration-2 decoration-black">Log in</button>
                    </p>
                </div>
            </div>

            <footer className="p-12 border-t border-zinc-50 flex justify-center gap-12 text-[10px] text-zinc-300 font-black uppercase tracking-[0.4em] italic">
                <span>English</span>
                <span>Privacy</span>
                <span>Terms</span>
            </footer>
        </div>
    );
};

export default RegisterPage;
