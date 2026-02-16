import React, { useState, useEffect } from "react";
import { X, Star, Truck, ShieldCheck, Minus, Plus, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductModal({ product, onClose }) {
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        }

        const handleEsc = (e) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [product]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    if (!product) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            className={`fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
                isVisible ? "visible" : "invisible"
            }`}
        >
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            <div
                className={`bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row transition-all duration-300 ease-out transform ${
                    isVisible
                        ? "scale-100 translate-y-0 opacity-100"
                        : "scale-95 translate-y-8 opacity-0"
                }`}
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-30 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm border border-gray-100 group"
                >
                    <X
                        size={20}
                        className="group-hover:rotate-90 transition-transform duration-300"
                    />
                </button>

                <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 relative shrink-0 group select-none flex items-center justify-center p-6 lg:p-12">
                    <img
                        src={product.image}
                        alt={product.product_name}
                        className="max-h-full max-w-full object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />

                    {product.status && (
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                            <span
                                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                                    product.status === "IN_STOCK"
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : product.status === "OUT_OF_STOCK"
                                          ? "bg-red-100 text-red-800 border border-red-200"
                                          : "bg-blue-100 text-blue-800 border border-blue-200"
                                }`}
                            >
                                {product.status.replace("_", " ")}
                            </span>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/2 flex flex-col bg-white h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 custom-scrollbar">
                        <div className="mb-6">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
                                    {product.category || "General"}
                                </span>
                                <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2 py-1 rounded-md">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-xs font-bold text-amber-700 ml-1">
                                        4.8
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3 sm:mb-4">
                                {product.product_name}
                            </h2>

                            <div className="flex items-center flex-wrap gap-3 pb-6 border-b border-gray-100">
                                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-lg text-gray-400 line-through decoration-gray-300 decoration-2">
                                    {formatPrice(product.price * 1.2)}
                                </span>
                                <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded-full uppercase tracking-wide">
                                    Save 20%
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-sm prose-gray text-gray-500 leading-relaxed mb-8">
                            <p>
                                {product.product_description ||
                                    "Experience premium quality with this meticulously designed product. Built for durability and style, it perfectly blends functionality with modern aesthetics for everyday use."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 shrink-0">
                                    <Truck size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Free Shipping</p>
                                    <p className="text-[10px] text-gray-500">2-3 business days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 shrink-0">
                                    <ShieldCheck size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">
                                        Lifetime Support
                                    </p>
                                    <p className="text-[10px] text-gray-500">24/7 assistance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:p-8 bg-white border-t border-gray-100 mt-auto">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <span className="text-sm font-semibold text-gray-700">Quantity</span>
                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-white text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all rounded-md shadow-sm"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center font-bold text-gray-900 text-sm">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-white text-gray-600 hover:text-gray-900 transition-all rounded-md shadow-sm"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            <button
                                onClick={() => navigate(`/buy-product/${product?.id}`)}
                                className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                <span>Buy Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
