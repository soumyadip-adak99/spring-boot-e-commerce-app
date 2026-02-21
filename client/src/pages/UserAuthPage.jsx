import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Eye,
    EyeOff,
    LogIn,
    ShoppingBag,
} from "lucide-react";
import { registerUser, loginUser, resetStatus } from "../features/appFeatures/authSlice";

function UserAuthPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess } = useSelector((state) => state.auth);

    const [isLoginView, setIsLoginView] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoginView) {
            dispatch(
                loginUser({
                    email: formData.email,
                    password: formData.password,
                })
            );
        } else {
            dispatch(registerUser(formData));
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        dispatch(resetStatus());
        setFormData({ first_name: "", last_name: "", email: "", password: "" });
    };

    useEffect(() => {
        window.scrollTo(0,0);
    }, [isLoginView]);

    useEffect(() => {
        if (isSuccess) {
            if (!isLoginView) {
                setTimeout(() => {
                    dispatch(resetStatus());
                    setIsLoginView(true);
                }, 1500);
            } else {
                setTimeout(() => {
                    dispatch(resetStatus());
                    navigate("/");
                }, 1000);
            }
        }
    }, [isSuccess, isLoginView, navigate, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen flex bg-[#050505] text-white relative z-10 overflow-x-hidden selection:bg-[#ea0000] selection:text-white">
            <div className="hidden lg:flex w-1/2 bg-[#050505] relative overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                <div className="noise-overlay" />

                <div className="relative z-20 flex flex-col justify-center px-24 h-full max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="mb-12">
                         <div className="w-16 h-[1px] bg-white mb-6" />
                    </div>
                    <h1 className="museo-headline text-5xl xl:text-6xl text-white leading-tight mb-8 tracking-tight clip-reveal">
                        {isLoginView ? "Welcome\nBack." : "Join Us."}
                    </h1>
                    <p className="museo-body text-lg text-white/50 leading-relaxed max-w-lg fade-in-up visible stagger-1">
                        {isLoginView
                            ? "Sign in to access your account and manage your orders."
                            : "Create an account to discover and purchase exceptional products."}
                    </p>
                </div>
            </div>

            {/* Right Auth Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-[#0a0a0a] relative">
                <Link
                    to="/"
                    className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-3 text-white/40 hover:text-white transition-colors museo-label text-[10px] tracking-widest uppercase pb-1 border-b border-transparent hover:border-white"
                >
                    <ArrowLeft size={12} />
                    <span>RETURN</span>
                </Link>

                <div className="w-full max-w-md space-y-12 animate-in slide-in-from-bottom-8 fade-in flex flex-col justify-center h-full pt-16 lg:pt-0 duration-700">
                    <div className="text-left">
                        <div className="flex mb-8 lg:hidden">
                             <div className="w-12 h-[1px] bg-white" />
                        </div>
                        <h2 className="museo-headline text-4xl text-white tracking-tight mb-4">
                            {isLoginView ? "Sign In" : "Register"}
                        </h2>
                        <p className="mt-4 text-xs text-white/40 tracking-widest museo-label">
                            {isLoginView ? "NEW USER? " : "EXISTING USER? "}
                            <button
                                onClick={toggleView}
                                className="text-white hover:text-[#ea0000] border-b border-transparent hover:border-[#ea0000] transition-colors focus:outline-none uppercase tracking-widest ml-1"
                            >
                                {isLoginView ? "CREATE ACCOUNT" : "SIGN IN"}
                            </button>
                        </p>
                    </div>

                    {isError && (
                        <div className="p-4 border border-[#ea0000]/30 bg-[#ea0000]/5 text-white museo-label text-[10px] tracking-widest uppercase flex items-center gap-4 animate-in fade-in">
                            <span className="w-1.5 h-1.5 bg-[#ea0000]" />
                            {isLoginView ? "INVALID CREDENTIALS." : "REGISTRATION FAILED. TRY AGAIN."}
                        </div>
                    )}
                    {isSuccess && (
                        <div className="p-4 border border-white/30 bg-white/5 text-white museo-label text-[10px] tracking-widest uppercase flex items-center gap-4 animate-in fade-in">
                            <span className="w-1.5 h-1.5 bg-white" />
                            {isLoginView
                                ? "LOGIN SUCCESSFUL. REDIRECTING..."
                                : "ACCOUNT CREATED. PROCEED TO SIGN IN."}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {!isLoginView && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-in slide-in-from-top-4 fade-in duration-500">
                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-[10px] text-white/40 mb-3 uppercase tracking-widest museo-label"
                                    >
                                        FIRST NAME
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-white/20" />
                                        </div>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            required={!isLoginView}
                                            className="block w-full pl-8 pr-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white transition-all museo-body text-sm"
                                            placeholder="John"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block text-[10px] text-white/40 mb-3 uppercase tracking-widest museo-label"
                                    >
                                        LAST NAME
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-white/20" />
                                        </div>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            required={!isLoginView}
                                            className="block w-full pl-8 pr-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white transition-all museo-body text-sm"
                                            placeholder="Doe"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[10px] text-white/40 mb-3 uppercase tracking-widest museo-label"
                            >
                                EMAIL ADDRESS
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-white/20" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-8 pr-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white transition-all museo-body text-sm"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label
                                    htmlFor="password"
                                    className="block text-[10px] text-white/40 uppercase tracking-widest museo-label"
                                >
                                    PASSWORD
                                </label>
                                {isLoginView && (
                                    <a
                                        href="#"
                                        className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest museo-label"
                                    >
                                        FORGOT PASSWORD?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-white/20" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-8 pr-12 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white transition-all museo-body text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-0 flex items-center text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {!isLoginView && (
                            <div className="flex items-start animate-in fade-in pt-4">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="mt-0.5 h-4 w-4 text-[#ea0000] focus:ring-[#ea0000] bg-transparent border-white/20 rounded-none cursor-pointer accent-[#ea0000]"
                                />
                                <label htmlFor="terms" className="ml-4 block text-[10px] text-white/50 tracking-widest uppercase museo-label leading-relaxed">
                                    I ACCEPT THE{" "}
                                    <a
                                        href="#"
                                        className="text-white hover:text-[#ea0000] transition-colors border-b border-white/30 hover:border-[#ea0000] pb-0.5"
                                    >
                                        TERMS OF SERVICE
                                    </a>{" "}
                                    AND{" "}
                                    <a
                                        href="#"
                                        className="text-white hover:text-[#ea0000] transition-colors border-b border-white/30 hover:border-[#ea0000] pb-0.5"
                                    >
                                        PRIVACY POLICY
                                    </a>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || isSuccess}
                            className="w-full py-5 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white mt-8 museo-label flex justify-center items-center"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-3">
                                    <Loader2 className="animate-spin h-3 w-3" /> PROCESSING...
                                </span>
                            ) : (
                                <span className="flex items-center gap-3">
                                    {isLoginView ? "SIGN IN" : "REGISTER"}
                                    {isLoginView ? (
                                        <LogIn className="h-3 w-3" strokeWidth={2} />
                                    ) : (
                                        <ArrowRight className="h-3 w-3" strokeWidth={2} />
                                    )}
                                </span>
                            )}
                        </button>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-[9px] tracking-widest museo-label">
                                <span className="px-6 bg-[#0a0a0a] text-white/30 uppercase">
                                    OR
                                </span>
                            </div>
                        </div>

                        {/* Google Sign-In Button */}
                        <a
                            href={`${import.meta.env.VITE_BACKEND_BASE_API?.replace("/api/v1", "")}/oauth2/authorization/google`}
                            className="w-full flex items-center justify-center gap-4 py-4 border border-white/10 text-[10px] text-white/60 hover:text-white hover:border-white transition-all uppercase tracking-widest museo-label"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            CONTINUE WITH GOOGLE
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserAuthPage;
