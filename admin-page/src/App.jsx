import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminAuthPage from "./pages/AdminAuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./Layout/Layout";
import OrdersPage from "./pages/OrdersPage";
import AllProducts from "./pages/AllProducts";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AdminAuthPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/products" element={<AllProducts />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
