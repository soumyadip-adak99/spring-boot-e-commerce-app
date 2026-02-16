import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Package,
    Truck,
    CheckCircle,
    Clock,
    Download,
    HelpCircle,
    ShoppingBag,
    CreditCard,
    Tag,
    Phone,
} from "lucide-react";

export default function OrderProductDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const safeUser = user || JSON.parse(localStorage.getItem("user")) || {};

    const order = safeUser.orders?.find((o) => o._id === orderId);

    const shippingAddress =
        safeUser.address && safeUser.address.length > 0 ? safeUser.address[0] : null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-indigo-600 hover:underline font-medium"
                >
                    Go back to Profile
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
            <div className="w-full py-6">
                <div className="relative flex items-center justify-between w-full">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
                    <div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 z-0 rounded-full"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step} className="flex flex-col items-center z-10">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isCompleted
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "bg-white border-gray-300 text-gray-300"
                                    }`}
                                >
                                    {isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}
                                </div>
                                <span
                                    className={`text-[10px] sm:text-xs font-semibold mt-2 absolute -bottom-6 w-24 text-center ${
                                        isCurrent ? "text-indigo-700" : "text-gray-500"
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
        <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
            <div className="bg-indigo-600 h-64 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-violet-800 opacity-90" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/90 hover:text-white mb-6 hover:bg-white/10 w-fit px-3 py-1.5 rounded-full transition-all"
                >
                    <ArrowLeft size={18} /> Back to Orders
                </button>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Order #{order._id.slice(-6).toUpperCase()}
                                        </h1>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                                order.status === "Delivered"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-blue-50 text-blue-700 border-blue-100"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                        <Calendar size={14} />
                                        Placed on{" "}
                                        {formatDate(order.createdAt || new Date().toISOString())}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                        <Download size={16} /> Invoice
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                        <Truck size={16} /> Track
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 mb-4 px-2">
                                <OrderStatusStepper status={order.status} />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Package size={18} className="text-indigo-600" /> Order Items
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-5">
                                    <div className="h-24 w-24 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                        {order.image ? (
                                            <img
                                                src={order.image}
                                                alt={order.product_name}
                                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <ShoppingBag size={32} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 mb-2">
                                                    <Tag size={10} /> {order.category}
                                                </span>
                                                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                                    {order.product_name}
                                                </h3>
                                            </div>
                                            <p className="font-bold text-gray-900 text-lg">
                                                ₹{order.price}
                                            </p>
                                        </div>

                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                            {order.product_description ||
                                                "No description available."}
                                        </p>

                                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                                            <span>Qty: 1</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="font-mono">ID: {order._id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard size={18} className="text-indigo-600" /> Payment Summary
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{order.price}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Tax (Inclusive)</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Paid</span>
                                    <span className="font-bold text-indigo-600 text-lg">
                                        ₹{order.price}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-indigo-600" /> Shipping Details
                            </h3>

                            {shippingAddress ? (
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">
                                            {shippingAddress.name ||
                                                `${safeUser.first_name} ${safeUser.last_name}`}
                                        </p>

                                        <p>
                                            {shippingAddress.house_no}, {shippingAddress.landmark}
                                        </p>

                                        <p>
                                            {shippingAddress.area}, {shippingAddress.city}
                                        </p>

                                        <p>
                                            {shippingAddress.state} - {shippingAddress.pin_code}
                                        </p>
                                        <p>{shippingAddress.country}</p>
                                    </div>

                                    <div className="pt-2 border-t border-gray-50 space-y-1">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <Phone size={14} className="text-gray-400" />{" "}
                                            {shippingAddress.phone_number}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                            {safeUser.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 italic text-sm">
                                        No address details available
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full text-indigo-600 shadow-sm">
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm">
                                        Need Help?
                                    </h4>
                                    <p className="text-xs text-indigo-700 mt-1 mb-3">
                                        Issues with this order? Contact our support team.
                                    </p>
                                    <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
