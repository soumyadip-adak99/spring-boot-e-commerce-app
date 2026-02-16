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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Completing sign in...</p>
            </div>
        </div>
    );
}

export default OAuth2RedirectPage;
