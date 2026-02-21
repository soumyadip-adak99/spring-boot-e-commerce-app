import { useState } from "react";
import { ShoppingBag, Star, Heart, Eye } from "lucide-react";

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log(product)
    return (
        <div
            className="group relative bg-[#0a0a0a] border border-white/5 transition-colors duration-500 hover:border-white/20 h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product?.status && product.status !== "IN_STOCK" && (
                    <span className="px-3 py-1 bg-[#050505] text-white border border-white/20 text-[10px] uppercase tracking-widest museo-label">
                        {product.status.replace("_", " ")}
                    </span>
                )}
            </div>

            {/* Quick Actions */}
            <div
                className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-500 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
            >
                <button className="w-10 h-10 bg-[#050505] border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                    <Heart className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(product);
                    }}
                    className="w-10 h-10 bg-[#050505] border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            {/* Image */}
            <div 
                className="relative aspect-[3/4] overflow-hidden bg-[#111] cursor-pointer"
                onClick={() => onViewDetails(product)}
            >
                <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-contain p-4 transition-all duration-700 hover:scale-105"
                />

                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 w-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-[#050505]/90 backdrop-blur-sm">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="w-full py-3 text-white museo-label text-[10px] tracking-widest hover:bg-[#ea0000] transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                        ADD TO CART
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow bg-[#050505] border-t border-white/5">
                <p className="museo-label text-[10px] text-white/40 tracking-widest mb-3">
                    {product.brand || product.category || "Independent"}
                </p>
                <h3
                    onClick={() => onViewDetails(product)}
                    className="museo-headline text-lg mb-4 text-white hover:text-[#ea0000] transition-colors cursor-pointer line-clamp-2"
                >
                    {product.product_name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <span className="museo-headline text-xl text-white">
                        ₹{product.price?.toLocaleString()}
                    </span>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-white/40 fill-white/40" />
                            <span className="museo-body text-sm text-white/60">
                                {product.rating || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
