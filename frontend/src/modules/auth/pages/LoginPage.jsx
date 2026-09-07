import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, googleLogin } from "../AuthApi";
import { setUser, setToken } from "../AuthSlice";

const UberLogo = () => (
    <svg width="60" height="24" viewBox="0 0 75 24" fill="currentColor">
        <path d="M12.4 3.7c-3.1 0-5.4 2.2-5.4 5.3s2.3 5.3 5.4 5.3c3.1 0 5.4-2.2 5.4-5.3s-2.3-5.3-5.4-5.3zm0 8.2c-1.7 0-2.8-1.2-2.8-2.9s1.1-2.9 2.8-2.9s2.8 1.2 2.8 2.9c.1 1.7-1.1 2.9-2.8 2.9zm6.6-8v10.3h2.6v-1.1c.7.9 1.9 1.4 3.1 1.4c2.6 0 4.6-2 4.6-5.3s-2-5.3-4.6-5.3c-1.2 0-2.4.5-3.1 1.4V3.9h-2.6zm5.1 8.2c-1.5 0-2.6-1.1-2.6-2.9s1.1-2.9 2.6-2.9s2.6 1.1 2.6 2.9s-1.1 2.9-2.6 2.9zm13.1-8.2c-2.8 0-4.8 1.7-5.1 4.1h10.3c-.2-2.4-2.2-4.1-5.2-4.1zm5.2 5.9H32.1c.3 1.5 1.5 2.5 3.1 2.5c1.2 0 2.2-.5 2.8-1.4l2.1 1c-1.1 1.7-3 2.7-5 2.7c-3.3 0-5.7-2.3-5.7-5.4s2.4-5.4 5.7-5.4s5.6 2.3 5.6 5.4c0 .3 0 .5-.1.6zm4.8-5.6v10.3h2.6V9.1c0-1.5 1-2.6 2.4-2.6s.6 0 .9.1V3.9c-.3-.1-.6-.1-.9-.1c-1.6 0-2.9.8-3.6 2.1l-.1-.2-.1-.2-.1-.2-.1-.2H47.4z" />
    </svg>
);

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await login(data);
            const user = res.data.data.user;
            const token = res.data.data.token;

            dispatch(setUser(user));
            dispatch(setToken(token));

            const fromObj = location.state?.from;
            let targetRoute = null;
            if (typeof fromObj === 'string') {
                targetRoute = fromObj;
            } else if (fromObj?.pathname) {
                targetRoute = fromObj.pathname + (fromObj.search || '') + (fromObj.hash || '');
            }

            if (!targetRoute) {
                targetRoute = user?.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard';
            }

            navigate(targetRoute, { replace: true, state: fromObj?.state });
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-black selection:text-white">
            
            {/* Header */}
            <div className="p-10 lg:px-20 bg-black text-white">
                <div onClick={() => navigate('/home')} className="cursor-pointer w-fit">
                    <UberLogo />
                </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-20 animate-in fade-in duration-700">
                <div className="w-full max-w-[440px] space-y-12">
                    
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tighter italic uppercase text-black leading-none pb-2">What's your <br/> account details?</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Email or Phone</p>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-zinc-50 border-b-2 border-zinc-100 p-5 outline-none focus:border-black transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Password</p>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="w-full bg-zinc-50 border-b-2 border-zinc-100 p-5 outline-none focus:border-black transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal"
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.password.message}</span>}
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-5 rounded-full font-black text-xl hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Wait..." : "Continue"}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 py-8">
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
                        New to Uber?{" "}
                        <button onClick={() => navigate("/signup")} className="text-black font-black hover:underline underline-offset-8 decoration-2 decoration-black">Create an account</button>
                    </p>
                </div>
            </div>

            {/* Simple Footer */}
            <div className="p-12 flex justify-center gap-12 text-[10px] text-zinc-300 font-black uppercase tracking-[0.4em] italic">
                <span>Accessibility</span>
                <span>Privacy</span>
                <span>Terms</span>
            </div>
        </div>
    );
};

export default LoginPage;
