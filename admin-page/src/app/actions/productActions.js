import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constance";

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
                throw new Error(data.message || "Failed to fetch products");
            }

            return data.products;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            const response = await fetch(`${BASE_API}/admin/add-product`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: productData,
            });

            const result = await response.json();

            if (!response.ok) {
                return rejectWithValue(result.message || "Failed to add product");
            }

            return result;
        } catch (error) {
            return rejectWithValue("Failed to add product");
        }
    }
);
