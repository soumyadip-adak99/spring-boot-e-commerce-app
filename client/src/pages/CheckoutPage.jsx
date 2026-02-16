import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    Loader2,
    ShoppingBag,
    MapPin,
    CreditCard,
    CheckCircle,
    Plus,
    Truck,
    ShieldCheck,
    AlertCircle,
    X,
} from "lucide-react";
import { getProductById } from "../features/product/productAction";
import { createOrder, createOrderFromCart } from "../features/orders/orderAction";
import { resetOrderState } from "../features/appFeatures/orderSlice";
import { addAddress } from "../features/appFeatures/authSlice";

const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

function CheckoutPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isProcessing, setIsProcessing] = useState(false);

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressFormData, setAddressFormData] = useState({
        name: "",
        phone_number: "",
        house_no: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pin_code: "",
        country: "India",
    });

    const { product, isLoading: productLoading } = useSelector((state) => state.product);
    const { user } = useSelector((state) => state.auth);
    const { isLoading: orderLoading } = useSelector((state) => state.order);

    const safeUser = user || JSON.parse(localStorage.getItem("user")) || {};
    const addresses = safeUser.address || [];
    const cartItems = safeUser.cart_items || [];
    
    // Determine order items: Single Product or Cart Items
    const orderItems = id 
        ? (product ? [{ product, quantity: 1 }] : []) 
        : cartItems.map(item => ({ product: item.product || item, quantity: item.quantity || 1 }));

    // Calculate billing details
    const subtotal = orderItems.reduce((acc, item) => {
        return acc + (Number(item.product?.price) || 0) * item.quantity;
    }, 0);
    const totalAmount = subtotal; // Shipping is free

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
        window.scrollTo(0, 0);
        return () => {
            dispatch(resetOrderState());
        };
    }, [id, dispatch]);

    const handlePlaceOrder = async () => {
        if (!addresses || addresses.length === 0) {
            alert("Please add a shipping address to proceed.");
            setShowAddressModal(true);
            return;
        }

        const selectedAddress = addresses[selectedAddressIndex];
        if (!selectedAddress) {
            alert("Please select a valid address.");
            return;
        }

        const baseOrderData = {
            address: selectedAddress.id,
            payment_mode: paymentMethod,
        };

        try {
            if (paymentMethod === "COD") {
                let resultAction;
                
                if (id) {
                     // Single Product Order
                    resultAction = await dispatch(
                        createOrder({
                            id: product.id,
                            orderData: { ...baseOrderData, payment_status: "PENDING" },
                        })
                    ).unwrap();
                } else {
                    // Cart Order
                     resultAction = await dispatch(
                        createOrderFromCart({
                             ...baseOrderData, 
                             payment_status: "PENDING" 
                        })
                    ).unwrap();
                }

                const newOrderId =
                    resultAction.id || resultAction.order?.id || resultAction.data?.id;

                if (newOrderId) {
                    dispatch(resetOrderState());
                    navigate(`/product-checkout/success/${newOrderId}`);
                } else {
                    alert("Order placed, but could not redirect.");
                }
            } else if (paymentMethod === "ONLINE") {
                setIsProcessing(true);
                const isScriptLoaded = await loadRazorpayScript(
                    "https://checkout.razorpay.com/v1/checkout.js"
                );

                if (!isScriptLoaded) {
                    alert("Razorpay SDK failed to load.");
                    setIsProcessing(false);
                    return;
                }

                const token = localStorage.getItem("jwtToken");
                let createRes, createData;

                if (id) {
                     // Single Product Razorpay Order
                    createRes = await fetch(
                        `${import.meta.env.VITE_BACKEND_BASE_API}/payment/create-order`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                product_id: product.id,
                                quantity: 1,
                            }),
                        }
                    );
                } else {
                    // TODO: Backend needs to support creating razorpay order for CART total
                    // For now, blocking online payment for cart or handling it if backend supports
                    // Assuming similar endpoint or updated params. 
                    // Since specific Razorpay Cart endpoint wasn't in plan, we might need value-add logic here
                    // blocking for now or treating as "total amount" request
                    alert("Online payment for Cart is coming soon! Please use COD.");
                    setIsProcessing(false);
                    return;
                }
                
                createData = await createRes.json();

                if (!createRes.ok) {
                    alert(createData.error_message || "Failed to create payment order");
                    setIsProcessing(false);
                    return;
                }

                const { order_id, amount, currency, key } = createData.data;

                // Step 2: Open Razorpay checkout
                const options = {
                    key: key,
                    amount: amount,
                    currency: currency,
                    order_id: order_id,
                    name: "ShopHub Store",
                    description: id ? `Order for ${product.product_name}` : "Cart Order",
                    image: id ? product.image : "https://via.placeholder.com/150", // generic image for cart
                    prefill: {
                        name: `${safeUser.first_name} ${safeUser.last_name}`,
                        email: safeUser.email,
                        contact: selectedAddress.phone_number,
                    },
                    theme: { color: "#4f46e5" },
                    handler: async function (response) {
                        try {
                            // Step 3: Verify payment on backend
                            const verifyBody = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                address_id: selectedAddress.id,
                            };
                            
                            if (id) {
                                verifyBody.product_id = product.id;
                                verifyBody.quantity = 1;
                            } else {
                                // For cart, we might need a different verification endpoint or updated one
                                // Assuming verify handles it or it's part of the pending TODO
                            }

                            const verifyRes = await fetch(
                                `${import.meta.env.VITE_BACKEND_BASE_API}/payment/verify`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify(verifyBody),
                                }
                            );
                            const verifyData = await verifyRes.json();

                            if (verifyRes.ok && verifyData.data) {
                                const newOrderId = verifyData.data.id;
                                dispatch(resetOrderState());
                                navigate(`/product-checkout/success/${newOrderId}`);
                            } else {
                                alert(verifyData.error_message || "Payment verification failed");
                            }
                        } catch (err) {
                            alert("Payment successful but verification failed. Contact support.");
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        },
                    },
                };
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            }
        } catch (error) {
            console.error("Order failed:", error);
            alert(error.message || "Something went wrong.");
            setIsProcessing(false);
        }
    };

    const handleAddressChange = (e) => {
        setAddressFormData({ ...addressFormData, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setIsAddingAddress(true);
        try {
            await dispatch(addAddress(addressFormData)).unwrap();

            setShowAddressModal(false);
            setAddressFormData({
                name: "",
                phone_number: "",
                house_no: "",
                area: "",
                landmark: "",
                city: "",
                state: "",
                pin_code: "",
                country: "India",
            });

            setSelectedAddressIndex(addresses.length);
        } catch (error) {
            alert(error.message || "Failed to add address");
        } finally {
            setIsAddingAddress(false);
        }
    };

    if (productLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-indigo-600">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-medium text-gray-600">Fetching product details...</p>
            </div>
        );
    }

    if (id && !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="font-medium text-gray-600">Product not found.</p>
                <Link to="/" className="mt-4 text-indigo-600 hover:underline">
                    Go Home
                </Link>
            </div>
        );
    }

    if (!id && cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                <p className="font-medium text-gray-600">Your cart is empty.</p>
                <Link to="/products" className="mt-4 text-indigo-600 hover:underline">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans relative">
            <div className="bg-indigo-600 h-48 w-full absolute top-0 left-0 z-0 shadow-md"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                <Link
                    to={`/products/`}
                    className="inline-flex items-center gap-2 text-indigo-100 hover:text-white font-medium mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Product
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin className="text-indigo-600" size={20} /> Shipping Address
                            </h2>

                            <div className="space-y-4">
                                {addresses.length > 0 ? (
                                    addresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedAddressIndex(index)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                selectedAddressIndex === index
                                                    ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                                                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {addr.name || safeUser.first_name}{" "}
                                                        <span className="text-gray-500 font-normal text-sm">
                                                            ({addr.type || "Home"})
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {addr.house_no}, {addr.area},{" "}
                                                        {addr.landmark ? `${addr.landmark}, ` : ""}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {addr.city}, {addr.state} - {addr.pin_code}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                                        Phone:{" "}
                                                        <span className="text-gray-900 font-medium">
                                                            {addr.phone_number}
                                                        </span>
                                                    </p>
                                                </div>
                                                {selectedAddressIndex === index && (
                                                    <CheckCircle
                                                        className="text-indigo-600 fill-indigo-100"
                                                        size={24}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 text-sm mb-3">
                                            No delivery addresses found.
                                        </p>
                                        <button
                                            onClick={() => setShowAddressModal(true)}
                                            className="text-indigo-600 font-bold text-sm hover:underline"
                                        >
                                            + Add New Address
                                        </button>
                                    </div>
                                )}

                                {addresses.length > 0 && (
                                    <button
                                        onClick={() => setShowAddressModal(true)}
                                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 mt-2 transition-colors"
                                    >
                                        <Plus size={16} /> Add New Address
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <CreditCard className="text-indigo-600" size={20} /> Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                        paymentMethod === "COD"
                                            ? "border-indigo-600 bg-indigo-50/30"
                                            : "border-gray-200 hover:border-indigo-300"
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            paymentMethod === "COD"
                                                ? "border-indigo-600"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {paymentMethod === "COD" && (
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        Cash on Delivery
                                    </span>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod("ONLINE")}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                        paymentMethod === "ONLINE"
                                            ? "border-indigo-600 bg-indigo-50/30"
                                            : "border-gray-200 hover:border-indigo-300"
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            paymentMethod === "ONLINE"
                                                ? "border-indigo-600"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {paymentMethod === "ONLINE" && (
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        Pay Online (UPI/Card)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <ShoppingBag className="text-indigo-600" size={20} /> Order Summary
                            </h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 max-h-80 overflow-y-auto pr-2">
                                {orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 border border-gray-200 p-1">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.product_name}
                                                className="h-full w-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug">
                                                {item.product?.product_name}
                                            </h3>
                                            <p className="text-gray-500 text-xs mt-1">Quantity: {item.quantity}</p>
                                            <p className="text-indigo-600 font-bold mt-1 text-sm">
                                                {formatPrice(item.product?.price || 0)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total Amount</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-6 text-[10px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <ShieldCheck size={18} className="text-green-600" />
                                    <span>100% Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <Truck size={18} className="text-blue-600" />
                                    <span>Fast & Free Delivery</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={orderLoading || isProcessing || addresses.length === 0}
                                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 ${
                                    orderLoading || isProcessing || addresses.length === 0
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                }`}
                            >
                                {orderLoading || isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" /> Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </button>

                            {addresses.length === 0 && (
                                <p className="text-red-500 text-xs text-center mt-3 font-medium bg-red-50 py-1 px-2 rounded">
                                    Please add a shipping address to proceed.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowAddressModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="text-indigo-600" /> Add New Address
                        </h2>

                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={addressFormData.name}
                                        onChange={handleAddressChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone_number"
                                        value={addressFormData.phone_number}
                                        onChange={handleAddressChange}
                                        placeholder="10-digit mobile number"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Pin-Code / Zip-Code
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="pin_code"
                                        value={addressFormData.pin_code}
                                        onChange={handleAddressChange}
                                        placeholder="e.g. 560001"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        House No / Flat
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="house_no"
                                        value={addressFormData.house_no}
                                        onChange={handleAddressChange}
                                        placeholder="Flat 4B, Building Name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    Area / Street / Village
                                </label>
                                <textarea
                                    required
                                    rows="2"
                                    name="area"
                                    value={addressFormData.area}
                                    onChange={handleAddressChange}
                                    placeholder="Enter street details"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    Landmark (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={addressFormData.landmark}
                                    onChange={handleAddressChange}
                                    placeholder="Near City Hospital"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        City
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        value={addressFormData.city}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        State
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="state"
                                        value={addressFormData.state}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Country
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="country"
                                        value={addressFormData.country}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAddingAddress}
                                    className="flex-1 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isAddingAddress ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        "Save Address"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
