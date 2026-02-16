import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";

const PUBLIC_API_URL = `${BASE_API}/public`;
const AUTH_API_URL = `${BASE_API}/auth`;
const USER_API_URL = `${BASE_API}/user`;

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Registration failed");

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error_message || data.message || "Login failed");

            const loginData = data.data;
            localStorage.setItem("jwtToken", loginData.token);

            const userDetails = await dispatch(getUserDetails());

            if (userDetails.payload) {
                localStorage.setItem("user", JSON.stringify(userDetails.payload));
                localStorage.setItem("cart_item", JSON.stringify(userDetails.payload.cart_items));
            }

            return { token: loginData.token, user: userDetails.payload };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            await fetch(`${AUTH_API_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_item");

        return { success: true };
    } catch (error) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_item");
        return rejectWithValue(error.message);
    }
});

export const getUserDetails = createAsyncThunk(
    "auth/getUserDetails",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) throw new Error("User unauthorized");

            const response = await fetch(`${USER_API_URL}/user-details`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.error_message || data.message || "Failed to fetch user");

            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAddress = createAsyncThunk(
    "address/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                return rejectWithValue("User not authenticated");
            }

            const response = await fetch(`${USER_API_URL}/add-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addressData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error_message || "Failed to add address");
            }

            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            localStorage.removeItem("cart_item");
        },
        resetStatus: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = "";
        },
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.isSuccess = true;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.isError = true;
                state.errorMessage = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (!state.user) {
                    state.user = {};
                }

                if (!Array.isArray(state.user.address)) {
                    state.user.address = [];
                }

                state.user.address.push(action.payload);

                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    },
});

export const { logout, resetStatus, setCredentials } = authSlice.actions;

export default authSlice.reducer;
