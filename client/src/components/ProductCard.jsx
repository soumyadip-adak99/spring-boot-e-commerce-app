import { ShoppingCart, Heart, Star, Eye } from "lucide-react";

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    return (
        <div className="bg-white w-full max-w-sm rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden flex flex-col">
            <figure className="relative h-56 bg-gray-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                />

                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-red-500 transition">
                    <Heart size={18} />
                </button>

                {product?.status && product.status !== "IN_STOCK" && (
                    <span className="absolute top-3 left-3 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {product.status.replace("_", " ")}
                    </span>
                )}
            </figure>

            <div className="p-4 flex flex-col gap-3 grow">
                <div className="flex justify-between items-center">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-semibold">
                        {product.category}
                    </span>

                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                </div>

                <h2
                    onClick={() => onViewDetails(product)}
                    className="text-lg font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition"
                >
                    {product.product_name}
                </h2>

                <div className="mt-auto pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400 uppercase">Price</span>
                    <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
                </div>

                <div className="flex gap-2 mt-1">
                    <button
                        onClick={() => onAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-indigo-50 text-indigo-700 py-2.5 rounded-lg hover:bg-indigo-100 active:scale-95 transition border border-indigo-100"
                    >
                        <ShoppingCart size={18} />
                        Add
                    </button>

                    <button
                        onClick={() => onViewDetails(product)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-indigo-600 text-white py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 active:scale-95 transition"
                    >
                        <Eye size={18} />
                        View & Buy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
