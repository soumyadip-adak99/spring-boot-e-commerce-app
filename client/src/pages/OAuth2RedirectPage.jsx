import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/appFeatures/authSlice";

function OAuth2RedirectPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Store token in localStorage
            localStorage.setItem("jwtToken", token);

            // Dispatch to Redux store
            dispatch(setCredentials({ token }));

            // Redirect to home
            navigate("/", { replace: true });
        } else {
            // No token — redirect to auth with error
            navigate("/auth/user?error=oauth_failed", { replace: true });
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-0" />
            
            <div className="text-center relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-t-2 border-highlight animate-spin shadow-glow"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-white/20 animate-spin flex-reverse hidden"></div>
                </div>
                <p className="text-white/50 text-sm font-bold uppercase tracking-widest animate-pulse">
                    Completing sign in...
                </p>
            </div>
        </div>
    );
}

export default OAuth2RedirectPage;
