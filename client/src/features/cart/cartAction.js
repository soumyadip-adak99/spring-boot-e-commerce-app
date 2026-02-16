import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";
import { getUserDetails } from "../appFeatures/authSlice";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                return rejectWithValue("Please login to add items to cart");
            }
            const id = productId.productId;

            const response = await fetch(`${BASE_API}/user/add-to-cart/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error_message || "Failed to add to cart");
            }
            dispatch(getUserDetails());
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
