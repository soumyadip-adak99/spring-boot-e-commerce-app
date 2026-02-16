import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API } from "../../utils/constance";

export const loginAdmin = createAsyncThunk("auth/loginAdmin", async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${BASE_API}/public/admin-login`, userData);

        if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("jwtToken", response.data.token);
        }

        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
