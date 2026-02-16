import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../app/actions/ordersAction";
import { getAllProducts } from "../app/actions/productActions";
import { BadgeIndianRupee, Handbag, CircleCheckBig, Clock } from "lucide-react";

function DashboardPage() {
    const dispatch = useDispatch();

    const { orders, isLoading: ordersLoading } = useSelector((state) => state.orders);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAllOrders());
        dispatch(getAllProducts());
    }, [dispatch]);

    const stats = useMemo(() => {
        let calculatedStats = { revenue: 0, total: 0, success: 0, pending: 0 };

        if (!orders || orders.length === 0) return calculatedStats;

        orders.forEach((order) => {
            calculatedStats.total += 1;

            const status = order.payment_status ? order.payment_status.toUpperCase() : "";

            if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
                calculatedStats.success += 1;

                if (products && products.length > 0) {
                    const productDetail = products.find((p) => p._id === order.product);

                    if (productDetail) {
                        calculatedStats.revenue += productDetail.price || 0;
                    }
                }
            } else {
                calculatedStats.pending += 1;
            }
        });

        return calculatedStats;
    }, [orders, products]);

    const getProductName = (productId) => {
        if (!products) return "Loading...";
        const prod = products.find((p) => p._id === productId);
        return prod ? prod.product_name : "Unknown Product";
    };

    const getProductPrice = (productId) => {
        if (!products) return 0;
        const prod = products.find((p) => p._id === productId);
        return prod ? prod.price : 0;
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="p-3 mr-4 bg-green-100 rounded-full">
                        <BadgeIndianRupee className="text-green-700" size={28} />
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {ordersLoading ? "..." : `₹${stats.revenue.toLocaleString()}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="p-3 mr-4 bg-blue-100 rounded-full">
                        <Handbag className="text-indigo-500" size={28} />
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {ordersLoading ? "..." : stats.total}
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border-l-4 border-indigo-500">
                    <div className="p-3 mr-4 bg-indigo-100 rounded-full">
                        <CircleCheckBig className="text-indigo-500" size={28} />
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Completed Orders</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {ordersLoading ? "..." : stats.success}
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="p-3 mr-4 bg-yellow-100 rounded-full">
                        <Clock className="text-yellow-500" size={28} />
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Pending / Failed</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {ordersLoading ? "..." : stats.pending}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Product Name
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders && orders.length > 0 ? (
                                [...orders]
                                    .reverse()
                                    .slice(0, 5)
                                    .map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {getProductName(order.product)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                ₹ {getProductPrice(order.product)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        (
                                                            order.payment_status || ""
                                                        ).toUpperCase() === "PAID"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-sm text-center text-gray-500"
                                    >
                                        No orders available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
