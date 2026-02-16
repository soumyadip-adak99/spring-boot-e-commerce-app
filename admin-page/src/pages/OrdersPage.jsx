import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../app/actions/ordersAction";

function OrdersPage() {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, errorMessage } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "success" || s === "paid" || s === "completed") {
            return (
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                    Success
                </span>
            );
        } else if (s === "pending" || s === "processing") {
            return (
                <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                    Pending
                </span>
            );
        } else if (s === "failed" || s === "cancelled") {
            return (
                <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                    Failed
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                {status}
            </span>
        );
    };

    const renderComplexField = (field) => {
        if (!field) return "N/A";
        if (typeof field === "string") return field;
        if (Array.isArray(field)) return `${field.length} Items`;
        if (typeof field === "object") return JSON.stringify(field).slice(0, 30) + "...";
        return field;
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <span className="text-sm text-gray-500">{orders?.length || 0} Total Orders</span>
            </div>

            {isError && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                    <p className="font-bold">Error</p>
                    <p>{errorMessage || "Something went wrong fetching orders."}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {!isError && orders?.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500 text-lg">No orders found.</p>
                        </div>
                    )}

                    {!isError && orders?.length > 0 && (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-200">
                                        {[
                                            "ID",
                                            "Status",
                                            "Mode",
                                            "User ID",
                                            "Address ID",
                                            "Product ID",
                                            "Date",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-5 text-sm bg-white">
                                                <p
                                                    className="text-gray-900 whitespace-nowrap"
                                                    title={order._id}
                                                >
                                                    #{order._id?.slice(-6).toUpperCase()}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 text-sm bg-white">
                                                {getStatusBadge(order.payment_status)}
                                            </td>

                                            <td className="px-5 py-5 text-sm text-gray-500 bg-white capitalize">
                                                {order.payment_mode}
                                            </td>

                                            <td className="px-5 py-5 text-sm bg-white">
                                                <p className="text-gray-900 whitespace-nowrap">
                                                    {order.userId}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 text-sm text-gray-500 bg-white">
                                                {renderComplexField(order.address)}
                                            </td>

                                            <td className="px-5 py-5 text-sm text-gray-500 bg-white">
                                                {renderComplexField(order.product)}
                                            </td>

                                            <td className="px-5 py-5 text-sm text-gray-500 bg-white whitespace-nowrap">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OrdersPage;
