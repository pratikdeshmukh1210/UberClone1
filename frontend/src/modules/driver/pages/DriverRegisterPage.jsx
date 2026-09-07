import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setDriver } from "../DriverSlice";
import { registerDriver } from "../DriverApi";
import { setUser, logout } from "../../auth/AuthSlice";
import { getMe } from "../../auth/AuthApi";

const DriverRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            const payload = {};
            Object.keys(data).forEach(key => {
                const val = data[key];
                if (val !== null && val !== undefined && val !== "") {
                    payload[key] = typeof val === 'string' ? val.trim() : val;
                }
            });

            // Format vehicle number if provided (strip spaces and uppercase: e.g. "DL 01 CA 1234" -> "DL01CA1234")
            if (payload.vehicleNumber) {
                payload.vehicleNumber = payload.vehicleNumber.replace(/\s+/g, '').toUpperCase();
            }

            const res = await registerDriver(payload);
            dispatch(setDriver(res.data.data));

            // Refresh user profile so Redux auth.user role updates to DRIVER
            try {
                const meRes = await getMe();
                if (meRes.data?.data?.user) {
                    dispatch(setUser(meRes.data.data.user));
                }
            } catch (e) {
                console.warn("Could not sync user role after driver registration", e);
            }

            alert("Driver profile created successfully!");
            navigate("/driver/dashboard");
        } catch (err) {
            console.error("Driver Registration Error:", err);
            if (err.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                dispatch(logout());
                navigate("/login");
            } else if (err.response?.status === 400) {
                const backendErrors = err.response?.data?.errors;
                let errMsg = err.response?.data?.message || "Validation Failed";
                
                if (Array.isArray(backendErrors) && backendErrors.length > 0) {
                    const detail = backendErrors.map(e => `• ${e.message}`).join("\n");
                    errMsg = `Please check your form details:\n\n${detail}`;
                }
                alert(errMsg);
            } else {
                alert(err.response?.data?.message || "Registration Failed. Please check your inputs.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-black selection:text-white">
            
            {/* Nav */}
            <div className="p-8 flex justify-between items-center">
                <h1 onClick={() => navigate('/home')} className="text-3xl font-black italic tracking-tighter cursor-pointer text-black">Uber</h1>
                <button onClick={() => navigate('/home')} className="font-bold text-sm underline underline-offset-4">Cancel</button>
            </div>

            <div className="max-w-[800px] mx-auto w-full flex-1 px-6 pb-20">
                <div className="space-y-12">
                    
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tight leading-none italic uppercase">Become a <br/> professional driver</h2>
                        <p className="text-zinc-500 font-medium text-lg max-w-[500px]">Fill out the details below to start earning with the world's largest marketplace of active riders.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        
                        {/* Section 1 */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b pb-2 border-zinc-200">Personal & Location</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">Preferred Language *</label>
                                    <select {...register("languagePreference", { required: true })} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold">
                                        <option value="">Select Language</option>
                                        <option value="HINDI">HINDI</option>
                                        <option value="ENGLISH">ENGLISH</option>
                                        <option value="MARATHI">MARATHI</option>
                                        <option value="TAMIL">TAMIL</option>
                                        <option value="TELUGU">TELUGU</option>
                                        <option value="BENGALI">BENGALI</option>
                                        <option value="GUJARATI">GUJARATI</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">Primary City *</label>
                                    <select {...register("city", { required: true })} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold">
                                        <option value="">Select City</option>
                                        <option value="DELHI">DELHI</option>
                                        <option value="MUMBAI">MUMBAI</option>
                                        <option value="BANGALORE">BANGALORE</option>
                                        <option value="HYDERABAD">HYDERABAD</option>
                                        <option value="CHENNAI">CHENNAI</option>
                                        <option value="KOLKATA">KOLKATA</option>
                                        <option value="PUNE">PUNE</option>
                                        <option value="AHMEDABAD">AHMEDABAD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">12-Digit Aadhar Number *</label>
                                <input 
                                    placeholder="e.g. 123456789012" 
                                    maxLength={12}
                                    minLength={12}
                                    pattern="[0-9]{12}"
                                    title="Aadhar number must be exactly 12 digits"
                                    {...register("aadharNumber", { required: true })} 
                                    className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all text-xl font-bold placeholder:text-zinc-200 placeholder:font-normal" 
                                />
                                <p className="text-[11px] text-zinc-400 pl-1">Must be exactly 12 numeric digits without spaces.</p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b pb-2 border-zinc-200">Vehicle Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">Vehicle Type *</label>
                                     <select {...register("vehicleType", { required: true })} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold text-xl uppercase">
                                        <option value="">Select Vehicle Type</option>
                                        <option value="CAR">CAR</option>
                                        <option value="BIKE">BIKE</option>
                                        <option value="AUTO">AUTO</option>
                                        <option value="E_RICKSHAW">E-RICKSHAW</option>
                                        <option value="ELECTRIC_SCOOTER">ELECTRIC SCOOTER</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">Vehicle Model (Optional)</label>
                                    <input placeholder="e.g. Maruti Suzuki Swift" {...register("vehicleModel")} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">Plate Number (Optional)</label>
                                    <input placeholder="e.g. DL01CA1234" {...register("vehicleNumber")} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold uppercase" />
                                    <p className="text-[11px] text-zinc-400 pl-1">Format: State(2) + District(2) + Series(1-2) + Number(4)</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b pb-2 border-zinc-200">Compliance & Documents</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">License Number *</label>
                                        <input minLength={8} maxLength={20} placeholder="e.g. MH1234567890" {...register("licenseNumber", { required: true })} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">License Expiry Date (Optional)</label>
                                        <input type="date" min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} {...register("licenseExpiry")} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold" />
                                        <p className="text-[11px] text-zinc-400 pl-1">Must be a future date.</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">Registration (RC) Number *</label>
                                        <input minLength={8} maxLength={15} placeholder="e.g. MH01AB1234" {...register("rcNumber", { required: true })} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-600 block pl-1">RC Expiry Date (Optional)</label>
                                        <input type="date" min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} {...register("rcExpiry")} className="w-full bg-white border-b-2 border-zinc-200 hover:border-black p-4 outline-none transition-all font-bold" />
                                        <p className="text-[11px] text-zinc-400 pl-1">Must be a future date.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <button 
                                disabled={isSubmitting} 
                                className="w-full md:w-fit bg-black text-white px-20 py-5 rounded-full font-black text-xl hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : "Complete Registration"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <footer className="p-12 border-t border-zinc-200 text-center">
                <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">Ready to drive for Uber</p>
            </footer>
        </div>
    );
};

export default DriverRegisterPage;
