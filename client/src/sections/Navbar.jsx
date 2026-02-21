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
import { searchProducts } from "../features/product/productService";

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

    const [searchTerm, setSearchTerm] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const cartRef = useRef(null);
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const searchRef = useRef(null);

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
            
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowRecommendations(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch, user?.id]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                try {
                    const results = await searchProducts(searchTerm);
                    setRecommendations(results);
                    setShowRecommendations(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setRecommendations([]);
                }
            } else {
                setRecommendations([]);
                setShowRecommendations(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            setShowRecommendations(false);
            if (searchTerm.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                setIsMobileSearchOpen(false);
            }
        }
    };

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
        return `museo-label transition-colors duration-300 ${
            isActive
                ? "text-white border-b border-white pb-1"
                : "text-white/50 hover:text-white"
        }`;
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 font-sans h-[80px] flex items-center">
                <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden text-white/70 hover:text-white transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
                            </button>

                            <Link to="/" className="flex items-center gap-3 group">
                                <span className="museo-headline text-2xl text-white tracking-widest shrink-0">
                                    LUXE.
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 sm:gap-8">
                            <Link
                                to="/products"
                                className={`hidden md:block ${getLinkClass("/products")}`}
                            >
                                Collection
                            </Link>

                            <div className="relative hidden sm:block" ref={searchRef}>
                                <div className="flex items-center border-b border-white/20 pb-1 w-48 lg:w-64 transition-colors focus-within:border-white group">
                                    <Search size={14} className="text-white/40 cursor-pointer group-hover:text-white/70" onClick={handleSearchSubmit} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH"
                                        className="bg-transparent border-none w-full focus:outline-none placeholder-white/20 text-white museo-label ml-3 text-[10px]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearchSubmit}
                                        onFocus={() => {
                                            if (recommendations.length > 0) setShowRecommendations(true);
                                        }}
                                    />
                                    {searchTerm && (
                                        <X 
                                            size={12} 
                                            className="text-white/50 cursor-pointer hover:text-white" 
                                            onClick={() => {
                                                setSearchTerm("");
                                                setRecommendations([]);
                                            }}
                                        />
                                    )}
                                </div>

                                {showRecommendations && recommendations.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 max-h-96 overflow-y-auto z-50 clip-reveal shadow-2xl">
                                        {recommendations.map((product) => (
                                            <div
                                                key={product.id}
                                                className="p-4 hover:bg-white/5 cursor-pointer flex items-center gap-4 border-b border-white/5 last:border-none duration-300 transition-colors group"
                                                onClick={() => {
                                                    navigate(`/product/${product.id}`);
                                                    setShowRecommendations(false);
                                                    setSearchTerm("");
                                                }}
                                            >
                                                <div className="w-12 h-16 bg-[#111] overflow-hidden">
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.product_name} 
                                                        className="w-full h-full object-contain transition-all duration-500 scale-100 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="museo-headline text-sm text-white line-clamp-1 group-hover:text-[#ea0000] transition-colors">{product.product_name}</p>
                                                    <p className="museo-body text-xs text-white/50 mt-1">₹{product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className="sm:hidden text-white/70 hover:text-white transition-colors"
                            >
                                <Search size={22} strokeWidth={1} />
                            </button>

                            <div ref={cartRef} className="relative">
                                <button
                                    onClick={() => setIsCartOpen(!isCartOpen)}
                                    className={`relative transition-colors flex items-center gap-2 ${
                                        isCartOpen
                                            ? "text-white"
                                            : "text-white/50 hover:text-white"
                                    }`}
                                >
                                    <ShoppingBag size={20} strokeWidth={1.5} />
                                    <span className="museo-label text-[10px] hidden lg:block">Cart</span>
                                    {finalCartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 h-4 w-4 bg-white text-black text-[9px] font-bold flex items-center justify-center rounded-full">
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
                                        className={`flex items-center gap-3 transition-colors ${
                                            isProfileOpen ? "text-[#ea0000]" : "text-white/50 hover:text-white"
                                        }`}
                                    >
                                        <User size={20} strokeWidth={1.5} />
                                        <span className="museo-label text-[10px] hidden lg:block">Account</span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-6 w-64 bg-[#0a0a0a] border border-white/10 z-50 clip-reveal shadow-2xl">
                                            <div className="p-6 border-b border-white/5">
                                                <p className="museo-headline text-lg text-white mb-1">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="museo-body text-xs text-white/40 truncate">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors museo-label"
                                                >
                                                    <User size={14} className="mr-3" /> Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors museo-label"
                                                >
                                                    <List size={14} className="mr-3" /> Orders
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors museo-label"
                                                >
                                                    <Settings size={14} className="mr-3" /> Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-white/5 p-2 bg-white/5">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-4 py-3 text-sm text-[#ea0000] hover:bg-[#ea0000] hover:text-white transition-colors museo-label group"
                                                >
                                                    <LogOut size={14} className="mr-3" /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-4">
                                    <Link
                                        to="/auth/user"
                                        className="museo-label text-[10px] text-white/50 hover:text-white transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/auth/user"
                                        className="museo-label text-[10px] bg-white text-black px-4 py-2 hover:bg-[#ea0000] hover:text-white transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Input Dropdown */}
                <div
                    className={`sm:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out bg-[#0a0a0a] border-b border-white/5 ${
                        isMobileSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="px-6 py-4">
                        <div className="relative flex items-center border-b border-white/20 pb-2">
                            <Search className="h-4 w-4 text-white/40" onClick={handleSearchSubmit}/>
                            <input
                                type="text"
                                autoFocus={isMobileSearchOpen}
                                className="w-full pl-3 pr-4 bg-transparent border-none text-white museo-label text-[10px] focus:outline-none placeholder-white/20"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="lg:hidden absolute top-full left-0 w-full border-t border-white/5 bg-[#050505] shadow-2xl clip-reveal"
                    >
                        <div className="p-6 space-y-6">
                            <Link
                                to="/products"
                                className={`block w-full museo-headline text-2xl text-white`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Collection
                            </Link>

                            <div className="border-t border-white/5 pt-6 space-y-4">
                                {user ? (
                                    <>
                                        <div className="museo-label text-white/30 tracking-[0.3em] mb-4">
                                            {user.first_name} {user.last_name}
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center museo-label text-white/60 hover:text-white"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User size={14} className="mr-4 text-white/30" /> Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center museo-label text-white/60 hover:text-white"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <List size={14} className="mr-4 text-white/30" /> Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center museo-label text-[#ea0000] mt-6"
                                        >
                                            <LogOut size={14} className="mr-4" /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4 flex flex-col mt-4">
                                        <Link
                                            to="/auth/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-4 border border-white/20 text-white museo-label hover:bg-white hover:text-black transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/auth/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-4 bg-white text-black museo-label hover:bg-[#ea0000] hover:text-white transition-colors"
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
