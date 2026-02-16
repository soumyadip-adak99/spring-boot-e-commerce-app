import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, getAllProducts } from "../features/product/productAction";
import { addToCart } from "../features/cart/cartAction";
import {
    Star,
    Truck,
    ShieldCheck,
    Minus,
    Plus,
    CreditCard,
    ShoppingCart,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";
import Navbar from "../sections/Navbar";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    const { products, isLoading: productsLoading } = useSelector((state) => state.product);
    // We might need a separate state for single product if getProductById stores it differently,
    // but typically it might return data directly or store in a 'selectedProduct' field.
    // Looking at productSlice might be needed, but usually actions return data.
    // Let's rely on local state for the specific product if the slice doesn't enforce a 'currentProduct'
    // Actually, getProductById in productAction.js returns data.data.
    // We can just use a local state for the fetched product or selector if it persists.
    // For now, let's assume we fetch it and store it locally or use a cached one from products list if available,
    // but better to fetch fresh.
    
    // Wait, typical pattern:
    // dispatch(getProductById(id)) -> updates state.product.selectedProduct?
    // Let's check productSlice.js to be sure where it stores it.
    // If not stored, we might need to handle the promise result.
    // For now, I'll assume we can find it in 'products' list OR fetch it. 
    // Actually, looking at previous artifacts, getProductById returns the product.
    // I will use a local state for `product` to keep it simple and isolated.

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                // First check if we have it in Redux products list to show immediately (optimistic)
                const existing = products.find(p => p.id === id);
                if (existing) {
                    setProduct(existing);
                    setSelectedImage(existing.image);
                }

                // Fetch fresh details
                const data = await dispatch(getProductById(id)).unwrap();
                setProduct(data);
                setSelectedImage(data.image);
                
                // Also ensure we have all products for "Related Products"
                if (products.length === 0) {
                    dispatch(getAllProducts());
                }
            } catch (err) {
                setError(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
            window.scrollTo(0, 0);
        }
    }, [id, dispatch]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
            toast.success(`${product.product_name} added to cart!`);
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to add to cart");
        }
    };

    const handleBuyNow = () => {
        if (!product) return;
        // Navigate to checkout with this specific product
        navigate(`/buy-product/${product.id}`);
    };

    const relatedProducts = useMemo(() => {
        if (!product || !products.length) return [];
        return products
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product, products]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (loading && !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading product details...</p>
            </div>
        );
    }

    if (error || (!loading && !product)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "The product you are looking for does not exist."}</p>
                <Link to="/products" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                    Browse All Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Shop
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="flex flex-col lg:flex-row">
                        {/* Product Image Section */}
                        <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-gray-50 flex flex-col items-center justify-center relative group">
                            <div className="relative w-full aspect-square max-w-[500px] mix-blend-multiply">
                                <img
                                    src={selectedImage || product.image}
                                    alt={product.product_name}
                                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            
                            {/* Status Badge */}
                             {product.status && (
                                <div className="absolute top-6 left-6">
                                    <span
                                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                                            product.status === "IN_STOCK"
                                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                : product.status === "OUT_OF_STOCK"
                                                  ? "bg-red-100 text-red-800 border border-red-200"
                                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                                        }`}
                                    >
                                        {product.status.replace("_", " ")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                        {product.category || "General"}
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-sm font-bold ml-1">
                                            {product.rating || "4.5"}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-1 border-l border-gray-300 pl-1">
                                            ({product.reviews || 120} reviews)
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
                                    {product.product_name}
                                </h1>

                                <div className="flex items-center flex-wrap gap-4 mb-6">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-xl text-gray-400 line-through decoration-gray-300 decoration-2">
                                            {formatPrice(product.oldPrice)}
                                        </span>
                                    )}
                                     <span className="text-green-700 text-sm font-bold bg-green-100 px-3 py-1 rounded-full uppercase tracking-wide border border-green-200">
                                        Free Delivery
                                    </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {product.product_description ||
                                        "Experience premium quality with this meticulously designed product. Built for durability and style, it perfectly blends functionality with modern aesthetics for everyday use."}
                                </p>
                            </div>

                            {/* Features / Benefits */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Free Shipping</p>
                                        <p className="text-xs text-gray-500 mt-0.5">2-3 business days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">
                                            Genuine Product
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">Quality checked</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                    <div className="sm:w-32">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1.5 border border-gray-200 w-full">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all rounded-lg shadow-sm"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="flex-1 text-center font-bold text-gray-900">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white text-gray-600 hover:text-gray-900 transition-all rounded-lg shadow-sm"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.status === "OUT_OF_STOCK"}
                                        className="flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-indigo-100 bg-white text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={product.status === "OUT_OF_STOCK"}
                                        className="flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CreditCard size={20} />
                                        {product.status === "OUT_OF_STOCK" ? "Out of Stock" : "Buy Now"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                            <Link to="/products" className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard 
                                    key={p.id} 
                                    product={p} 
                                    onAddToCart={(prod) => {
                                        dispatch(addToCart({ productId: prod.id, quantity: 1 }));
                                        toast.success("Added to cart");
                                    }}
                                    onViewDetails={(prod) => {
                                        navigate(`/product/${prod.id}`);
                                        window.scrollTo(0,0);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
