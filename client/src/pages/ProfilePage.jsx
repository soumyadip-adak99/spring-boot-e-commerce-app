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
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        error: "bg-rose-50 border-rose-200 text-rose-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const icons = {
        success: <CheckCircle size={18} className="text-emerald-600" />,
        error: <AlertCircle size={18} className="text-rose-600" />,
        info: <Bell size={18} className="text-blue-600" />,
    };

    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-gray-100 animate-in fade-in slide-in-from-top-5 duration-300 ${
                bgColors[type] || bgColors.info
            }`}
        >
            {icons[type] || icons.info}
            <span className="text-sm font-semibold">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70">
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
            if (updateUserProfile) {
                await dispatch(updateUserProfile(formData)).unwrap();

                dispatch(getUserDetails());
                showToast("Profile updated successfully!");
                setIsEditing(false);
            } else {
                console.log("Update Data:", formData);
                showToast("Update simulated (Action missing)", "info");
                setIsEditing(false);
            }
        } catch (error) {
            showToast(error.message || "Failed to update profile", "error");
        }
    };

    const ProfileDetails = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your personal details and contact info.
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3 w-full sm:w-auto">
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
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                    { label: "First Name", key: "first_name", icon: User },
                    { label: "Last Name", key: "last_name", icon: User },
                    { label: "Phone Number", key: "phone", icon: Phone },
                ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {field.label}
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <field.icon
                                    className={`h-5 w-5 ${
                                        isEditing ? "text-indigo-500" : "text-gray-400"
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
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-all duration-200 outline-none ${
                                    isEditing
                                        ? "border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 shadow-sm"
                                        : "border-transparent bg-gray-50/50 text-gray-600 cursor-default"
                                }`}
                            />
                        </div>
                    </div>
                ))}

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            disabled
                            value={formData.email}
                            className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-xl bg-gray-50/50 text-gray-500 text-sm cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const OrderHistory = () => {
        const userOrders = safeUser.orders || [];

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-gray-100 pb-5">
                    <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Track and manage your recent purchases.
                    </p>
                </div>

                <div className="space-y-4">
                    {userOrders.length > 0 ? (
                        userOrders.map((order) => (
                            <div
                                key={order.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/40 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-indigo-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 text-sm">
                                                #{order.id.slice(-6).toUpperCase()}
                                            </span>
                                            <span
                                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                                                    order.status === "Delivered"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : order.status === "Processing"
                                                          ? "bg-blue-50 text-blue-700 border-blue-100"
                                                          : "bg-gray-50 text-gray-700 border-gray-100"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="font-medium text-gray-700">
                                                {order.product_name || "Product Name"}
                                            </span>
                                            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                {formatDate(order.createdAt || order.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end sm:gap-6 pl-16 sm:pl-0">
                                    <span className="font-bold text-gray-900 text-lg">
                                        {order.total ? `₹${order.total}` : ""}
                                    </span>
                                    <button
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        Details <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No orders found.</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Looks like you haven't made any purchases yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AddressBook = () => {
        // Ensures we use the addresses fetched by getUserDetails
        const userAddresses = safeUser.address || [];
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage shipping locations.</p>
                    </div>
                    {/* Placeholder for Add Address - connects to backend via separate component/modal if needed */}
                    <button className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95">
                        + Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {userAddresses.length > 0 ? (
                        userAddresses.map((addr, index) => (
                            <div
                                key={addr.id || index}
                                className="p-5 border border-gray-200 rounded-2xl bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/40 transition-all duration-300 group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            {addr.name || `Address ${index + 1}`}
                                        </span>
                                    </div>
                                    {index === 0 && (
                                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wide shadow-sm">
                                            DEFAULT
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed pl-11 mb-4">
                                    {addr.area || addr.landmark} <br />
                                    {addr.city}, {addr.state} <br />
                                    <span className="font-semibold text-gray-800">
                                        {addr.zipCode || addr.pin_code}
                                    </span>
                                </p>
                                <div className="pl-11 flex gap-4 text-xs font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                        Edit
                                    </button>
                                    <div className="w-px bg-gray-300 h-3 self-center"></div>
                                    <button className="text-rose-600 hover:text-rose-800 transition-colors">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No addresses saved.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AccountSettings = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Security and privacy preferences.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-gray-700">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Change Password</p>
                        <p className="text-xs text-gray-500 mt-0.5">Last updated 3 months ago</p>
                    </div>
                </div>
                <button className="text-xs font-semibold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                    Update
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-rose-600 mb-4 flex items-center gap-2">
                    Danger Zone
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-rose-100 rounded-2xl bg-rose-50/30">
                    <div className="mb-3 sm:mb-0">
                        <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Permanently remove your account and all data.
                        </p>
                    </div>
                    <button className="text-xs font-semibold text-rose-600 border border-rose-200 bg-white px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors shadow-sm">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-20 relative">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            {/* --- HEADER BANNER --- */}
            <div className="bg-indigo-600 h-72 w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>

                {/* Back to Home Button (Top Left) */}
                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all hover:pr-5 active:scale-95"
                    >
                        <Home size={16} />
                        <span className="hidden sm:inline">Back to Home</span>
                    </button>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-gray-50/50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- LEFT SIDEBAR --- */}
                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-24 space-y-6">
                            {/* User Profile Card */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-900/5 border border-white p-8 text-center relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-indigo-50 to-transparent"></div>
                                <div className="relative inline-block mb-4 group cursor-pointer">
                                    <div className="w-28 h-28 mx-auto rounded-full bg-white p-1 shadow-lg ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all">
                                        <div className="w-full h-full rounded-full bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-4xl font-bold text-indigo-600 uppercase select-none">
                                            {safeUser.first_name ? safeUser.first_name[0] : "U"}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-gray-900 text-white p-2 rounded-full border-2 border-white shadow-md opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-105">
                                        <Camera size={14} />
                                    </div>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 mb-1">
                                    {safeUser.first_name} {safeUser.last_name}
                                </h1>
                                <p className="text-sm text-gray-500 font-medium mb-5 break-all">
                                    {safeUser.email}
                                </p>
                            </div>

                            <nav className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden p-2">
                                {["profile", "orders", "addresses", "settings"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 capitalize ${
                                            activeTab === tab
                                                ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        {tab === "profile" && <User size={18} />}
                                        {tab === "orders" && <Package size={18} />}
                                        {tab === "addresses" && <MapPin size={18} />}
                                        {tab === "settings" && <Settings size={18} />}
                                        {tab}
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-2 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl text-rose-600 hover:bg-rose-50 hover:shadow-sm transition-all"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 min-h-[600px] relative">
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
