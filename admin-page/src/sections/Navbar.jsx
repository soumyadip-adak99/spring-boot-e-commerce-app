import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetStatus } from "../app/slices/authSlice";
import AddProductModal from "../components/AddProductModal";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(resetStatus());
        navigate("/login");
    };

    return (
        <>
            <nav className="bg-white shadow-md relative z-10">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                                    AdminPanel
                                </Link>
                            </div>

                            <div className="hidden ml-6 space-x-8 sm:flex sm:items-center">
                                <Link
                                    to="/dashboard"
                                    className="px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/orders"
                                    className="px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600"
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/products"
                                    className="px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600"
                                >
                                    All Products
                                </Link>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-transparent hover:border-blue-800 hover:text-blue-800 cursor-pointer"
                                >
                                    + Add Product
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center ml-6">
                            <div className="flex items-center space-x-4">
                                {user && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-400">Signed in as</span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {user.email}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Render the Modal */}
            <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default Navbar;
