import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../app/actions/productActions";

function AllProducts() {
    const dispatch = useDispatch();

    const { products, isLoading, isError, errorMessage } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const getStatusBadge = (status) => {
        if (status === "IN_STOCK") {
            return (
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                    In Stock
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                    Out of Stock
                </span>
            );
        }
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <div className="flex items-center justify-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
            </div>

            {isError && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                    <p className="font-bold">Error</p>
                    <p>{errorMessage || "Failed to load products."}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                    Product
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                    Price
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                    Category
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                    Product ID
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4 text-sm bg-white">
                                            <div className="flex items-center">
                                                <div className="shrink-0 w-12 h-12">
                                                    <img
                                                        className="object-cover w-full h-full rounded-md border"
                                                        src={product.image}
                                                        alt={product.product_name}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                                                        {product.product_name}
                                                    </p>

                                                    <p className="text-xs text-gray-500 truncate w-40">
                                                        {product.product_description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm bg-white">
                                            <p className="font-medium text-gray-900">
                                                ₹{product.price}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm bg-white">
                                            <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                {product.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm bg-white">
                                            {getStatusBadge(product.status)}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-500 bg-white">
                                            <p className="font-mono text-xs">{product._id}</p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AllProducts;
