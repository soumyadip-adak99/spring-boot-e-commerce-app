import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
            
            let users = JSON.parse(localStorage.getItem("demo_users")) || [];
            
            // Check if user exists
            if (users.find(u => u.email === userData.email)) {
                throw new Error("Email already registered");
            }
            
            const newUser = {
                id: `usr_${Date.now()}`,
                ...userData,
                cart_items: [],
                address: []
            };
            
            users.push(newUser);
            localStorage.setItem("demo_users", JSON.stringify(users));
            
            return { message: "Registration successful" };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
            
            // Create default demo user if it doesn't exist
            let users = JSON.parse(localStorage.getItem("demo_users")) || [];
            if (users.length === 0 || !users.find(u => u.email === "abc@email.com")) {
                users.push({
                    id: "demo_usr_01",
                    first_name: "Demo",
                    last_name: "User",
                    email: "abc@email.com",
                    password: "123456",
                    cart_items: [],
                    address: []
                });
                localStorage.setItem("demo_users", JSON.stringify(users));
            }
            
            const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
            
            if (!user) {
                throw new Error("Invalid credentials");
            }
            
            const token = `demo_token_${user.id}`;
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("loggedInUserId", user.id);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("cart_item", JSON.stringify(user.cart_items));
            
            return { token, user };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("loggedInUserId");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_item");

        return { success: true };
    } catch (error) {
        return rejectWithValue("Logout failed");
    }
});

export const getUserDetails = createAsyncThunk(
    "auth/getUserDetails",
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem("loggedInUserId");
            if (!userId) throw new Error("User unauthorized");
            
            const users = JSON.parse(localStorage.getItem("demo_users")) || [];
            const user = users.find(u => u.id === userId);
            
            if (!user) {
                throw new Error("User not found");
            }
            
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAddress = createAsyncThunk(
    "address/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem("loggedInUserId");
            if (!userId) {
                return rejectWithValue("User not authenticated");
            }
            
            let users = JSON.parse(localStorage.getItem("demo_users")) || [];
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                return rejectWithValue("User not found");
            }
            
            const newAddress = {
                id: `addr_${Date.now()}`,
                ...addressData
            };
            
            users[userIndex].address = users[userIndex].address || [];
            users[userIndex].address.push(newAddress);
            
            localStorage.setItem("demo_users", JSON.stringify(users));
            
            return newAddress;
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
