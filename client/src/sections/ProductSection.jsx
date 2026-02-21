import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../features/product/productAction";
import { addToCart } from "../features/cart/cartAction";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

function ProductSection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { products, isLoading, isError } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const handleAddToCart = async (product) => {
        if (!product?.id) return;

        try {
            await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
            toast.success(`${product.product_name} added to cart successfully!`, {
                style: {
                    background: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                },
                iconTheme: {
                    primary: '#ea0000',
                    secondary: '#fff',
                },
            });
        } catch (error) {
            const errorMessage =
                typeof error === "string" ? error : error.message || "Failed to add to cart";
            toast.error(errorMessage, {
                style: {
                    background: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                }
            });
        }
    };

    return (
        <section className="bg-[#050505] py-24 px-6 md:px-12 lg:px-24 relative z-20 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 fade-in-up visible">
                    <div>
                        <span className="museo-label text-white/40 tracking-widest uppercase mb-4 block text-[10px]">
                            Top Picks
                        </span>
                        <h2 className="museo-headline text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none">
                            Featured <br className="hidden md:block" />Products
                        </h2>
                    </div>
                    
                    <button
                        onClick={() => navigate('/products')}
                        className="group flex items-center gap-4 text-white hover:text-[#ea0000] transition-colors pb-2 border-b border-transparent hover:border-[#ea0000] shrink-0 w-fit"
                    >
                        <span className="museo-label tracking-widest text-[10px]">View All Products</span>
                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-32">
                        <div className="w-16 h-[1px] bg-white/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-full bg-white animate-[scroll-right_1.5s_ease-in-out_infinite]" />
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="text-center py-24 border border-white/5 bg-[#0a0a0a]">
                        <p className="museo-label text-white/50 tracking-widest">Unable to load products</p>
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 fade-in-up visible stagger-2">
                        {products?.slice(0, 8).map((product) => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                onViewDetails={(prod) => navigate(`/product/${prod.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductSection;
