import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../features/product/productAction";

const getStatusBadge = (status) => {
    switch (status) {
        case "IN_STOCK":
            return (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    In Stock
                </span>
            );
        case "OUT_OF_STOCK":
            return (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Out of Stock
                </span>
            );
        case "COMING_SOON":
            return (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Coming Soon
                </span>
            );
        default:
            return null;
    }
};

function ProductSection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { products, isLoading, isError } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase">
                    Featured Products
                </h2>

                {isLoading && (
                    <p className="text-center text-gray-700 text-lg">Loading products...</p>
                )}

                {isError && (
                    <p className="text-center text-red-500 text-lg">Failed to load products</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products?.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden group">
                                <img
                                    src={product.image}
                                    alt={product.product_name}
                                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(product.status)}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col grow">
                                <div className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
                                    {product.category}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                    {product.product_name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 grow">
                                    {product.product_description}
                                </p>

                                <div className="flex items-center justify-center mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => navigate(`/products`)}
                                        disabled={product.status === "OUT_OF_STOCK"}
                                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                                            product.status === "OUT_OF_STOCK"
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                    >
                                        {product.status === "OUT_OF_STOCK"
                                            ? "Sold Out"
                                            : "View More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductSection;
