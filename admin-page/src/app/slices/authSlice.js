import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../actions/authActions";

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    token: localStorage.getItem("jwtToken") || null,
    isLoading: false,
    isError: false,
    errorMessage: "",
    isSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = "";
        },
        logout: (state) => {
            localStorage.removeItem("user");
            localStorage.removeItem("jwtToken");
            state.user = null;
            state.token = null;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = "";
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.errorMessage = "";
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
                state.user = null;
                state.token = null;
            });
    },
});

export const { resetStatus, logout } = authSlice.actions;
export default authSlice.reducer;
