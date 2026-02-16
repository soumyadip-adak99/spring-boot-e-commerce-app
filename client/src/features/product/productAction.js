import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";

const PRODUCT_API_URL = `${BASE_API}/product`;

export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (id, { rejectWithValue }) => {
        try {
            if (!BASE_API) {
                throw new Error("API URL is missing. Check your .env file.");
            }

            const response = await fetch(`${PRODUCT_API_URL}/get-by-id/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || response.statusText || "Server error: Non-JSON response");
            }

            if (!response.ok) {
                throw new Error(
                    data.error_message ||
                        data.message ||
                        `Error ${response.status}: ${response.statusText}`
                );
            }

            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_API}/public/get-all-products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response) {
                throw new Error("No response from server");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error_message || data.message || "Failed to fetch products");
            }

            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
