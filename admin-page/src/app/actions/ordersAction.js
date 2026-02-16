import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API } from "../../utils/constance";

export const getAllOrders = createAsyncThunk("orders/getAll", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("jwtToken");

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.get(`${BASE_API}/admin/get-all-order`, config);

        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || error.message || "Something went wrong"
        );
    }
});
