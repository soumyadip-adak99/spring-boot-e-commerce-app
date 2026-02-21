import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import AllProducts from "./pages/AllProducts";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./utils/ScrollToTop";
import CartPage from "./pages/CartPage";
import UserAuthPage from "./pages/UserAuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ProfilePage from "./pages/ProfilePage";
import OrderProductDetailsPage from "./pages/OrderProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessOrderPage from "./pages/SuccessOrderPage";
import OAuth2RedirectPage from "./pages/OAuth2RedirectPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { Toaster } from "react-hot-toast";
import { CustomCursor } from "./components/CustomCursor";
import { ParticleField } from "./components/ParticleField";

function App() {
    return (
        <BrowserRouter>
            <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
                <div className="noise-overlay" />
                <CustomCursor />
                <ParticleField />
                
                <Toaster />
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />

                <Route
                    path="/auth/user"
                    element={
                        <PublicRoute>
                            <UserAuthPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:orderId"
                    element={
                        <ProtectedRoute>
                            <OrderProductDetailsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buy-product/:id"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product-checkout/success/:id"
                    element={
                        <ProtectedRoute>
                            <SuccessOrderPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

                <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
