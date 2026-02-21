import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, ArrowLeft, Package, MapPin, Calendar, CreditCard } from "lucide-react";
import { getProductById } from "../features/product/productAction";

function SuccessOrderPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { product, isLoading } = useSelector((state) => state.product);

    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }

        setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
        window.scrollTo(0,0);
    }, [id, dispatch]);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    if (isLoading || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] relative z-10 text-white">
                <p className="museo-label text-[10px] text-white/40 tracking-widest uppercase">Completing Order...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 lg:p-12 font-sans text-white relative z-10 selection:bg-[#ea0000] selection:text-white pb-32">
            <div className="w-full max-w-4xl border border-white/5 bg-[#0a0a0a] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="border-b border-white/5 p-12 lg:p-20 text-center relative overflow-hidden bg-white/5">
                    <div className="mx-auto w-16 h-16 border border-white/20 bg-white text-black flex items-center justify-center mb-8">
                        <CheckCircle size={24} strokeWidth={1.5} />
                    </div>
                    <h1 className="museo-headline text-4xl lg:text-5xl text-white mb-6 tracking-tight">Order Confirmed.</h1>
                    <p className="museo-body text-white/50 text-lg max-w-lg mx-auto mb-10">
                        Your transaction was successful. Your items are being prepared for dispatch.
                    </p>
                    <div className="inline-flex flex-col items-center">
                        <span className="museo-label text-[10px] text-white/40 tracking-[0.2em] uppercase mb-2">Transaction ID</span>
                        <span className="museo-headline text-xl text-white tracking-widest border-b border-white/20 pb-1">{orderId}</span>
                    </div>
                </div>

                <div className="p-8 lg:p-16 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 space-y-12">
                        <div>
                            <h2 className="museo-headline text-2xl text-white mb-8 pb-4 border-b border-white/5">Item Details</h2>

                            <div className="flex flex-col sm:flex-row gap-8 bg-[#111] border border-white/5 p-6 hover:border-white/20 transition-colors">
                                <div className="w-full sm:w-32 h-32 bg-[#050505] border border-white/5 flex items-center justify-center p-4">
                                    <img
                                        src={product.image}
                                        alt={product.product_name}
                                        className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <span className="museo-label text-[10px] text-white/40 tracking-widest uppercase mb-2">
                                        {product.category}
                                    </span>
                                    <h3 className="museo-headline text-2xl text-white mb-4">
                                        {product.product_name}
                                    </h3>
                                    <div className="flex justify-between items-end mt-auto">
                                        <span className="museo-label text-[10px] text-white/40 tracking-widest uppercase">QTY: 1</span>
                                        <span className="museo-headline text-xl text-white">₹{product.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-72 shrink-0 space-y-10">
                        <div>
                            <h2 className="museo-headline text-lg text-white mb-6 pb-4 border-b border-white/5 flex items-center gap-3">
                                <Calendar size={16} className="text-white/40" /> Logistics
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="museo-label text-[10px] text-white/40 tracking-widest uppercase mb-1">Expected Arrival</p>
                                    <p className="museo-body text-white">{formattedDate}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <p className="museo-label text-[10px] text-white/40 tracking-widest uppercase mb-1">Standard Delivery</p>
                                    <p className="museo-body text-white">Courier service</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="museo-headline text-lg text-white mb-6 pb-4 border-b border-white/5 flex items-center gap-3">
                                <CreditCard size={16} className="text-white/40" /> Payment Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="museo-label text-[10px] text-white/40 tracking-widest uppercase">Product</span>
                                    <span className="museo-body text-white">₹{product.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="museo-label text-[10px] text-white/40 tracking-widest uppercase">Shipping</span>
                                    <span className="museo-body text-[#ea0000]">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                    <span className="museo-label text-[10px] text-white tracking-widest uppercase">TOTAL AMOUNT</span>
                                    <span className="museo-headline text-2xl text-white">₹{product.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 border-t border-white/5 bg-[#111] flex justify-center text-center">
                    <button
                        onClick={() => navigate("/products")}
                        className="museo-label text-[10px] tracking-[0.2em] uppercase border border-white/20 text-white flex items-center gap-4 px-10 py-5 hover:bg-white hover:text-black transition-all"
                    >
                        <ArrowLeft size={12} />
                        CONTINUE SHOPPING
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessOrderPage;
