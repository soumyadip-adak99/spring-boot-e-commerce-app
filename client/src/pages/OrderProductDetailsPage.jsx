import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Calendar, Package, Download, ShoppingBag, Phone, Mail } from "lucide-react";

export default function OrderProductDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const safeUser = user || JSON.parse(localStorage.getItem("user")) || {};

    const order = safeUser.orders?.find((o) => o.id === orderId);

    const shippingAddress =
        safeUser.address && safeUser.address.length > 0 ? safeUser.address[0] : null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative z-10 text-white">
                <Package className="h-16 w-16 text-white/20 mb-6" />
                <h2 className="museo-headline text-2xl tracking-wide">ORDER NOT FOUND</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 museo-label text-[10px] tracking-widest text-[#ea0000] border-b border-transparent hover:border-[#ea0000] transition-colors"
                >
                    RETURN TO ORDERS
                </button>
            </div>
        );
    }

    const OrderStatusStepper = ({ status }) => {
        const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
        let currentStep = 0;
        if (status === "Shipped") currentStep = 1;
        if (status === "Out for Delivery") currentStep = 2;
        if (status === "Delivered") currentStep = 3;

        return (
            <div className="w-full py-8 border-t border-b border-white/5 my-8">
                <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[1px] bg-white/10 z-0"></div>
                    <div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[1px] bg-white transition-all duration-700 z-0"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div
                                key={step}
                                className="flex flex-col items-center z-10 relative bg-[#0a0a0a] px-2 p-1"
                            >
                                <div
                                    className={`w-3 h-3 flex items-center justify-center transition-all duration-500 mb-2 ${
                                        isCompleted
                                            ? "bg-white"
                                            : "bg-transparent border border-white/20"
                                    }`}
                                />
                                <span
                                    className={`museo-label text-[8px] absolute -bottom-5 text-center uppercase tracking-[0.2em] transition-colors w-20 ${
                                        isCurrent ? "text-white" : "text-white/40"
                                    }`}
                                >
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative z-10 overflow-x-hidden selection:bg-[#ea0000] selection:text-white">
            <div className="bg-[#050505] h-64 w-full relative overflow-hidden border-b border-white/5">
                <div className="noise-overlay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-difference pointer-events-none">
                    <h1 className="text-[12vw] font-medium text-white/90 tracking-tighter leading-none museo-headline opacity-10">
                        {order.id.slice(-6).toUpperCase()}
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 -mt-24 relative z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-white/40 hover:text-white transition-colors museo-label text-[10px] tracking-widest uppercase pb-1 border-b border-transparent hover:border-white mb-12 w-fit bg-[#050505] px-2 py-1"
                >
                    <ArrowLeft size={12} /> BACK TO ORDERS
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 space-y-12">
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6">
                                <div>
                                    <h1 className="museo-headline text-3xl text-white tracking-widest mb-3">
                                        ORDER{" "}
                                        <span className="text-white/40">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </span>
                                    </h1>
                                    <div className="flex items-center gap-4 text-white/40 museo-label text-[10px] tracking-widest uppercase mb-4">
                                        <Calendar size={12} strokeWidth={1.5} />
                                        <span>
                                            INITIATED ON{" "}
                                            {formatDate(
                                                order.createdAt || new Date().toISOString()
                                            )}
                                        </span>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] border ${
                                            order.status === "Delivered"
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-white/60 border-white/20"
                                        }`}
                                    >
                                        STATUS: {order.status}
                                    </span>
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white/60 hover:text-white museo-label text-[10px] tracking-widest uppercase border border-white/20 hover:border-white transition-colors">
                                        <Download size={12} strokeWidth={1.5} /> INVOICE
                                    </button>
                                </div>
                            </div>

                            <OrderStatusStepper status={order.status} />
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            <h2 className="museo-headline text-xl text-white tracking-widest mb-6 py-4 border-b border-white/5">
                                ITEMS
                            </h2>

                            <div className="space-y-6">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row items-start gap-8 bg-[#0a0a0a] border border-white/5 p-6 hover:border-white/20 transition-colors group"
                                        >
                                            <div className="h-32 w-32 bg-[#050505] border border-white/5 shrink-0 flex items-center justify-center p-4">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.product_name}
                                                        className="h-full w-full object-contain transition-all duration-700 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="text-white/20">
                                                        <ShoppingBag size={24} strokeWidth={1} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 w-full flex flex-col justify-between h-full pt-2">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="museo-label text-[9px] text-white/40 tracking-[0.2em] uppercase">
                                                            {item.category}
                                                        </span>
                                                        <span className="museo-headline text-lg text-white">
                                                            ₹{item.price.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="museo-headline text-xl text-white mb-2 decoration-white/30 truncate max-w-[90%]">
                                                        {item.product_name}
                                                    </h3>
                                                </div>

                                                <div className="mt-8 flex items-center gap-6 text-[10px] text-white/40 uppercase tracking-widest museo-label">
                                                    <span>QTY: {item.quantity || 1}</span>
                                                    <span className="w-[1px] h-3 bg-white/20"></span>
                                                    <span>
                                                        REF:{" "}
                                                        {item.product_id.slice(-8).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-start gap-8 bg-[#0a0a0a] border border-white/5 p-6 hover:border-white/20 transition-colors group">
                                        <div className="h-32 w-32 bg-[#050505] border border-white/5 shrink-0 flex items-center justify-center p-4">
                                            {order.image ? (
                                                <img
                                                    src={order.image}
                                                    alt={order.product_name}
                                                    className="h-full w-full object-contain transition-all duration-700 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="text-white/20">
                                                    <ShoppingBag size={24} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 w-full flex flex-col justify-between h-full pt-2">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="museo-label text-[9px] text-white/40 tracking-[0.2em] uppercase">
                                                        {order.category}
                                                    </span>
                                                    <span className="museo-headline text-lg text-white">
                                                        ₹{order.price.toLocaleString()}
                                                    </span>
                                                </div>
                                                <h3 className="museo-headline text-xl text-white mb-2">
                                                    {order.product_name}
                                                </h3>
                                            </div>

                                            <div className="mt-8 flex items-center gap-6 text-[10px] text-white/40 uppercase tracking-widest museo-label">
                                                <span>QTY: 1</span>
                                                <span className="w-[1px] h-3 bg-white/20"></span>
                                                <span>REF: {order.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[320px] shrink-0 space-y-12">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <h3 className="museo-headline text-lg text-white mb-6 flex items-center gap-3 tracking-widest border-b border-white/5 pb-4">
                                PAYMENT SUMMARY
                            </h3>
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between museo-label text-[10px] tracking-widest text-white/60">
                                    <span>SUBTOTAL</span>
                                    <span className="text-white">
                                        ₹{order.price.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between museo-label text-[10px] tracking-widest text-white/60">
                                    <span>SHIPPING</span>
                                    <span className="text-white">FREE</span>
                                </div>
                                <div className="border-t border-white/5 pt-6 mt-6 flex justify-between items-end">
                                    <span className="museo-label text-[10px] text-white uppercase tracking-widest">
                                        TOTAL AMOUNT
                                    </span>
                                    <span className="museo-headline text-xl text-white">
                                        ₹{order.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <h3 className="museo-headline text-lg text-white mb-6 flex items-center gap-3 tracking-widest border-b border-white/5 pb-4">
                                SHIPPING DETAILS
                            </h3>

                            {shippingAddress ? (
                                <div className="museo-body text-sm text-white/50 space-y-2 font-light leading-relaxed">
                                    <p className="museo-headline text-white text-base mb-4 tracking-wide">
                                        {shippingAddress.name ||
                                            `${safeUser.first_name} ${safeUser.last_name}`}
                                    </p>
                                    <p>
                                        {shippingAddress.house_no}
                                        {shippingAddress.landmark
                                            ? `, ${shippingAddress.landmark}`
                                            : ""}
                                    </p>
                                    <p>
                                        {shippingAddress.area}, {shippingAddress.city}
                                    </p>
                                    <p>
                                        {shippingAddress.state}{" "}
                                        <span className="text-white ml-2">
                                            {shippingAddress.pin_code}
                                        </span>
                                    </p>

                                    <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                                        <p className="flex items-center gap-4 text-white/60 museo-label text-[10px] tracking-widest">
                                            <Phone
                                                size={12}
                                                strokeWidth={1.5}
                                                className="text-white/30"
                                            />
                                            {shippingAddress.phone_number}
                                        </p>
                                        <p className="flex items-center gap-4 text-white/60 museo-label text-[10px] tracking-widest">
                                            <Mail
                                                size={12}
                                                strokeWidth={1.5}
                                                className="text-white/30"
                                            />
                                            {safeUser.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-white/5 border border-white/10">
                                    <p className="text-white/30 text-[10px] tracking-widest uppercase museo-label">
                                        NO ADDRESS FOUND
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
