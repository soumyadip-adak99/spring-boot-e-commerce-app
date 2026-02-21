import { useState } from "react";
import { X, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { loginUser } from "../features/appFeatures/authSlice";

export default function LoginModal({ onClose, dispatch, isLoading, isError, errorMessage }) {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#050505] border border-white/10 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
                    <h2 className="museo-headline text-2xl text-white tracking-wide">SIGN IN</h2>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="p-8">
                    {isError && (
                        <div className="mb-6 p-4 border border-[#ea0000]/30 bg-[#ea0000]/5 text-white museo-label text-[10px] tracking-widest uppercase">
                            {errorMessage || "INVALID CREDENTIALS."}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block museo-label text-[10px] text-white/40 uppercase tracking-widest mb-3">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white transition-all museo-body text-sm"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block museo-label text-[10px] text-white/40 uppercase tracking-widest mb-3">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white transition-all museo-body text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                             <a
                                href="#"
                                className="museo-label text-[9px] text-white/40 hover:text-white tracking-widest uppercase transition-colors"
                            >
                                FORGOT PASSWORD?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white mt-8 museo-label flex justify-center items-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    PROCESSING...
                                </>
                            ) : (
                                <>
                                    SIGN IN <ArrowRight size={12} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-6 bg-[#0a0a0a] border-t border-white/5 text-center">
                    <p className="museo-label text-[9px] tracking-widest text-white/40 uppercase">
                        NOT A MEMBER?{" "}
                        <Link
                            to="/auth"
                            onClick={onClose}
                            className="text-white hover:text-[#ea0000] border-b border-transparent hover:border-[#ea0000] transition-colors ml-2 pb-0.5"
                        >
                            SIGN UP
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
