import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import { getUserDetails } from "../features/appFeatures/authSlice";

function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading } = useSelector((state) => state.auth);

    const cartItems = user?.cart_items || [];

    useEffect(() => {
        dispatch(getUserDetails());
        window.scrollTo(0, 0);
    }, [dispatch]);

    const handleRemoveItem = async (productId) => {
        if (!productId) return;
        try {
            const { removeFromCart } = await import("../features/cart/cartAction");
            await dispatch(removeFromCart(productId)).unwrap();
            dispatch(getUserDetails());
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const handleQuantityChange = async (productId, currentQty, change) => {
        const newQuantity = currentQty + change;
        if (newQuantity < 1) return;

        try {
            const { updateCartQuantity } = await import("../features/cart/cartAction");
            await dispatch(updateCartQuantity({ productId, quantity: newQuantity })).unwrap();
            dispatch(getUserDetails());
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const productData = item.product || item;
        const price = Number(productData.price) || 0;
        const qty = Number(item.quantity) || 1;
        return acc + price * qty;
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] relative z-10 text-[#f0f0f0]">
                <Loader2 className="animate-spin h-8 w-8 text-white/50" />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-4 relative z-10 text-center">
                <ShoppingBag size={48} className="text-white/20 mb-8" strokeWidth={1} />
                <h2 className="museo-headline text-3xl md:text-4xl text-white mb-6">Your cart is empty</h2>
                <p className="museo-body text-white/50 mb-10 max-w-sm">
                    Discover our latest products and add them to your cart.
                </p>
                <Link
                    to="/products"
                    className="museo-label px-10 py-4 border border-white/20 hover:bg-white hover:text-black transition-colors"
                >
                    View Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] font-sans text-[#f0f0f0] relative z-10 pb-24 selection:bg-[#ea0000] selection:text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 mt-24">
                <div className="flex items-center gap-2 mb-12 fade-in-up visible stagger-1">
                    <Link
                        to="/products"
                        className="museo-label text-white/40 hover:text-white flex items-center gap-3 transition-colors"
                    >
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                <h1 className="museo-headline text-5xl md:text-6xl lg:text-7xl mb-16 clip-reveal">Cart.</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 fade-in-up visible stagger-2">
                    {/* Left side - Items */}
                    <div className="lg:col-span-8">
                        <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 museo-label text-white/50">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-3 text-right">Price</div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {cartItems.map((item) => {
                                const product = item.product || item;
                                const productId = product.id;
                                const qty = item.quantity || 1;

                                return (
                                    <div
                                        key={productId}
                                        className="py-8 transition-colors group"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                                            <div className="sm:col-span-6 flex items-start sm:items-center gap-6">
                                                <div className="h-32 w-24 shrink-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.product_name}
                                                            className="h-full w-full object-contain transition-all duration-700 hover:scale-105"
                                                        />
                                                    ) : (
                                                        <ShoppingBag size={24} className="text-white/10" />
                                                    )}
                                                </div>
                                                <div className="flex-1 mt-2 sm:mt-0">
                                                    <Link to={`/product/${productId}`}>
                                                        <h3 className="museo-headline text-lg sm:text-xl text-white mb-2 hover:text-[#ea0000] transition-colors leading-tight">
                                                            {product.product_name || "Untitled Product"}
                                                        </h3>
                                                    </Link>
                                                    <p className="museo-label text-white/40 mb-4">
                                                        {product.brand || "Independent"}
                                                    </p>
                                                    <button
                                                        onClick={() => handleRemoveItem(productId)}
                                                        className="museo-label text-white/30 hover:text-[#ea0000] flex items-center gap-2 transition-colors border-b border-transparent hover:border-[#ea0000] pb-0.5"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="sm:col-span-3 flex justify-between sm:justify-center items-center">
                                                <span className="sm:hidden museo-label text-white/50">
                                                    Quantity:
                                                </span>
                                                <div className="flex items-center gap-4 border border-white/20 px-3 py-2">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(productId, qty, -1)
                                                        }
                                                        className="text-white/40 hover:text-white transition-colors disabled:opacity-20"
                                                        disabled={qty <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="museo-body w-6 text-center text-white">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(productId, qty, 1)
                                                        }
                                                        className="text-white/40 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="sm:col-span-3 flex justify-between sm:block text-right">
                                                <span className="sm:hidden museo-label text-white/50">
                                                    Price:
                                                </span>
                                                <div>
                                                    <span className="museo-body text-white/60 block sm:hidden">
                                                        ₹{(Number(product.price) || 0).toLocaleString()} x {qty}
                                                    </span>
                                                    <span className="museo-headline text-xl text-white">
                                                        ₹{((Number(product.price) || 0) * qty).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side - Order Summary */}
                    <div className="lg:col-span-4 shrink-0">
                        <div className="sticky top-12 bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 fade-in-up visible stagger-3">
                            <h2 className="museo-headline text-2xl mb-8 border-b border-white/10 pb-6">Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between museo-body text-white/60">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between museo-body text-white/60">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="border-t border-white/10 pt-6 mt-6">
                                    <div className="flex justify-between items-end">
                                        <span className="museo-label text-white/60">Total Amount</span>
                                        <span className="museo-headline text-3xl md:text-4xl text-white">
                                            ₹{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (cartItems.length > 0) {
                                        navigate("/checkout");
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-4 bg-white text-black py-5 px-6 museo-label hover:bg-[#ea0000] hover:text-white transition-all min-h-[60px]"
                            >
                                Checkout <ArrowRight size={16} />
                            </button>

                            <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4 justify-center text-white/30">
                                <ShieldCheck size={20} />
                                <span className="museo-label text-[10px] leading-tight text-white/40">Encrypted<br/>Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
