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

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const existing = products.find(p => p.id === id);
                if (existing) {
                    setProduct(existing);
                    setSelectedImage(existing.image);
                }

                const data = await dispatch(getProductById(id)).unwrap();
                setProduct(data);
                setSelectedImage(data.image);
                
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
    }, [id, dispatch, products]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
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
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to add to cart", {
                 style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        }
    };

    const handleBuyNow = () => {
        if (!product) return;
        navigate(`/buy-product/${product.id}?quantity=${quantity}`);
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative z-10">
                <div className="w-16 h-[1px] bg-white/20 relative overflow-hidden mb-4">
                    <div className="absolute top-0 left-0 h-full w-full bg-white animate-[scroll-right_1.5s_ease-in-out_infinite]" />
                </div>
                <span className="museo-label tracking-widest text-[#ea0000] text-[10px]">LOADING PRODUCT</span>
            </div>
        );
    }

    if (error || (!loading && !product)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-4 text-center relative z-10">
                <AlertCircle className="h-12 w-12 text-[#ea0000] mb-6" strokeWidth={1} />
                <h2 className="museo-headline text-3xl text-white mb-4">Product Not Found</h2>
                <p className="museo-body text-white/50 mb-10 max-w-md">{error || "The product you are looking for has been removed or does not exist."}</p>
                <Link to="/products" className="px-10 py-4 bg-white hover:bg-[#ea0000] hover:text-white text-black transition-colors museo-label tracking-widest text-[10px]">
                    RETURN TO PRODUCTS
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen font-sans text-white pb-32 relative z-10 selection:bg-[#ea0000] selection:text-white">
            <Navbar />
            
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-16 clip-reveal">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-3 text-white/40 hover:text-white mb-12 transition-colors museo-label tracking-widest text-[10px]"
                >
                    <ArrowLeft size={14} /> BACK TO PRODUCTS
                </Link>

                <div className="border border-white/5 bg-[#0a0a0a] overflow-hidden mb-24">
                    <div className="flex flex-col lg:flex-row">
                        {/* Product Image Section */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-16 bg-[#111] flex flex-col items-center justify-center relative group border-b lg:border-b-0 lg:border-r border-white/5">
                            <div className="relative w-full aspect-square max-w-[500px]">
                                <img
                                    src={selectedImage || product.image}
                                    alt={product.product_name}
                                    className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
                                />
                            </div>
                            
                            {/* Status Badge */}
                             {product.status && (
                                <div className="absolute top-8 left-8">
                                    <span
                                        className={`px-4 py-2 text-[10px] uppercase tracking-widest museo-label border ${
                                            product.status === "IN_STOCK"
                                                ? "bg-transparent text-white border-white/20"
                                                : "bg-[#ea0000]/10 text-[#ea0000] border-[#ea0000]/30"
                                        }`}
                                    >
                                        {product.status.replace("_", " ")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-[#050505] relative">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />
                            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
                            
                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="museo-label text-white/40 uppercase tracking-widest text-[10px]">
                                        {product.category || "General"}
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <div className="flex items-center gap-1.5 text-white/60">
                                        <Star size={12} fill="currentColor" className="text-[#ea0000]" />
                                        <span className="museo-body text-sm">
                                            {product.rating || "4.5"}
                                        </span>
                                        <span className="museo-label text-[10px] tracking-widest text-white/30 ml-2">
                                            ({product.reviews || 120} REVIEWS)
                                        </span>
                                    </div>
                                </div>

                                <h1 className="museo-headline text-4xl sm:text-5xl lg:text-6xl text-white leading-none mb-8 tracking-tight clip-reveal">
                                    {product.product_name}
                                </h1>

                                <div className="flex items-center flex-wrap gap-6 mb-10 fade-in-up visible stagger-1">
                                    <span className="museo-headline text-3xl font-medium text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.oldPrice && (
                                        <span className="museo-body text-xl text-white/30 line-through">
                                            {formatPrice(product.oldPrice)}
                                        </span>
                                    )}
                                </div>

                                <p className="museo-body text-white/60 leading-relaxed text-lg max-w-xl fade-in-up visible stagger-2">
                                    {product.product_description ||
                                        "Experience premium luxury and unmatched quality. Built for durability and style, this meticulously designed piece perfectly blends functionality with modern aesthetics for everyday elegance."}
                                </p>
                            </div>

                            {/* Features / Benefits */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5 mb-12 fade-in-up visible stagger-3">
                                <div className="flex items-start gap-5 p-6 bg-[#0a0a0a]">
                                    <div className="text-white mt-1">
                                        <Truck size={20} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="museo-headline text-white text-sm tracking-wide mb-1">Global Delivery</p>
                                        <p className="museo-body text-xs text-white/40">Complimentary handling</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 p-6 bg-[#0a0a0a]">
                                    <div className="text-white mt-1">
                                        <ShieldCheck size={20} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="museo-headline text-white text-sm tracking-wide mb-1">
                                            Certificate
                                        </p>
                                        <p className="museo-body text-xs text-white/40">Guaranteed authentic</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto fade-in-up visible stagger-4">
                                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                    <div className="sm:w-40 border border-white/20 p-2 flex items-center justify-between">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white disabled:opacity-20 transition-all"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-medium text-white museo-body w-10 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white transition-all"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="flex-1 flex gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.status === "OUT_OF_STOCK"}
                                            className="flex-1 py-4 border border-white/20 hover:border-white text-white transition-colors disabled:opacity-30 disabled:hover:border-white/20 flex flex-col items-center justify-center"
                                        >
                                            <span className="museo-label text-[10px] tracking-[0.2em] mb-1">ADD TO</span>
                                            <span className="museo-headline text-sm tracking-widest">CART</span>
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={product.status === "OUT_OF_STOCK"}
                                            className="flex-1 py-4 bg-white hover:bg-[#ea0000] hover:text-white text-black transition-colors disabled:opacity-30 disabled:bg-white/20 disabled:text-white/40 flex flex-col items-center justify-center"
                                        >
                                            <span className="museo-label text-[10px] tracking-[0.2em] mb-1">BUY</span>
                                            <span className="museo-headline text-sm tracking-widest">{product.status === "OUT_OF_STOCK" ? "UNAVAILABLE" : "NOW"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-end justify-between mb-12 pb-6 border-b border-white/5 opacity-0 section-reveal visible">
                            <div>
                                <h2 className="museo-label text-[10px] text-white/40 tracking-[0.3em] mb-2 uppercase">You Might Also Like</h2>
                                <h2 className="museo-headline text-3xl sm:text-4xl text-white tracking-tight">Similar Products</h2>
                            </div>
                            <Link to="/products" className="text-white/40 hover:text-white transition-colors pb-1 border-b border-transparent hover:border-white museo-label text-[10px] tracking-[0.2em] hidden sm:block">
                                EXPLORE PRODUCTS
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 opacity-0 section-reveal visible stagger-1">
                            {relatedProducts.map((p) => (
                                <ProductCard 
                                    key={p.id} 
                                    product={p} 
                                    onAddToCart={(prod) => {
                                        dispatch(addToCart({ productId: prod.id, quantity: 1 }));
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
