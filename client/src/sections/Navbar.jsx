import { useState, useEffect, useRef, useMemo } from "react";
import {
    ShoppingCart,
    Search,
    User,
    LogOut,
    Settings,
    ShoppingBag,
    Menu,
    X,
    List,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getUserDetails } from "../features/appFeatures/authSlice";

import CartItemsModal from "../components/CartItemsModal";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartRef = useRef(null);
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartRef.current && !cartRef.current.contains(e.target)) setIsCartOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target))
                setIsProfileOpen(false);

            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target) &&
                !e.target.closest("button")
            ) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch, user?._id]);

    const finalCartItems = useMemo(() => {
        return user?.cart_items || [];
    }, [user]);

    const totalPrice = useMemo(() => {
        return finalCartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    }, [finalCartItems]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);

        navigate(0);
    };

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
            isActive
                ? "text-indigo-600 bg-indigo-50 font-semibold shadow-sm ring-1 ring-indigo-100"
                : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
        }`;
    };

    return (
        <>
            <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:bg-indigo-700 transition-colors">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">
                                    ShopHub
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link
                                to="/products"
                                className={`hidden md:block ${getLinkClass("/products")}`}
                            >
                                All Products
                            </Link>

                            <div className="hidden sm:flex items-center bg-gray-200 rounded-full px-4 py-1.5 border border-transparent focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-48 lg:w-64">
                                <Search size={18} className="text-gray-700" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none text-sm ml-2 w-full focus:outline-none placeholder-gray-700 text-gray-700"
                                />
                            </div>

                            <button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className="sm:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <Search size={22} />
                            </button>

                            <div ref={cartRef} className="relative">
                                <button
                                    onClick={() => setIsCartOpen(!isCartOpen)}
                                    className={`p-2 rounded-full relative transition-colors ${
                                        isCartOpen
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <ShoppingCart size={26} />
                                    {finalCartItems.length > 0 && (
                                        <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                            {finalCartItems.length}
                                        </span>
                                    )}
                                </button>

                                {isCartOpen && (
                                    <CartItemsModal
                                        userCartItems={finalCartItems}
                                        totalPrice={totalPrice}
                                    />
                                )}
                            </div>

                            {user ? (
                                <div ref={profileRef} className="relative hidden sm:block">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className={`flex items-center gap-2 p-1 rounded-full border border-gray-200 transition-all hover:shadow-sm ${
                                            isProfileOpen
                                                ? "ring-2 ring-indigo-100 border-indigo-200"
                                                : "hover:border-indigo-300"
                                        }`}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm uppercase">
                                            {(user?.first_name || "")
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-60 bg-white shadow-xl rounded-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="p-1.5">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <User
                                                        size={16}
                                                        className="mr-3 text-gray-400"
                                                    />{" "}
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <List
                                                        size={16}
                                                        className="mr-3 text-gray-400"
                                                    />{" "}
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Settings
                                                        size={16}
                                                        className="mr-3 text-gray-400"
                                                    />{" "}
                                                    Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 p-1.5">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors group"
                                                >
                                                    <LogOut
                                                        size={16}
                                                        className="mr-3 group-hover:text-red-700"
                                                    />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link
                                        to="/auth/user"
                                        className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-4 py-2 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/auth/user"
                                        className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-100 bg-gray-50 ${
                        isMobileSearchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="px-4 py-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                autoFocus={isMobileSearchOpen}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="lg:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top-5 duration-200"
                    >
                        <div className="p-4 space-y-2">
                            <Link
                                to="/products"
                                className={`block w-full text-left ${getLinkClass("/products")}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                All Products
                            </Link>

                            <div className="border-t border-gray-100 my-2 pt-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                            {user.first_name} {user.last_name}
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User size={18} className="mr-3 text-gray-400" /> My
                                            Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <List size={18} className="mr-3 text-gray-400" /> My
                                            Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={18} className="mr-3" /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3 px-2">
                                        <Link
                                            to="/auth/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/auth/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
