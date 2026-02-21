import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    User,
    Package,
    MapPin,
    Settings,
    LogOut,
    Camera,
    Mail,
    Phone,
    Calendar,
    Edit2,
    Save,
    X,
    ChevronRight,
    Bell,
    Shield,
    ShoppingBag,
    Loader2,
    CheckCircle,
    AlertCircle,
    Home,
} from "lucide-react";

import { logoutUser, getUserDetails } from "../features/appFeatures/authSlice";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: "bg-transparent border-[#ea0000]/30 text-white museo-label",
        error: "bg-[#0a0a0a] border-white/10 text-white museo-label",
        info: "bg-[#0a0a0a] border-white/10 text-white museo-label",
    };

    const icons = {
        success: <CheckCircle size={14} className="text-[#ea0000]" />,
        error: <AlertCircle size={14} className="text-[#ea0000]" />,
        info: <Bell size={14} className="text-white" />,
    };

    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-4 px-6 py-4 border animate-in fade-in slide-in-from-top-5 duration-300 shadow-2xl ${
                bgColors[type] || bgColors.info
            }`}
        >
            {icons[type] || icons.info}
            <span className="text-[10px] tracking-widest uppercase">{message}</span>
            <button onClick={onClose} className="ml-6 text-white/40 hover:text-white transition-colors">
                <X size={14} />
            </button>
        </div>
    );
};

export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading } = useSelector((state) => state.auth);
    const safeUser = user || JSON.parse(localStorage.getItem("user")) || {};

    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        dispatch(getUserDetails());
        window.scrollTo(0, 0);
    }, [dispatch]);

    useEffect(() => {
        if (safeUser) {
            setFormData({
                first_name: safeUser.first_name || "",
                last_name: safeUser.last_name || "",
                email: safeUser.email || "",
                phone: safeUser.phone || "",
            });
        }
    }, [safeUser]);
    
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate(0);
        navigate("/");
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const handleSave = async () => {
        if (!formData.first_name || !formData.last_name) {
            showToast("First and Last name are required.", "error");
            return;
        }

        try {
            console.log("Update Data:", formData);
            showToast("Profile Updated", "success");
            setIsEditing(false);
        } catch (error) {
            showToast(error.message || "Failed to update profile", "error");
        }
    };

    const ProfileDetails = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-8 gap-6">
                <div>
                    <h2 className="museo-headline text-3xl text-white tracking-widest">PERSONAL PROFILE</h2>
                    <p className="museo-body text-white/40 mt-3 text-sm">
                        Manage your account information and contact details.
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-3 px-6 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors museo-label text-[10px] tracking-widest uppercase"
                    >
                        <Edit2 size={12} /> EDIT PROFILE
                    </button>
                ) : (
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    first_name: safeUser.first_name || "",
                                    last_name: safeUser.last_name || "",
                                    email: safeUser.email || "",
                                    phone: safeUser.phone || "",
                                });
                            }}
                            className="flex items-center justify-center px-6 py-3 border border-white/20 text-white/60 hover:text-white transition-colors museo-label text-[10px] tracking-widest uppercase"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-black hover:bg-[#ea0000] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed museo-label text-[10px] tracking-widest uppercase"
                        >
                            {isLoading ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <Save size={12} />
                            )}
                            {isLoading ? "SAVING..." : "SAVE CHANGES"}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                    { label: "FIRST NAME", key: "first_name", icon: User },
                    { label: "LAST NAME", key: "last_name", icon: User },
                    { label: "CONTACT NUMBER", key: "phone", icon: Phone },
                ].map((field) => (
                    <div key={field.key} className="space-y-3">
                        <label className="museo-label text-[10px] text-white/40 tracking-widest">
                            {field.label}
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                <field.icon
                                    className={`h-4 w-4 transition-colors ${
                                        isEditing ? "text-white" : "text-white/20"
                                    }`}
                                />
                            </div>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={formData[field.key]}
                                onChange={(e) =>
                                    setFormData({ ...formData, [field.key]: e.target.value })
                                }
                                className={`block w-full pl-8 pr-0 py-3 bg-transparent border-b transition-all duration-300 outline-none museo-body text-sm ${
                                    isEditing
                                        ? "border-white/40 focus:border-white text-white"
                                        : "border-white/10 text-white/50 cursor-default"
                                }`}
                            />
                        </div>
                    </div>
                ))}

                <div className="space-y-3">
                    <label className="museo-label text-[10px] text-white/40 tracking-widest">
                        EMAIL ADDRESS
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-white/20" />
                        </div>
                        <input
                            type="email"
                            disabled
                            value={formData.email}
                            className="block w-full pl-8 pr-0 py-3 bg-transparent border-b border-white/5 text-white/30 text-sm cursor-not-allowed museo-body"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const OrderHistory = () => {
        const userOrders = safeUser.orders || [];

        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="border-b border-white/5 pb-8">
                    <h2 className="museo-headline text-3xl text-white tracking-widest">ORDERS</h2>
                    <p className="museo-body text-white/40 mt-3 text-sm">
                        Review your order history.
                    </p>
                </div>

                <div className="space-y-6">
                    {userOrders.length > 0 ? (
                        userOrders.map((order) => (
                            <div
                                key={order.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 bg-black border border-white/10 flex items-center justify-center shrink-0 text-white/40 group-hover:text-white transition-colors duration-300">
                                        <ShoppingBag size={18} strokeWidth={1} />
                                    </div>
                                    <div className="py-1">
                                        <div className="flex flex-wrap items-center gap-4 mb-3">
                                            <span className="museo-label text-white tracking-widest text-xs">
                                                ID: {order.id.slice(-6).toUpperCase()}
                                            </span>
                                            <span
                                                className={`museo-label text-[8px] px-3 py-1 border tracking-widest ${
                                                    order.status === "Delivered"
                                                        ? "text-white border-white/20"
                                                        : order.status === "Processing"
                                                          ? "text-white/60 border-white/10"
                                                          : "text-white/40 border-white/5"
                                                }`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="museo-label text-[10px] text-white/40 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 tracking-widest">
                                            <span className="text-white">
                                                {order.product_name || "UNKNOWN PRODUCT"}
                                            </span>
                                            <span className="hidden sm:inline w-px h-3 bg-white/20"></span>
                                            <span className="flex items-center gap-2">
                                                <Calendar size={10} />{" "}
                                                {formatDate(order.createdAt || order.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 sm:mt-0 flex flex-row items-center justify-between sm:flex-col sm:items-end sm:gap-4 pl-18 sm:pl-0">
                                    <span className="museo-headline text-white text-xl tracking-wide">
                                        {order.total ? `₹${order.total.toLocaleString()}` : ""}
                                    </span>
                                    <button
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                        className="museo-label text-[10px] uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 transition-colors border-b border-transparent hover:border-white pb-1"
                                    >
                                        DETAILS <ChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-[#0a0a0a] border border-dashed border-white/10 text-center">
                            <ShoppingBag className="h-8 w-8 text-[#ea0000] mb-6" strokeWidth={1} />
                            <p className="museo-headline text-2xl text-white mb-2 tracking-wide">No Orders Found</p>
                            <p className="museo-body text-white/40 text-sm">
                                You have not placed any orders yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AddressBook = () => {
        const userAddresses = safeUser.address || [];
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-8 gap-6">
                    <div>
                        <h2 className="museo-headline text-3xl text-white tracking-widest">ADDRESSES</h2>
                        <p className="museo-body text-white/40 mt-3 text-sm">Manage your shipping addresses.</p>
                    </div>
                    <button className="museo-label text-[10px] uppercase tracking-widest text-white border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-colors">
                        ADD ADDRESS
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {userAddresses.length > 0 ? (
                        userAddresses.map((addr, index) => (
                            <div
                                key={addr.id || index}
                                className="p-8 border border-white/10 bg-[#0a0a0a] hover:border-white/30 transition-all duration-500 group relative"
                            >
                                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-white transition-all duration-500"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-white/40 group-hover:text-white transition-colors duration-300">
                                            <MapPin size={16} strokeWidth={1.5} />
                                        </div>
                                        <span className="museo-headline text-white tracking-wide text-lg">
                                            {addr.name || `SITE 0${index + 1}`}
                                        </span>
                                    </div>
                                    {index === 0 && (
                                        <span className="museo-label text-[8px] bg-white text-black px-2 py-1 tracking-widest">
                                            PRIMARY
                                        </span>
                                    )}
                                </div>
                                <p className="museo-body text-sm text-white/50 leading-relaxed mb-8">
                                    {addr.area || addr.landmark} <br />
                                    {addr.city}, {addr.state} <br />
                                    <span className="text-white/80">
                                        {addr.zipCode || addr.pin_code}
                                    </span>
                                </p>
                                <div className="flex items-center gap-6 museo-label text-[10px] tracking-widest text-white/40 group-hover:text-white/80 transition-colors duration-300">
                                    <button className="hover:text-white transition-colors flex items-center gap-2">
                                        EDIT
                                    </button>
                                    <div className="w-px bg-white/20 h-3"></div>
                                    <button className="hover:text-[#ea0000] transition-colors flex items-center gap-2">
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 bg-[#0a0a0a] border border-dashed border-white/10">
                            <MapPin className="h-8 w-8 text-[#ea0000] mb-6" strokeWidth={1} />
                            <p className="museo-headline text-xl text-white tracking-wide">No Addresses Saved</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AccountSettings = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="border-b border-white/5 pb-8">
                <h2 className="museo-headline text-3xl text-white tracking-widest">SETTINGS</h2>
                <p className="museo-body text-white/40 mt-3 text-sm">Security and account preferences.</p>
            </div>
            
            <div className="p-8 border border-white/10 bg-[#0a0a0a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="text-white/50">
                        <Shield size={24} strokeWidth={1} />
                    </div>
                    <div>
                        <p className="museo-headline text-white tracking-wide text-lg mb-1">Password</p>
                        <p className="museo-body text-xs text-white/40">Change your password</p>
                    </div>
                </div>
                <button className="museo-label text-[10px] uppercase tracking-widest border border-white/20 px-8 py-4 text-white hover:bg-white hover:text-black transition-colors w-full sm:w-auto">
                    UPDATE PASSWORD
                </button>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5">
                <h3 className="museo-label text-[10px] text-[#ea0000] mb-6 flex items-center gap-3 uppercase tracking-widest">
                    <AlertCircle size={14} /> DANGER ZONE
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-8 border border-[#ea0000]/20 bg-[#ea0000]/5">
                    <div className="mb-6 sm:mb-0">
                        <p className="museo-headline text-lg text-white tracking-wide mb-1">Delete Account</p>
                        <p className="museo-body text-xs text-white/40 leading-relaxed">
                            Permanently delete your account and all associated data.
                        </p>
                    </div>
                    <button className="museo-label text-[10px] uppercase tracking-widest text-[#ea0000] border border-[#ea0000]/30 bg-black px-8 py-4 hover:bg-[#ea0000] hover:text-white transition-colors w-full sm:w-auto">
                        DELETE ACCOUNT
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 relative z-10 selection:bg-[#ea0000] selection:text-white">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            {/* --- HEADER BANNER --- */}
            <div className="bg-[#050505] h-64 w-full relative border-b border-white/5 overflow-hidden">
                <div className="noise-overlay" />
                
                {/* Back to Home Button */}
                <div className="absolute top-8 left-8 z-20">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 pb-1 border-b border-white/20 text-white/60 hover:text-white hover:border-white transition-all museo-label text-[10px] tracking-widest"
                    >
                        <Home size={12} />
                        <span>RETURN</span>
                    </button>
                </div>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 mix-blend-difference pointer-events-none">
                     <h1 className="text-[12vw] font-medium text-white/90 tracking-tighter leading-none museo-headline opacity-10">
                        PROFILE
                     </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 -mt-20 relative z-30">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* --- LEFT SIDEBAR --- */}
                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-12 space-y-8">
                            {/* User Profile Card */}
                            <div className="bg-[#0a0a0a] border border-white/5 p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="relative inline-block mb-8 group cursor-pointer w-full">
                                    <div className="w-24 h-24 mx-auto border border-white/10 group-hover:border-white/40 transition-all duration-500 relative bg-[#050505]">
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-white uppercase museo-headline">
                                            {safeUser.first_name ? safeUser.first_name[0] : "I"}
                                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                                                <Camera size={16} className="text-white mb-1" />
                                                <span className="museo-label text-[8px] tracking-widest uppercase">LENS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h1 className="museo-headline text-2xl text-white mb-2 tracking-wide uppercase">
                                    {safeUser.first_name || "GUEST"} {safeUser.last_name || ""}
                                </h1>
                                <p className="museo-label text-[9px] text-white/30 tracking-[0.2em] break-all uppercase">
                                    {safeUser.email || "NO EMAIL"}
                                </p>
                            </div>

                            <nav className="border border-white/5 p-4 bg-[#0a0a0a]">
                                {["profile", "orders", "addresses", "settings"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full flex items-center gap-4 px-6 py-5 museo-label text-[10px] tracking-widest uppercase transition-all duration-300 ${
                                            activeTab === tab
                                                ? "bg-white text-black"
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        <div className={`${activeTab === tab ? "text-black" : "text-white/40"}`}>
                                            {tab === "profile" && <User size={14} />}
                                            {tab === "orders" && <Package size={14} />}
                                            {tab === "addresses" && <MapPin size={14} />}
                                            {tab === "settings" && <Settings size={14} />}
                                        </div>
                                        {tab}
                                    </button>
                                ))}
                                <div className="h-px bg-white/5 my-4 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-5 museo-label text-[10px] text-[#ea0000] tracking-widest uppercase hover:bg-[#ea0000]/10 transition-all duration-300"
                                >
                                    <LogOut size={14} /> SIGN OUT
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="min-h-[600px] relative clip-reveal">
                            {activeTab === "profile" && <ProfileDetails />}
                            {activeTab === "orders" && <OrderHistory />}
                            {activeTab === "addresses" && <AddressBook />}
                            {activeTab === "settings" && <AccountSettings />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
