import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
