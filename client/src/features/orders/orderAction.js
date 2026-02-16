import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({ id, orderData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                return rejectWithValue("Unauthorized: Token missing");
            }

            const response = await fetch(`${BASE_API}/user/create-order/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data.error_message || data.message || "Order creation failed"
                );
            }
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
