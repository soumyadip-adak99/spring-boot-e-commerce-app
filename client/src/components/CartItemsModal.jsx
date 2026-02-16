import React from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartItemsModal({ userCartItems, totalPrice }) {
    const navigate = useNavigate();

    return (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">
            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm">Shopping Cart</h3>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {userCartItems.length} Items
                </span>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {userCartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-300">
                            <ShoppingBag size={40} strokeWidth={1.5} />
                        </div>
                        <p className="text-gray-900 font-medium">Your cart is empty</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {userCartItems.map((item) => (
                            <div
                                key={item._id || Math.random()}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors group"
                            >
                                <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.product_name}
                                            className="h-full w-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <ShoppingBag size={18} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                        {item.product_name || item.name || "Product"}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Qty:{" "}
                                        <span className="font-medium text-gray-700">
                                            {item.quantity || 1}
                                        </span>
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                        ₹{(item.price || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {userCartItems.length > 0 && (
                <div className="p-5 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <span className="block text-xs text-gray-900 mb-1">Subtotal</span>
                            <p className="text-xs text-gray-800">Shipping calculated at checkout</p>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            ₹{totalPrice.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                    >
                        View Cart & Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
