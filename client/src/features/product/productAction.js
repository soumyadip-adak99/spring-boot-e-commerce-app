import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";
import { mockProducts } from "../../utils/mockData";

const PRODUCT_API_URL = `${BASE_API}/product`;

export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (id, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const product = mockProducts.find(p => p.id === id);
            
            if (!product) {
                throw new Error("Product not found");
            }
            
            return product;
        } catch (error) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockProducts;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
