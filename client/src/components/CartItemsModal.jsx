import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartItemsModal({ userCartItems, totalPrice }) {
    const navigate = useNavigate();

    return (
        <div className="absolute right-0 mt-6 w-96 bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="px-6 py-5 border-b border-white/5 bg-[#050505] flex justify-between items-center">
                <h3 className="museo-headline text-white tracking-widest text-lg">CART</h3>
                <span className="museo-label text-[9px] text-white/40 tracking-[0.2em] uppercase border border-white/10 px-3 py-1">
                    {userCartItems.length} ITEMS
                </span>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {userCartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="mb-6 text-white/20">
                            <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                        <p className="museo-headline text-white text-xl mb-2 tracking-wide">Empty Cart</p>
                        <p className="museo-body text-xs text-white/40 max-w-[200px] leading-relaxed">
                            No products have been added to your cart.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {userCartItems.map((item) => (
                            <div
                                key={item.id || Math.random()}
                                className="flex items-center gap-6 p-6 hover:bg-white/5 transition-colors group"
                            >
                                <div className="h-16 w-16 shrink-0 bg-[#050505] border border-white/10 flex items-center justify-center text-white/20 group-hover:border-white/30 transition-colors">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.product_name}
                                            className="h-full w-full object-contain transition-all duration-500 hover:scale-105"
                                        />
                                    ) : (
                                        <ShoppingBag size={20} strokeWidth={1.5} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="museo-headline text-base text-white truncate mb-1">
                                        {item.product_name || item.name || "UNNAMED PRODUCT"}
                                    </h4>
                                    <p className="museo-label text-[9px] text-white/40 tracking-[0.2em] uppercase mt-2">
                                        QTY: {item.quantity || 1}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="museo-headline text-lg text-white tracking-wide">
                                        ₹{(item.price || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {userCartItems.length > 0 && (
                <div className="p-6 bg-[#050505] border-t border-white/5">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <span className="block museo-label text-[10px] text-white/40 tracking-[0.2em] uppercase mb-1">SUBTOTAL</span>
                            <p className="museo-body text-[10px] text-white/30 italic">Shipping calculated at checkout</p>
                        </div>
                        <span className="museo-headline text-2xl text-white tracking-widest">
                            ₹{totalPrice.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-white text-white hover:text-black py-4 border border-white/20 transition-all active:scale-[0.98] museo-label text-[10px] tracking-[0.2em] uppercase group"
                    >
                        PROCEED TO CHECKOUT
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
}
