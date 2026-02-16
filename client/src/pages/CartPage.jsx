import React, { useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUserDetails } from "../features/appFeatures/authSlice";

function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading } = useSelector((state) => state.auth);

    const cartItems = user?.cart_items || [];

    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch]);

    const handleRemoveItem = async (productId) => {
        if (!productId) return;
        try {
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={64} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Go ahead and explore our
                    top categories.
                </p>
                <Link
                    to="/products"
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                    <Link
                        to="/products"
                        className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => {
                                    const product = item.product || item;
                                    const productId = product.id;
                                    const qty = item.quantity || 1;

                                    return (
                                        <div
                                            key={productId}
                                            className="p-6 transition-colors hover:bg-gray-50/30"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                                                <div className="sm:col-span-6 flex items-center gap-4">
                                                    <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.product_name}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <ShoppingBag size={24} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                                            {product.product_name || "Product Name"}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            Category:{" "}
                                                            {product.category || "General"}
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveItem(productId)
                                                            }
                                                            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                                        >
                                                            <Trash2 size={12} /> Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2 flex justify-between sm:justify-center items-center">
                                                    <span className="sm:hidden text-xs font-medium text-gray-500">
                                                        Qty:
                                                    </span>
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                        <button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    productId,
                                                                    qty,
                                                                    -1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 disabled:opacity-50"
                                                            disabled={qty <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-semibold w-4 text-center">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    productId,
                                                                    qty,
                                                                    1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="hidden sm:block sm:col-span-2 text-right text-sm text-gray-600">
                                                    ₹{(Number(product.price) || 0).toLocaleString()}
                                                </div>

                                                <div className="sm:col-span-2 flex justify-between sm:block text-right">
                                                    <span className="sm:hidden text-sm font-medium text-gray-500">
                                                        Total:
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        ₹
                                                        {(
                                                            (Number(product.price) || 0) * qty
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        ₹{subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="font-medium  text-green-600">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-bold text-gray-900">
                                            Order Total
                                        </span>
                                        <span className="text-xl font-bold text-indigo-600">
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
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Checkout <ArrowRight size={18} />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-3 rounded-lg">
                                <ShieldCheck size={16} className="text-gray-400" />
                                <span>Secure SSL Encrypted Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
