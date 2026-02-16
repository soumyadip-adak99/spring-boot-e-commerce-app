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
        <div className="min-h-screen flex bg-gray-50">
            <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-violet-700 opacity-90" />
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                    alt="Shopping Experience"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                />

                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                ></div>

                <div className="relative z-10 flex flex-col justify-center px-16 text-white h-full max-w-2xl">
                    <div className="mb-8 p-3 bg-white/10 backdrop-blur-sm w-fit rounded-xl">
                        <ShoppingBag size={32} />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
                        {isLoginView ? "Welcome back to ShopHub." : "Start your journey with us."}
                    </h1>
                    <p className="text-lg text-indigo-100 leading-relaxed font-light">
                        {isLoginView
                            ? "Access your saved items, track orders, and get personalized recommendations in one place."
                            : "Join thousands of shoppers discovering the best deals and exclusive products every day."}
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white relative">
                <Link
                    to="/"
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
                >
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium text-sm">Back to Home</span>
                </Link>

                <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                        <div className="flex justify-center mb-4 lg:hidden">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <ShoppingBag size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {isLoginView ? "Sign in to account" : "Create free account"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {isLoginView ? "New here? " : "Already have an account? "}
                            <button
                                onClick={toggleView}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none"
                            >
                                {isLoginView ? "Create an account" : "Sign in"}
                            </button>
                        </p>
                    </div>

                    {isError && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2 animate-in fade-in">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                            {"Email and Password is incorrect" ||
                                "Action failed. Please try again."}
                        </div>
                    )}
                    {isSuccess && (
                        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-100 flex items-center gap-2 animate-in fade-in">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                            {isLoginView
                                ? "Login successful! Redirecting..."
                                : "Account created successfully! Switching..."}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLoginView && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            required={!isLoginView}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-gray-200/50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                            placeholder="John"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            required={!isLoginView}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-gray-200/50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
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
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-gray-200/50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                {isLoginView && (
                                    <a
                                        href="#"
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-gray-200/50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {!isLoginView && (
                            <div className="flex items-center animate-in fade-in">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="terms" className="ml-2 block text-xs text-gray-600">
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="font-medium text-gray-900 hover:underline"
                                    >
                                        Terms
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="#"
                                        className="font-medium text-gray-900 hover:underline"
                                    >
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || isSuccess}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-4 w-4" /> Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLoginView ? "Sign In" : "Create Account"}
                                    {isLoginView ? (
                                        <LogIn className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                    ) : (
                                        <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                    )}
                                </span>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                            </div>
                        </div>

                        {/* Google Sign-In Button */}
                        <a
                            href={`${import.meta.env.VITE_BACKEND_BASE_API?.replace("/api/v1", "")}/oauth2/authorization/google`}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                            Continue with Google
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserAuthPage;
