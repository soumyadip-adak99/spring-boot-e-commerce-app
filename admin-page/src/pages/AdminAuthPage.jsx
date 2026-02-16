import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetStatus } from "../app/slices/authSlice";
import { loginAdmin } from "../app/actions/authActions";

function AdminAuthPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, errorMessage, user } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess || user) {
            navigate("/dashboard");
        }

        return () => {
            dispatch(resetStatus());
        };
    }, [user, isSuccess, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        dispatch(loginAdmin({ email, password }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Admin Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {isError && errorMessage && (
                        <div className="p-2 text-sm text-center text-red-600 bg-red-100 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 font-bold text-white transition duration-200 rounded-md ${
                            isLoading
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminAuthPage;
