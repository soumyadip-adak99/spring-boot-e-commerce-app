import { useState, useEffect, useMemo, useRef } from "react";
import {
    Filter,
    ChevronDown,
    X,
    Home,
    ChevronRight,
    SlidersHorizontal,
    Search,
} from "lucide-react";
import gsap from "gsap";

import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../sections/Navbar";

import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/product/productAction";
import { addToCart } from "../features/cart/cartAction";
import toast from "react-hot-toast";

export default function AllProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");

    const productState = useSelector((state) => state.product);
    const { products, isLoading, isError } = productState || {
        products: [],
        isLoading: true,
        isError: false,
    };

    const safeProducts = Array.isArray(products) ? products : [];

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState(500);
    const [sortOption, setSortOption] = useState("recommended");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const gridRef = useRef(null);

    useEffect(() => {
        dispatch(getAllProducts());
        window.scrollTo(0, 0);
    }, [dispatch]);

    const handleAddToCart = async (product) => {
        if (!product?.id) return;

        try {
            await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
            toast.success(`${product.product_name} added to cart!`, {
                style: {
                    background: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                },
                iconTheme: {
                    primary: '#ea0000',
                    secondary: '#fff',
                }
            });
        } catch (error) {
            const errorMessage =
                typeof error === "string" ? error : error.message || "Failed to add to cart";
            toast.error(errorMessage, {
                style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        }
    };

    const categories = useMemo(() => {
        if (!Array.isArray(safeProducts)) return ["All"];

        const unique = [
            "All",
            ...new Set(
                safeProducts
                    .map((p) => p.category)
                    .filter((c) => c && !["all", "all products"].includes(c.toLowerCase()))
            ),
        ];

        return unique;
    }, [safeProducts]);

    const priceRange = useMemo(() => {
        if (safeProducts.length === 0) return { min: 0, max: 100000 };
        const prices = safeProducts.map((p) => p.price || 0);
        return { min: Math.min(...prices), max: Math.max(...prices) + 500 };
    }, [safeProducts]);

    const filteredProducts = useMemo(() => {
        let result = safeProducts;

        if (searchQuery) {
            result = result.filter((p) => 
                (p.product_name || "").toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        result = result.filter((p) => (p.price || 0) <= maxPrice);

        switch (sortOption) {
            case "priceLowHigh":
                return [...result].sort((a, b) => a.price - b.price);
            case "priceHighLow":
                return [...result].sort((a, b) => b.price - a.price);
            case "rating":
                return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return result;
        }
    }, [safeProducts, selectedCategory, maxPrice, sortOption, searchQuery]);

    useEffect(() => {
        if (priceRange.max !== 100000) setMaxPrice(priceRange.max);
    }, [priceRange.max]);

    useEffect(() => {
        if (gridRef.current && filteredProducts.length > 0) {
            const cards = gridRef.current.children;
            gsap.fromTo(
                cards,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, [filteredProducts, sortOption, maxPrice]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#050505] relative z-10 text-white">
                <div className="w-16 h-[1px] bg-white/20 relative overflow-hidden mb-4">
                    <div className="absolute top-0 left-0 h-full w-full bg-white animate-[scroll-right_1.5s_ease-in-out_infinite]" />
                </div>
                <span className="museo-label tracking-widest text-[#ea0000] text-[10px]">LOADING PRODUCTS</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-white/50 relative z-10">
                <span className="museo-headline text-2xl mb-2">Error Loading Products</span>
                <span className="museo-label tracking-widest text-[10px]">PLEASE TRY AGAIN LATER</span>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen font-sans text-white relative z-10 selection:bg-[#ea0000] selection:text-white pb-32">
            <Navbar />

            <div className="sticky top-[80px] z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-6">
                    <nav className="flex items-center text-white/30 mb-8 museo-label text-[10px] tracking-widest">
                        <Link to="/" className="hover:text-white transition-colors">
                            HOME
                        </Link>
                        <ChevronRight size={10} className="mx-3" />
                        <span className="hover:text-white transition-colors">COLLECTION</span>
                        <ChevronRight size={10} className="mx-3" />
                        <span className="text-white border-b border-white pb-0.5">
                            {searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : (selectedCategory === "All" ? "ALL PRODUCTS" : selectedCategory.toUpperCase())}
                        </span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <h1 className="museo-headline text-4xl sm:text-5xl text-white tracking-tight clip-reveal">
                            {searchQuery ? `Search Results` : (selectedCategory === "All" ? "The Collection" : selectedCategory)}
                            <span className="text-[#ea0000] text-lg ml-6 tracking-widest museo-label">[{filteredProducts.length}]</span>
                        </h1>

                        <div className="flex items-center gap-6 fade-in-up visible stagger-1">
                            <div className="relative group">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-transparent border-b border-white/20 text-white museo-label text-[10px] tracking-widest py-2 pl-0 pr-8 focus:outline-none cursor-pointer transition-colors hover:border-white focus:border-white w-48"
                                >
                                    <option value="recommended" className="bg-[#0a0a0a]">RECOMMENDED</option>
                                    <option value="priceLowHigh" className="bg-[#0a0a0a]">PRICE: LOW TO HIGH</option>
                                    <option value="priceHighLow" className="bg-[#0a0a0a]">PRICE: HIGH TO LOW</option>
                                    <option value="rating" className="bg-[#0a0a0a]">TOP RATED</option>
                                </select>
                                <ChevronDown
                                    size={12}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-hover:text-white transition-colors"
                                />
                            </div>

                            <button
                                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                className="lg:hidden text-white/50 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span className="museo-label tracking-widest text-[10px]">FILTERS</span>
                                {isMobileFiltersOpen ? (
                                    <X size={14} />
                                ) : (
                                    <SlidersHorizontal size={14} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileFiltersOpen && (
                <div className="lg:hidden bg-[#0a0a0a] border-b border-white/5 p-8">
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        categories={categories}
                        priceRange={priceRange}
                    />
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-16">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    <aside className="hidden lg:block w-64 shrink-0 fade-in-up visible stagger-2">
                        <div className="sticky top-48">
                            <div className="flex items-center gap-3 mb-12 text-white pb-4 border-b border-white/10 uppercase tracking-widest museo-label text-[10px]">
                                <Filter size={12} className="text-[#ea0000]" />
                                <span>Refine Products</span>
                            </div>
                            <CategoryFilter
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                categories={categories}
                                priceRange={priceRange}
                            />
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0 fade-in-up visible stagger-3">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 px-4 border border-white/5 bg-[#0a0a0a] text-center">
                                <Search size={32} className="text-[#ea0000] mb-6" strokeWidth={1} />
                                <h3 className="museo-headline text-2xl text-white mb-4">
                                    No Products Found
                                </h3>
                                <p className="museo-body text-white/40 mb-10 max-w-md">
                                    No products match your current criteria. Consider adjusting your filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setMaxPrice(priceRange.max);
                                        navigate("/products"); 
                                    }}
                                    className="px-10 py-5 bg-white text-black museo-label hover:bg-[#ea0000] hover:text-white transition-colors"
                                >
                                    RESET FILTERS
                                </button>
                            </div>
                        ) : (
                            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onViewDetails={(p) => navigate(`/product/${p.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
