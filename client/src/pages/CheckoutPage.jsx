import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowRight,
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
                // Simulate online payment delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                let resultAction;
                if (id) {
                    resultAction = await dispatch(
                        createOrder({
                            id: product.id,
                            orderData: { ...baseOrderData, payment_status: "SUCCESS" },
                        })
                    ).unwrap();
                } else {
                    resultAction = await dispatch(
                        createOrderFromCart({
                             ...baseOrderData, 
                             payment_status: "SUCCESS" 
                        })
                    ).unwrap();
                }

                const newOrderId = resultAction.id || resultAction.order?.id || resultAction.data?.id || resultAction.orderId;

                if (newOrderId) {
                    dispatch(resetOrderState());
                    navigate(`/product-checkout/success/${newOrderId}`);
                }
                setIsProcessing(false);
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative z-10 text-[#f0f0f0]">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="museo-label text-white/50">Fetching details...</p>
            </div>
        );
    }

    if (id && !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative z-10 text-center px-4">
                <AlertCircle className="h-10 w-10 text-white/20 mb-6" />
                <p className="museo-body text-white/50 max-w-sm mb-6">The product you are attempting to checkout cannot be found.</p>
                <Link to="/" className="museo-label text-white hover:text-[#ea0000] border border-white/20 px-6 py-3 transition-colors">
                    Return to Products
                </Link>
            </div>
        );
    }

    if (!id && cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative z-10 text-center px-4">
                <ShoppingBag className="h-10 w-10 text-white/20 mb-6" />
                <p className="museo-body text-white/50 max-w-sm mb-6">Your cart is empty.</p>
                <Link to="/products" className="museo-label text-white hover:text-[#ea0000] border border-white/20 px-6 py-3 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pb-24 font-sans relative text-[#f0f0f0] z-10 overflow-x-hidden selection:bg-[#ea0000] selection:text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-20 fade-in-up visible stagger-1">
                <Link
                    to={id ? `/product/${id}` : `/cart`}
                    className="inline-flex items-center gap-3 museo-label text-white/40 hover:text-white mb-12 transition-colors fade-in-up visible stagger-2"
                >
                    <ArrowLeft size={16} /> Back to {id ? 'Product' : 'Cart'}
                </Link>

                <h1 className="museo-headline text-5xl md:text-6xl lg:text-7xl mb-16 clip-reveal">Checkout.</h1>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 fade-in-up visible stagger-3">
                    {/* Left Column - Forms */}
                    <div className="flex-1 space-y-16">
                        {/* Shipping Section */}
                        <section>
                            <h2 className="museo-headline text-2xl md:text-3xl mb-8 flex items-center gap-4 text-white/90">
                                <span className="text-[#ea0000] text-sm">01</span> Shipping Address
                            </h2>

                            <div className="space-y-4">
                                {addresses.length > 0 ? (
                                    addresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedAddressIndex(index)}
                                            className={`relative p-6 sm:p-8 cursor-pointer transition-all duration-300 border ${
                                                selectedAddressIndex === index
                                                    ? "border-white bg-white/5"
                                                    : "border-white/10 hover:border-white/30 bg-transparent"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="pr-12">
                                                    <p className="museo-headline text-lg sm:text-xl text-white mb-2">
                                                        {addr.name || safeUser.first_name}{" "}
                                                        <span className="museo-label text-white/40 ml-3">
                                                            {addr.type || "Home"}
                                                        </span>
                                                    </p>
                                                    <p className="museo-body text-white/60">
                                                        {addr.house_no}, {addr.area}
                                                        {addr.landmark ? `, ${addr.landmark}` : ""}
                                                    </p>
                                                    <p className="museo-body text-white/60">
                                                        {addr.city}, {addr.state} — {addr.pin_code}
                                                    </p>
                                                    <p className="museo-body text-white/60 mt-4">
                                                        T: <span className="text-white/80">{addr.phone_number}</span>
                                                    </p>
                                                </div>
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                    selectedAddressIndex === index ? 'border-white' : 'border-white/20'
                                                }`}>
                                                    {selectedAddressIndex === index && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 border-t border-b border-white/10 text-center">
                                        <p className="museo-body text-white/40 mb-6">
                                            No delivery addresses saved.
                                        </p>
                                        <button
                                            onClick={() => setShowAddressModal(true)}
                                            className="museo-label border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-colors"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                )}

                                {addresses.length > 0 && (
                                    <button
                                        onClick={() => setShowAddressModal(true)}
                                        className="museo-label flex items-center gap-3 text-white/50 hover:text-white mt-6 transition-colors"
                                    >
                                        <Plus size={16} /> New Address
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section>
                            <h2 className="museo-headline text-2xl md:text-3xl mb-8 flex items-center gap-4 text-white/90">
                                <span className="text-[#ea0000] text-sm">02</span> Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`p-6 sm:p-8 border cursor-pointer transition-all duration-300 flex items-center gap-5 ${
                                        paymentMethod === "COD"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/30 bg-transparent"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                        paymentMethod === "COD" ? "border-white" : "border-white/20"
                                    }`}>
                                        {paymentMethod === "COD" && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="museo-headline text-lg sm:text-xl">
                                        Cash on Delivery
                                    </span>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod("ONLINE")}
                                    className={`p-6 sm:p-8 border cursor-pointer transition-all duration-300 flex items-center gap-5 ${
                                        paymentMethod === "ONLINE"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/30 bg-transparent"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                        paymentMethod === "ONLINE" ? "border-white" : "border-white/20"
                                    }`}>
                                        {paymentMethod === "ONLINE" && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="museo-headline text-lg sm:text-xl">
                                        Online Payment
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="w-full lg:w-[440px] shrink-0">
                        <div className="sticky top-12 bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 fade-in-up visible stagger-4">
                            <h2 className="museo-headline text-2xl mb-8 border-b border-white/10 pb-6">Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4 hide-scrollbar">
                                {orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 items-center group">
                                        <div className="h-24 w-20 shrink-0 bg-[#111] overflow-hidden">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.product_name}
                                                className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="museo-headline text-lg line-clamp-1 mb-1">
                                                {item.product?.product_name}
                                            </h3>
                                            <p className="museo-label text-white/40 mb-2">QTY: {item.quantity}</p>
                                            <p className="museo-body text-white/80">
                                                {formatPrice(item.product?.price || 0)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between museo-body text-white/60">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between museo-body text-white/60">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 mt-6 border-t border-white/10">
                                    <span className="museo-label text-white/60">Total</span>
                                    <span className="museo-headline text-3xl">{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={orderLoading || isProcessing || addresses.length === 0}
                                className={`w-full mt-10 py-5 px-6 museo-label transition-all flex items-center justify-center gap-3 ${
                                    orderLoading || isProcessing || addresses.length === 0
                                        ? "bg-white/5 text-white/30 cursor-not-allowed border-none"
                                        : "bg-white text-black hover:bg-[#ea0000] hover:text-white"
                                }`}
                            >
                                {orderLoading || isProcessing ? (
                                    <span className="flex items-center gap-3">
                                        <Loader2 className="animate-spin h-4 w-4" /> Processing
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3 text-sm">
                                        Confirm Order <ArrowRight size={16} />
                                    </span>
                                )}
                            </button>

                            {addresses.length === 0 && (
                                <p className="museo-label text-white/40 text-center mt-6">
                                    Shipping address required.
                                </p>
                            )}
                            
                            <div className="mt-10 pt-8 border-t border-white/5 flex grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <ShieldCheck size={20} className="text-white/30" />
                                    <span className="museo-label text-[10px] text-white/40 leading-relaxed">Encrypted<br/>Transaction</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Truck size={20} className="text-white/30" />
                                    <span className="museo-label text-[10px] text-white/40 leading-relaxed">Insured<br/>Transit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Modal Fragment */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-sm">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-3xl p-8 sm:p-12 relative max-h-[90vh] overflow-y-auto clip-reveal">
                        <button
                            onClick={() => setShowAddressModal(false)}
                            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={28} strokeWidth={1.5} />
                        </button>

                        <h2 className="museo-headline text-3xl mb-10">
                            New Address
                        </h2>

                        <form onSubmit={handleSaveAddress} className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">Full Name</label>
                                    <input
                                        required type="text" name="name"
                                        value={addressFormData.name} onChange={handleAddressChange}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors placeholder:text-white/10"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">Telephone</label>
                                    <input
                                        required type="tel" name="phone_number"
                                        value={addressFormData.phone_number} onChange={handleAddressChange}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors placeholder:text-white/10"
                                        placeholder="10-digit number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">Postal Code</label>
                                    <input
                                        required type="text" name="pin_code"
                                        value={addressFormData.pin_code} onChange={handleAddressChange}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors placeholder:text-white/10"
                                        placeholder="e.g. 560001"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">Premises</label>
                                    <input
                                        required type="text" name="house_no"
                                        value={addressFormData.house_no} onChange={handleAddressChange}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors placeholder:text-white/10"
                                        placeholder="Flat, House no."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="museo-label text-white/40">Street / Area</label>
                                <input
                                    required type="text" name="area"
                                    value={addressFormData.area} onChange={handleAddressChange}
                                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors placeholder:text-white/10"
                                    placeholder="Enter street details"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="museo-label text-white/40">Landmark (Optional)</label>
                                <input
                                    type="text" name="landmark"
                                    value={addressFormData.landmark} onChange={handleAddressChange}
                                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors placeholder:text-white/10"
                                    placeholder="Near prominent location"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">City</label>
                                    <input
                                        required type="text" name="city"
                                        value={addressFormData.city} onChange={handleAddressChange}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">State</label>
                                    <input
                                        required type="text" name="state"
                                        value={addressFormData.state} onChange={handleAddressChange}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white museo-body focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="museo-label text-white/40">Country</label>
                                    <input
                                        required type="text" name="country"
                                        value={addressFormData.country} readOnly
                                        className="w-full bg-transparent border-b border-white/10 pb-3 text-white/30 museo-body outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={isAddingAddress}
                                    className="px-10 py-4 bg-white text-black museo-label hover:bg-[#ea0000] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                                >
                                    {isAddingAddress ? <Loader2 className="animate-spin" size={20} /> : "Save Address"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="px-8 py-4 border border-white/20 text-white museo-label hover:border-white transition-colors"
                                >
                                    Cancel
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
