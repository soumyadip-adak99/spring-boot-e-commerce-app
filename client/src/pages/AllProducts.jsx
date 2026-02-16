import { useState, useEffect, useMemo } from "react";
import {
    Filter,
    ChevronDown,
    X,
    Home,
    ChevronRight,
    SlidersHorizontal,
    Search,
} from "lucide-react";

import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import Navbar from "../sections/Navbar";
import ProductModal from "../components/ProductModal";

import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/product/productAction";
import { addToCart } from "../features/cart/cartAction";

export default function AllProducts() {
    const dispatch = useDispatch();

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
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const handleAddToCart = async (product) => {
        if (!product?._id) return;

        try {
            await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
            alert(`${product.productName} added to cart successfully!`);
        } catch (error) {
            const errorMessage =
                typeof error === "string" ? error : error.message || "Failed to add to cart";
            alert(errorMessage);
        }
    };

    const categories = useMemo(() => {
        if (!Array.isArray(safeProducts)) return [];

        const unique = [
            ...new Set(
                safeProducts
                    .map((p) => p.category)

                    .filter((c) => c && !["all", "all products"].includes(c.toLowerCase()))
            ),
        ];

        return unique;
    }, [safeProducts]);

    const priceRange = useMemo(() => {
        if (safeProducts.length === 0) return { min: 0, max: 1000 };
        const prices = safeProducts.map((p) => p.price);
        return { min: Math.min(...prices), max: Math.max(...prices) + 50 };
    }, [safeProducts]);

    const filteredProducts = useMemo(() => {
        let result = safeProducts;

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        result = result.filter((p) => p.price <= maxPrice);

        switch (sortOption) {
            case "priceLowHigh":
                return [...result].sort((a, b) => a.price - b.price);
            case "priceHighLow":
                return [...result].sort((a, b) => b.price - a.price);
            case "rating":
                return [...result].sort((a, b) => b.rating - a.rating);
            default:
                return result;
        }
    }, [safeProducts, selectedCategory, maxPrice, sortOption]);

    useEffect(() => {
        if (priceRange.max !== 1000) setMaxPrice(priceRange.max);
    }, [priceRange.max]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-xl font-semibold bg-gray-50 text-indigo-600">
                Loading products...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-500 bg-gray-50">
                Failed to load products.
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-indigo-600 flex items-center gap-1">
                            <Home size={14} /> Home
                        </Link>
                        <ChevronRight size={14} className="mx-2 text-gray-300" />
                        <span>Shop</span>
                        <ChevronRight size={14} className="mx-2 text-gray-300" />
                        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                            {selectedCategory === "All" ? "All Products" : selectedCategory}
                        </span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {selectedCategory === "All" ? "All Products" : selectedCategory}
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="priceLowHigh">Price: Low to High</option>
                                    <option value="priceHighLow">Price: High to Low</option>
                                    <option value="rating">Best Rating</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>

                            <button
                                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                className="lg:hidden p-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                            >
                                {isMobileFiltersOpen ? (
                                    <X size={20} />
                                ) : (
                                    <SlidersHorizontal size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileFiltersOpen && (
                <div className="lg:hidden bg-white border-b border-gray-200 p-4">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64">
                        <div className="sticky top-40">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-6 text-gray-900 pb-4 border-b border-gray-100">
                                    <Filter size={20} className="text-indigo-600" />
                                    <h2 className="font-bold text-lg">Filters</h2>
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
                        </div>
                    </aside>

                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                                <Search size={32} className="text-gray-300" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    No matches found
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setMaxPrice(priceRange.max);
                                    }}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-xl mt-4 hover:bg-gray-800"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onViewDetails={(p) => setSelectedProduct(p)}
                                    />
                                ))}
                            </div>
                        )}
                    </main>

                    {selectedProduct && (
                        <ProductModal
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
