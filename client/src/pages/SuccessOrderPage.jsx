import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, ArrowLeft, Package, MapPin, Calendar } from "lucide-react";
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
    }, [id, dispatch]);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    if (isLoading || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-emerald-50 p-8 text-center border-b border-emerald-100">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <CheckCircle className="text-emerald-600 w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 text-lg">
                        Thank you for your purchase. Your order has been received.
                    </p>
                    <p className="text-sm font-semibold text-emerald-700 mt-2 bg-emerald-100 inline-block px-3 py-1 rounded-full">
                        Order ID: {orderId}
                    </p>
                </div>

                <div className="p-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Estimated Delivery
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formattedDate}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px bg-gray-200"></div>

                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Shipping Method
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    Standard Shipping
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package size={20} className="text-gray-400" />
                        Order Summary
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.product_name}
                                className="w-full h-full object-contain mix-blend-multiply p-2"
                            />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="mb-1">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                    {product.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {product.product_name}
                            </h3>

                            <p className="text-gray-500 text-sm leading-relaxed">
                                {product.product_description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => navigate("/products")}
                            className="group flex items-center gap-2 bg-gray-900 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all active:scale-95"
                        >
                            <ArrowLeft
                                size={18}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            Return to Shop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessOrderPage;
